import { View, Text, Pressable, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/auth-store';
import { Colors, Brand, Spacing, BorderRadius, FontSize } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const { user, profile, signOut } = useAuthStore();

  if (!user) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.backgroundElement }]}>
          <Ionicons name="person-outline" size={48} color={colors.textSecondary} />
        </View>
        <Text style={[styles.guestTitle, { color: colors.text }]}>Hoş Geldiniz!</Text>
        <Text style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
          Etkinliklere katılmak için giriş yapın
        </Text>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: Brand.yellow }]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Giriş Yap</Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryButton, { borderColor: Brand.yellow }]}
          onPress={() => router.push('/register')}
        >
          <Text style={[styles.secondaryButtonText, { color: Brand.yellow }]}>Kayıt Ol</Text>
        </Pressable>
      </View>
    );
  }

  const initials = (profile?.full_name ?? user.email ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: Brand.yellow }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {profile?.full_name ?? 'Kullanıcı'}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>
        {profile?.phone && (
          <Text style={[styles.phone, { color: colors.textSecondary }]}>{profile.phone}</Text>
        )}
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.menuSectionTitle, { color: colors.textSecondary }]}>HESAP</Text>
        <MenuItem icon="person-outline" label="Profili Düzenle" colors={colors} onPress={() => {}} />
        <MenuItem icon="notifications-outline" label="Bildirimler" colors={colors} onPress={() => {}} />
        <MenuItem icon="calendar-outline" label="Etkinliklerim" colors={colors} onPress={() => {}} />
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.menuSectionTitle, { color: colors.textSecondary }]}>DİĞER</Text>
        <MenuItem icon="information-circle-outline" label="Hakkımızda" colors={colors} onPress={() => {}} />
        <MenuItem icon="mail-outline" label="İletişim" colors={colors} onPress={() => {}} />
      </View>

      <Pressable style={[styles.signOutButton, { borderColor: Brand.red }]} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color={Brand.red} />
        <Text style={[styles.signOutText, { color: Brand.red }]}>Çıkış Yap</Text>
      </Pressable>

      <View style={{ height: Spacing.xxl * 2 }} />
    </ScrollView>
  );
}

function MenuItem({
  icon,
  label,
  colors,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={colors.text} />
        <Text style={[styles.menuItemLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  guestTitle: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.xs },
  guestSubtitle: {
    fontSize: FontSize.md,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  primaryButton: {
    width: '80%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  primaryButtonText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.md },
  secondaryButton: {
    width: '80%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: { fontWeight: '700', fontSize: FontSize.md },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: { color: '#FFF', fontSize: FontSize.xxl, fontWeight: '800' },
  name: { fontSize: FontSize.xl, fontWeight: '700' },
  email: { fontSize: FontSize.sm },
  phone: { fontSize: FontSize.sm },
  menuSection: { paddingHorizontal: Spacing.md, marginBottom: Spacing.lg },
  menuSectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuItemLabel: { fontSize: FontSize.md, fontWeight: '500' },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
  },
  signOutText: { fontSize: FontSize.md, fontWeight: '700' },
});
