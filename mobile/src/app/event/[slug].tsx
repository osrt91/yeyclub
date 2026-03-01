import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import { Colors, Brand, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { EVENT_CATEGORIES, RSVP_OPTIONS } from '@/lib/constants';
import type { Event, EventRsvp, RsvpStatus } from '@/types';

export default function EventDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const { user } = useAuthStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [rsvp, setRsvp] = useState<EventRsvp | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      setEvent(data as Event);

      const { count } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', data.id)
        .eq('status', 'attending');
      setParticipantCount(count ?? 0);

      if (user) {
        const { data: rsvpData } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('event_id', data.id)
          .eq('user_id', user.id)
          .single();
        if (rsvpData) setRsvp(rsvpData as EventRsvp);
      }
    }
    setLoading(false);
  };

  const handleRsvp = async (status: RsvpStatus) => {
    if (!user) {
      Alert.alert('Giriş Gerekli', 'RSVP yapmak için giriş yapmalısınız.');
      return;
    }
    if (!event) return;

    setRsvpLoading(true);
    const { data, error } = await supabase
      .from('event_rsvps')
      .upsert(
        { event_id: event.id, user_id: user.id, status },
        { onConflict: 'event_id,user_id' }
      )
      .select()
      .single();

    if (error) {
      Alert.alert('Hata', 'RSVP güncellenirken bir hata oluştu.');
    } else if (data) {
      setRsvp(data as EventRsvp);
      fetchEvent();
    }
    setRsvpLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={Brand.yellow} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
          Etkinlik bulunamadı
        </Text>
      </View>
    );
  }

  const cat = EVENT_CATEGORIES.find((c) => c.id === event.category);
  const eventDate = new Date(event.event_date);

  return (
    <>
      <Stack.Screen options={{ title: event.title }} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {event.cover_image && (
          <Image
            source={{ uri: event.cover_image }}
            style={styles.coverImage}
            contentFit="cover"
            transition={300}
          />
        )}

        <View style={styles.content}>
          <View style={[styles.badge, { backgroundColor: cat?.color ?? Brand.yellow }]}>
            <Text style={styles.badgeText}>
              {cat?.icon} {cat?.label}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>

          <View style={[styles.infoCard, { backgroundColor: colors.backgroundElement }]}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color={Brand.yellow} />
              <View>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Tarih</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {eventDate.toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {eventDate.toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>

            {event.location_name && (
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color={Brand.turquoise} />
                <View>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Konum</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {event.location_name}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <Ionicons name="people" size={20} color={Brand.blue} />
              <View>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Katılımcı</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {participantCount}
                  {event.max_participants ? ` / ${event.max_participants}` : ''} kişi
                </Text>
              </View>
            </View>
          </View>

          {event.description && (
            <View style={styles.descriptionSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Açıklama</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {event.description}
              </Text>
            </View>
          )}

          <View style={styles.rsvpSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Katılım Durumu</Text>
            <View style={styles.rsvpButtons}>
              {RSVP_OPTIONS.map((option) => {
                const isSelected = rsvp?.status === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.rsvpButton,
                      {
                        backgroundColor: isSelected
                          ? option.color
                          : colors.backgroundElement,
                        borderColor: isSelected ? option.color : colors.border,
                      },
                    ]}
                    onPress={() => handleRsvp(option.id)}
                    disabled={rsvpLoading}
                  >
                    {rsvpLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={isSelected ? '#FFF' : colors.text}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.rsvpButtonText,
                          { color: isSelected ? '#FFF' : colors.text },
                        ]}
                      >
                        {option.label}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={{ height: Spacing.xxl * 2 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  notFoundText: { fontSize: FontSize.md },
  coverImage: { width: '100%', height: 220 },
  content: { padding: Spacing.md },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  badgeText: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '600' },
  title: { fontSize: FontSize.xxl, fontWeight: '800', marginBottom: Spacing.md },
  infoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  infoLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: { fontSize: FontSize.md, fontWeight: '500' },
  descriptionSection: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  description: { fontSize: FontSize.md, lineHeight: 24 },
  rsvpSection: { marginBottom: Spacing.lg },
  rsvpButtons: { flexDirection: 'row', gap: Spacing.sm },
  rsvpButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  rsvpButtonText: { fontSize: FontSize.sm, fontWeight: '700' },
});
