"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useSupabase } from "@/hooks/use-supabase";
import type { Profile } from "@/types";

async function fetchProfile(
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

export function useAuth() {
  const supabase = useSupabase();
  const { user, profile, isLoading, setUser, setProfile, setLoading, clearAuth } =
    useAuthStore();

  useEffect(() => {
    setLoading(true);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(supabase, session.user.id);
        setProfile(userProfile);
      } else {
        clearAuth();
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(supabase, session.user.id).then(setProfile);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser, setProfile, setLoading, clearAuth]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      return { error };
    },
    [supabase, setLoading]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setLoading(false);
      return { data, error };
    },
    [supabase, setLoading]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    clearAuth();
    setLoading(false);
  }, [supabase, clearAuth, setLoading]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
    return { error };
  }, [supabase, setLoading]);

  return {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
}
