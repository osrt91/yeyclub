import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Brand, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <>
      <Stack.Screen options={{ title: 'Sayfa Bulunamadı' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.title, { color: colors.text }]}>404</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Aradığınız sayfa bulunamadı
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: Brand.yellow }]}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  title: { fontSize: FontSize.hero, fontWeight: '800' },
  subtitle: { fontSize: FontSize.md, textAlign: 'center' },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.md },
});
