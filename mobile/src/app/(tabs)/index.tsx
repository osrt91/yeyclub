import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Colors, Brand, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { EVENT_CATEGORIES } from '@/lib/constants';
import type { EventWithCount } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUpcoming = async () => {
    const { data } = await supabase
      .from('events')
      .select('*, event_rsvps(count)')
      .eq('status', 'upcoming')
      .order('event_date', { ascending: true })
      .limit(5);

    if (data) {
      setEvents(
        data.map((e: any) => ({
          ...e,
          participant_count: e.event_rsvps?.[0]?.count ?? 0,
        }))
      );
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUpcoming();
    setRefreshing(false);
  };

  const getCategoryInfo = (id: string) =>
    EVENT_CATEGORIES.find((c) => c.id === id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Brand.yellow}
        />
      }
    >
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: Brand.yellow }]}>
        <Text style={styles.heroTitle}>{'Durma Sende\nYEY\'le!'}</Text>
        <Text style={styles.heroSubtitle}>İstanbul'un en enerjik topluluğu</Text>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Kategoriler</Text>
        <View style={styles.categoryRow}>
          {EVENT_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryCard,
                { backgroundColor: colors.backgroundElement },
              ]}
              onPress={() =>
                router.push({
                  pathname: '/events',
                  params: { category: cat.id },
                })
              }
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryLabel, { color: colors.text }]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Yaklaşan Etkinlikler
          </Text>
          <Pressable onPress={() => router.push('/events')}>
            <Text style={{ color: Brand.turquoise, fontWeight: '600' }}>Tümü</Text>
          </Pressable>
        </View>
        {events.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={40}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Henüz yaklaşan etkinlik yok
            </Text>
          </View>
        ) : (
          events.map((event) => {
            const cat = getCategoryInfo(event.category);
            return (
              <Pressable
                key={event.id}
                style={[
                  styles.eventCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => router.push(`/event/${event.slug}`)}
              >
                <View
                  style={[
                    styles.eventCategoryBadge,
                    { backgroundColor: cat?.color ?? Brand.yellow },
                  ]}
                >
                  <Text style={styles.eventCategoryText}>
                    {cat?.icon} {cat?.label}
                  </Text>
                </View>
                <Text style={[styles.eventTitle, { color: colors.text }]}>
                  {event.title}
                </Text>
                <View style={styles.eventMeta}>
                  <View style={styles.eventMetaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.eventMetaText, { color: colors.textSecondary }]}
                    >
                      {new Date(event.event_date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  {event.location_name && (
                    <View style={styles.eventMetaItem}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color={colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.eventMetaText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {event.location_name}
                      </Text>
                    </View>
                  )}
                  <View style={styles.eventMetaItem}>
                    <Ionicons
                      name="people-outline"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.eventMetaText, { color: colors.textSecondary }]}
                    >
                      {event.participant_count} katılımcı
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  heroTitle: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: FontSize.lg,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  section: { paddingHorizontal: Spacing.md, marginTop: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  categoryRow: { flexDirection: 'row', gap: Spacing.sm },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  categoryIcon: { fontSize: 24 },
  categoryLabel: { fontSize: FontSize.xs, fontWeight: '600' },
  eventCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  eventCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  eventCategoryText: {
    color: '#FFFFFF',
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  eventMeta: { gap: Spacing.xs },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eventMetaText: { fontSize: FontSize.sm },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  emptyText: { fontSize: FontSize.md },
});
