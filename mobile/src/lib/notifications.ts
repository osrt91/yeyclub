import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Varsayılan',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFB532',
    });

    await Notifications.setNotificationChannelAsync('events', {
      name: 'Etkinlikler',
      description: 'Etkinlik hatırlatmaları ve duyuruları',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFB532',
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const token = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return token.data;
}

export async function savePushToken(userId: string, token: string) {
  await supabase
    .from('profiles')
    .update({ push_token: token })
    .eq('id', userId);
}

export async function schedulEventReminder(
  eventTitle: string,
  eventDate: Date,
  minutesBefore: number = 60
) {
  const triggerDate = new Date(eventDate.getTime() - minutesBefore * 60 * 1000);

  if (triggerDate <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Etkinlik Hatırlatması',
      body: `"${eventTitle}" etkinliği ${minutesBefore} dakika sonra başlıyor!`,
      data: { type: 'event_reminder' },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
