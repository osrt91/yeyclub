import { useEffect, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, useColorScheme } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import { Colors, Brand } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { initialize, setSession } = useAuthStore();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        useAuthStore.getState().fetchProfile();

        if (Platform.OS !== 'web') {
          import('@/lib/notifications').then(({ registerForPushNotifications, savePushToken }) => {
            registerForPushNotifications().then((token) => {
              if (token && session.user) {
                savePushToken(session.user.id, token);
              }
            });
          });
        }
      }
    });

    if (Platform.OS !== 'web') {
      import('expo-notifications').then((Notifications) => {
        const received = Notifications.addNotificationReceivedListener(() => {});
        const response = Notifications.addNotificationResponseReceivedListener((resp) => {
          const data = resp.notification.request.content.data;
          if (data?.type === 'event_reminder' && data?.slug) {
            router.push(`/event/${data.slug}`);
          }
        });
        cleanupRef.current = () => {
          received.remove();
          response.remove();
        };
      });
    }

    return () => {
      subscription.unsubscribe();
      cleanupRef.current?.();
    };
  }, []);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.headerBg },
          headerTintColor: Brand.yellow,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{ title: 'Giriş Yap', presentation: 'modal' }}
        />
        <Stack.Screen
          name="register"
          options={{ title: 'Kayıt Ol', presentation: 'modal' }}
        />
        <Stack.Screen
          name="event/[slug]"
          options={{ title: 'Etkinlik Detay', headerBackTitle: 'Geri' }}
        />
        <Stack.Screen name="+not-found" options={{ title: 'Sayfa Bulunamadı' }} />
      </Stack>
    </>
  );
}
