import type { z } from "zod";
import type {
  profileRowSchema,
  eventRowSchema,
  eventRsvpRowSchema,
  galleryItemRowSchema,
  blogPostRowSchema,
  notificationRowSchema,
} from "@/lib/schemas";

export type Profile = z.infer<typeof profileRowSchema>;
export type Event = z.infer<typeof eventRowSchema>;
export type EventRsvp = z.infer<typeof eventRsvpRowSchema>;
export type GalleryItem = z.infer<typeof galleryItemRowSchema>;
export type BlogPost = z.infer<typeof blogPostRowSchema>;
export type Notification = z.infer<typeof notificationRowSchema>;

export type EventWithCount = Event & { participant_count: number };
export type BlogPostWithAuthor = BlogPost & { author?: Profile | null };
