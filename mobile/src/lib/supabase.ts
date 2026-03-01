import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

function getStorage() {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    const memoryStore: Record<string, string> = {};
    return {
      getItem: (key: string) => memoryStore[key] ?? null,
      setItem: (key: string, value: string) => { memoryStore[key] = value; },
      removeItem: (key: string) => { delete memoryStore[key]; },
    };
  }

  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return AsyncStorage;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
