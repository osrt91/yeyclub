import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  setProfile: (profile) => set({ profile }),

  fetchProfile: async () => {
    const { user } = get();
    if (!user) {
      set({ profile: null });
      return;
    }
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      set({ profile: data as Profile | null });
    } catch {
      set({ profile: null });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        await get().fetchProfile();
      }
    } finally {
      set({ loading: false, initialized: true });
    }
  },
}));
