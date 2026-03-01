export const SITE_CONFIG = {
  siteName: 'YeyClub',
  siteDescription: 'YeyClub - Topluluk etkinlikleri ve paylaşımlar',
  siteUrl: 'https://yeyclub.com',
} as const;

export const EVENT_CATEGORIES = [
  { id: 'corba' as const, label: 'Yardım', icon: '❤️', color: '#F05638' },
  { id: 'iftar' as const, label: 'İftar & Ramazan', icon: '🌙', color: '#FFB532' },
  { id: 'eglence' as const, label: 'Eğlence', icon: '🎉', color: '#0097B2' },
  { id: 'diger' as const, label: 'Sosyal Sorumluluk', icon: '🤝', color: '#5583A9' },
] as const;

export const RSVP_OPTIONS = [
  { id: 'attending' as const, label: 'Katılıyorum', color: '#22C55E' },
  { id: 'maybe' as const, label: 'Belki', color: '#FFB532' },
  { id: 'declined' as const, label: 'Katılmıyorum', color: '#F05638' },
] as const;
