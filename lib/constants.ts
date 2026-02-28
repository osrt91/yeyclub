/**
 * YeyClub Design System - Color Palette
 */
export const COLORS = {
  yeyYellow: "#FFB532",
  yeyTurquoise: "#0097B2",
  yeyBlue: "#5583A9",
  yeyRed: "#F05638",
  yeyIceBlue: "#CAF0F8",
  yeyDarkBg: "#1A1A2E",
} as const

/**
 * Site configuration
 */
export const SITE_CONFIG = {
  siteName: "YeyClub",
  siteDescription: "YeyClub - Topluluk etkinlikleri ve paylaşımlar",
  siteUrl: "https://yeyclub.com",
  defaultLocale: "tr",
  ogImage: "/og-image.png",
} as const

/**
 * Navigation links
 */
export const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/blog", label: "Blog" },
  { href: "/takvim", label: "Takvim" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/hakkimizda", label: "Hakkımızda" },
] as const

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/yeyclub",
  youtube: "https://youtube.com/@yeyclub",
  whatsapp: "https://wa.me/905551234567",
} as const

/**
 * Event categories with Turkish labels and icons
 */
export const EVENT_CATEGORIES = [
  { id: "corba", label: "Yardım", icon: "❤️" },
  { id: "iftar", label: "İftar & Ramazan", icon: "🌙" },
  { id: "eglence", label: "Eğlence", icon: "🎉" },
  { id: "diger", label: "Sosyal Sorumluluk", icon: "🤝" },
] as const

export type EventCategoryId = (typeof EVENT_CATEGORIES)[number]["id"]
