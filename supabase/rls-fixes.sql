-- ═══════════════════════════════════════════════════════════════════════════════
-- YeyClub RLS Security Fixes
-- Generated: 2026-02-28
-- Addresses: 2 CRITICAL, 11 HIGH, and select MEDIUM findings
-- ═══════════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 1: CRITICAL - Privilege Escalation via role column
-- A user can UPDATE profiles SET role='admin' on their own row,
-- then the FOR ALL admin policy grants them full access to everything.
-- Solution: BEFORE UPDATE trigger that prevents role changes by non-admins.
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.protect_role_column()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS protect_role_on_profiles ON public.profiles;
CREATE TRIGGER protect_role_on_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_role_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 2: CRITICAL - Open notification INSERT (WITH CHECK = true)
-- Anyone (including anonymous) can create notifications for any user.
-- Solution: Restrict to authenticated users creating notifications only via
-- service_role or admin. For client-side, use a SECURITY DEFINER function.
-- ═══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      auth.uid() = user_id
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 3: HIGH - INSERT policies missing ownership binding
-- Users can set created_by/author_id/uploaded_by to another user's ID.
-- Solution: Bind ownership columns to auth.uid().
-- ═══════════════════════════════════════════════════════════════════════════════

-- 3a. Events: bind created_by
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- 3b. Blog posts: bind author_id
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can create blog posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

-- 3c. Gallery items: bind uploaded_by
DROP POLICY IF EXISTS "Authenticated users can add gallery items" ON public.gallery_items;
CREATE POLICY "Authenticated users can add gallery items"
  ON public.gallery_items FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND uploaded_by = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 4: HIGH - Notification DELETE policy missing
-- Users cannot clean up their own notifications.
-- Solution: Allow users to delete their own notifications.
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 5: HIGH - Storage policies missing ownership checks
-- Any authenticated user can delete/update ANY file in storage buckets.
-- Solution: Add owner check (Supabase stores uploader as owner column).
-- ═══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Authenticated users can update event covers" ON storage.objects;
CREATE POLICY "Authenticated users can update event covers"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'event-covers' AND (auth.uid())::text = (owner)::text);

DROP POLICY IF EXISTS "Authenticated users can update blog covers" ON storage.objects;
CREATE POLICY "Authenticated users can update blog covers"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-covers' AND (auth.uid())::text = (owner)::text);

DROP POLICY IF EXISTS "Authenticated users can delete event covers" ON storage.objects;
CREATE POLICY "Authenticated users can delete event covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'event-covers' AND (
    (auth.uid())::text = (owner)::text
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  ));

DROP POLICY IF EXISTS "Authenticated users can delete blog covers" ON storage.objects;
CREATE POLICY "Authenticated users can delete blog covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-covers' AND (
    (auth.uid())::text = (owner)::text
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  ));

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 6: MEDIUM - UPDATE policies missing explicit WITH CHECK
-- Without WITH CHECK, PostgreSQL uses USING as WITH CHECK by default.
-- Adding explicit WITH CHECK for clarity and to prevent row migration.
-- ═══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Creators and admins can update events" ON public.events;
CREATE POLICY "Creators and admins can update events"
  ON public.events FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Authors and admins can update blog posts" ON public.blog_posts;
CREATE POLICY "Authors and admins can update blog posts"
  ON public.blog_posts FOR UPDATE
  USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 7: MEDIUM - SECURITY DEFINER function without search_path
-- handle_new_user is vulnerable to search_path hijacking.
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER FUNCTION public.handle_new_user() SET search_path = public, auth;
ALTER FUNCTION public.protect_role_column() SET search_path = public;

-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION: Re-check policies after fixes
-- ═══════════════════════════════════════════════════════════════════════════════
-- Run: SELECT tablename, policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
