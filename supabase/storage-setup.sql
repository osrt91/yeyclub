INSERT INTO storage.buckets (id, name, public)
VALUES
  ('event-covers', 'event-covers', true),
  ('blog-covers', 'blog-covers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for event-covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-covers');

CREATE POLICY "Public read access for blog-covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated users can upload event covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload blog covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event covers"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'event-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog covers"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'event-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-covers' AND auth.role() = 'authenticated');
