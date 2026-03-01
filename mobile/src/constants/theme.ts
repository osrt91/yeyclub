import { Platform } from 'react-native';

export const Brand = {
  yellow: '#FFB532',
  turquoise: '#0097B2',
  blue: '#5583A9',
  red: '#F05638',
  iceBlue: '#CAF0F8',
  darkBg: '#1A1A2E',
} as const;

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    background: '#FFFFFF',
    backgroundElement: '#F3F4F6',
    backgroundSelected: '#E5E7EB',
    card: '#FFFFFF',
    border: '#E5E7EB',
    primary: Brand.yellow,
    secondary: Brand.turquoise,
    accent: Brand.blue,
    error: Brand.red,
    tabBar: '#FFFFFF',
    tabBarActive: Brand.yellow,
    tabBarInactive: '#9CA3AF',
    headerBg: '#FFFFFF',
  },
  dark: {
    text: '#F0F0F0',
    textSecondary: '#9CA3AF',
    background: Brand.darkBg,
    backgroundElement: '#2D2D44',
    backgroundSelected: '#3D3D5C',
    card: '#2D2D44',
    border: '#3D3D5C',
    primary: Brand.yellow,
    secondary: Brand.turquoise,
    accent: Brand.blue,
    error: Brand.red,
    tabBar: Brand.darkBg,
    tabBarActive: Brand.yellow,
    tabBarInactive: '#6B7280',
    headerBg: Brand.darkBg,
  },
} as const;

export type ThemeColors = typeof Colors.light;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  default: { sans: 'normal', mono: 'monospace' },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 34,
} as const;
