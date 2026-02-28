import { z } from "zod";

// =============================================================================
// ENUMS
// =============================================================================

export const userRoleEnum = z.enum(["admin", "member"]);
export const eventCategoryEnum = z.enum(["corba", "iftar", "eglence", "diger"]);
export const eventStatusEnum = z.enum([
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);
export const rsvpStatusEnum = z.enum(["attending", "maybe", "declined"]);
export const notificationTypeEnum = z.enum(["event", "rsvp", "system", "blog"]);
export const mediaTypeEnum = z.enum(["image", "video"]);

// =============================================================================
// ROW SCHEMAS (DB row shape)
// =============================================================================

export const profileRowSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  avatar_url: z.string().nullable(),
  phone: z.string().nullable(),
  role: userRoleEnum,
  notification_prefs: z.record(z.string(), z.boolean()),
  created_at: z.string(),
  updated_at: z.string(),
});

export const eventRowSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  category: eventCategoryEnum,
  event_date: z.string(),
  location_name: z.string().nullable(),
  location_lat: z.number().nullable(),
  location_lng: z.number().nullable(),
  cover_image: z.string().nullable(),
  max_participants: z.number().int().nullable(),
  status: eventStatusEnum,
  created_by: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const eventRsvpRowSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: rsvpStatusEnum,
  created_at: z.string(),
});

export const galleryItemRowSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid().nullable(),
  media_url: z.string(),
  media_type: mediaTypeEnum,
  caption: z.string().nullable(),
  sort_order: z.number().int(),
  uploaded_by: z.string().uuid(),
  created_at: z.string(),
});

export const blogPostRowSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  content: z.string().nullable(),
  excerpt: z.string().nullable(),
  category: z.string().nullable(),
  cover_image: z.string().nullable(),
  author_id: z.string().uuid(),
  published: z.boolean(),
  published_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const notificationRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  message: z.string().nullable(),
  type: notificationTypeEnum,
  read: z.boolean(),
  created_at: z.string(),
});

// =============================================================================
// INPUT SCHEMAS (for creating/updating)
// =============================================================================

export const createEventSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  slug: z.string().min(3, "Slug en az 3 karakter olmalı"),
  description: z.string().nullable().optional(),
  category: eventCategoryEnum,
  event_date: z.string(),
  location_name: z.string().nullable().optional(),
  location_lat: z.number().nullable().optional(),
  location_lng: z.number().nullable().optional(),
  cover_image: z.string().nullable().optional(),
  max_participants: z.number().int().positive().nullable().optional(),
  status: eventStatusEnum.optional(),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid(),
});

export const createBlogPostSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  slug: z.string().min(3, "Slug en az 3 karakter olmalı"),
  content: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  cover_image: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  id: z.string().uuid(),
});

export const upsertRsvpSchema = z.object({
  event_id: z.string().uuid(),
  status: rsvpStatusEnum,
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "İsim en az 2 karakter olmalı").optional(),
  phone: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  notification_prefs: z.record(z.string(), z.boolean()).optional(),
});

export const createGalleryItemSchema = z.object({
  event_id: z.string().uuid().nullable().optional(),
  media_url: z.string().url("Geçerli bir URL giriniz"),
  media_type: mediaTypeEnum.optional(),
  caption: z.string().nullable().optional(),
  sort_order: z.number().int().optional(),
});

export const createNotificationSchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().nullable().optional(),
  type: notificationTypeEnum.optional(),
});

export const sendBulkNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().nullable().optional(),
  type: notificationTypeEnum.optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta giriniz"),
  subject: z.string().min(3, "Konu en az 3 karakter olmalı"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});
