import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import { Colors, Brand, Spacing, BorderRadius, FontSize } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const { fetchProfile } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      Alert.alert('Giriş Başarısız', error.message);
      setLoading(false);
      return;
    }

    await fetchProfile();
    setLoading(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={[styles.logoCircle, { backgroundColor: Brand.yellow }]}>
            <Text style={styles.logoText}>YC</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>YEY CLUB</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Hesabınıza giriş yapın
          </Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>E-posta</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}
            >
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="ornek@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.text }]}>Şifre</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[styles.loginButton, { backgroundColor: Brand.yellow }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            )}
          </Pressable>

          <View style={styles.registerRow}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              Hesabınız yok mu?
            </Text>
            <Pressable
              onPress={() => {
                router.back();
                router.push('/register');
              }}
            >
              <Text style={[styles.registerLink, { color: Brand.turquoise }]}>Kayıt Ol</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: { color: '#FFF', fontSize: FontSize.xxl, fontWeight: '800' },
  title: { fontSize: FontSize.xxl, fontWeight: '800', marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md },
  form: { gap: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.xs },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 50,
    gap: Spacing.sm,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: FontSize.md },
  loginButton: {
    height: 50,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  loginButtonText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '700' },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  registerText: { fontSize: FontSize.sm },
  registerLink: { fontSize: FontSize.sm, fontWeight: '700' },
});
