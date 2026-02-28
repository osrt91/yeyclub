import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/helpers";
import { MOCK_POSTS } from "@/lib/data/blog-posts";
import { logger } from "@/lib/logger";
import type { BlogPost, BlogPostWithAuthor } from "@/types";

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_POSTS.filter((p) => p.published);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch published posts", error);
      return MOCK_POSTS.filter((p) => p.published);
    }
    return (data as BlogPost[]) ?? [];
  } catch (error) {
    logger.error("Published posts query failed", error);
    return MOCK_POSTS.filter((p) => p.published);
  }
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPostWithAuthor | null> {
  if (!isSupabaseConfigured()) {
    const post = MOCK_POSTS.find((p) => p.slug === slug);
    return post ? { ...post, author: null } : null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, author:profiles!author_id(id, full_name, avatar_url)")
      .eq("slug", slug)
      .single();

    if (error) {
      logger.error("Failed to fetch post by slug", error);
      const post = MOCK_POSTS.find((p) => p.slug === slug);
      return post ? { ...post, author: null } : null;
    }

    const { author, ...postData } = data as Record<string, unknown>;
    return {
      ...(postData as unknown as BlogPost),
      author: (author as BlogPostWithAuthor["author"]) ?? null,
    };
  } catch (error) {
    logger.error("Post by slug query failed", error);
    return null;
  }
}

export async function getRelatedPosts(
  category: string,
  excludeId: string,
  limit = 3
): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_POSTS.filter(
      (p) => p.category === category && p.id !== excludeId && p.published
    ).slice(0, limit);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .eq("published", true)
      .neq("id", excludeId)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      logger.error("Failed to fetch related posts", error);
      return [];
    }
    return (data as BlogPost[]) ?? [];
  } catch (error) {
    logger.error("Related posts query failed", error);
    return [];
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return MOCK_POSTS;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch all posts", error);
      return MOCK_POSTS;
    }
    return (data as BlogPost[]) ?? [];
  } catch (error) {
    logger.error("All posts query failed", error);
    return MOCK_POSTS;
  }
}
