export type UserRole = 'admin' | 'member';
export type EventCategory = 'corba' | 'iftar' | 'eglence' | 'diger';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type RsvpStatus = 'attending' | 'maybe' | 'declined';
export type NotificationType = 'event' | 'rsvp' | 'system' | 'blog';
export type MediaType = 'image' | 'video';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  notification_prefs: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: EventCategory;
  event_date: string;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  cover_image: string | null;
  max_participants: number | null;
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EventWithCount extends Event {
  participant_count: number;
}

export interface EventRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: RsvpStatus;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  event_id: string | null;
  media_url: string;
  media_type: MediaType;
  caption: string | null;
  sort_order: number;
  uploaded_by: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
  author_id: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  type: NotificationType;
  read: boolean;
  created_at: string;
}
