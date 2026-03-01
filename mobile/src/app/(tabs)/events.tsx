import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  RefreshControl,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Colors, Brand, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { EVENT_CATEGORIES } from '@/lib/constants';
import type { EventWithCount, EventCategory } from '@/types';

export default function EventsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>(
    (params.category as EventCategory) ?? 'all'
  );

  const fetchEvents = useCallback(async () => {
    let query = supabase
      .from('events')
      .select('*, event_rsvps(count)')
      .order('event_date', { ascending: true });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }
    if (search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`);
    }

    const { data } = await query;
    if (data) {
      setEvents(
        data.map((e: any) => ({
          ...e,
          participant_count: e.event_rsvps?.[0]?.count ?? 0,
        }))
      );
    }
    setLoading(false);
  }, [selectedCategory, search]);

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const getCategoryInfo = (id: string) =>
    EVENT_CATEGORIES.find((c) => c.id === id);

  const allCategories = [
    { id: 'all' as const, label: 'Tümü', icon: '📋', color: Brand.yellow },
    ...EVENT_CATEGORIES,
  ];

  const renderEvent = ({ item }: { item: EventWithCount }) => {
    const cat = getCategoryInfo(item.category);
    return (
      <Pressable
        style={[
          styles.eventCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => router.push(`/event/${item.slug}`)}
      >
        <View
          style={[
            styles.badge,
            { backgroundColor: cat?.color ?? Brand.yellow },
          ]}
        >
          <Text style={styles.badgeText}>
            {cat?.icon} {cat?.label}
          </Text>
        </View>
        <Text style={[styles.eventTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {new Date(item.event_date).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
        {item.location_name && (
          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {item.location_name}
            </Text>
          </View>
        )}
        <View style={styles.metaRow}>
          <Ionicons
            name="people-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.participant_count} katılımcı
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.backgroundElement },
        ]}
      >
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Etkinlik ara..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allCategories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.filterContainer}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedCategory === item.id
                    ? Brand.yellow
                    : colors.backgroundElement,
              },
            ]}
            onPress={() =>
              setSelectedCategory(item.id as EventCategory | 'all')
            }
          >
            <Text style={styles.filterIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                {
                  color:
                    selectedCategory === item.id ? '#FFF' : colors.text,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Brand.yellow} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Brand.yellow}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Etkinlik bulunamadı
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: FontSize.md },
  filterContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  filterIcon: { fontSize: 14 },
  filterLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
  eventCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  badgeText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '600' },
  eventTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  metaText: { fontSize: FontSize.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: {
    alignItems: 'center',
    marginTop: Spacing.xxl * 2,
    gap: Spacing.md,
  },
  emptyText: { fontSize: FontSize.md },
});
