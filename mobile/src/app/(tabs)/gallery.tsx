import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  RefreshControl,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Colors, Brand, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import type { GalleryItem } from '@/types';

const { width } = Dimensions.get('window');
const COLUMN_GAP = Spacing.sm;
const ITEM_WIDTH = (width - Spacing.md * 2 - COLUMN_GAP) / 2;

export default function GalleryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setItems(data as GalleryItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGallery();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: GalleryItem }) => (
    <Pressable style={styles.gridItem}>
      <Image
        source={{ uri: item.media_url }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      {item.caption && (
        <View style={styles.captionOverlay}>
          <Text style={styles.captionText} numberOfLines={2}>
            {item.caption}
          </Text>
        </View>
      )}
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={Brand.yellow} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
              name="images-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Galeri henüz boş
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  row: { gap: COLUMN_GAP, marginBottom: COLUMN_GAP },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Spacing.sm,
  },
  captionText: { color: '#FFF', fontSize: FontSize.xs },
  empty: {
    alignItems: 'center',
    marginTop: Spacing.xxl * 2,
    gap: Spacing.md,
  },
  emptyText: { fontSize: FontSize.md },
});
