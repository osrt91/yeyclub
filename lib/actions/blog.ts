"use server";

import { createClient } from "@/lib/supabase/server";
import { withActionHandler, type ActionResult } from "@/lib/action-handler";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { validateInput } from "@/lib/validate";
import { sanitizeTextInput } from "@/lib/sanitize";
import { createBlogPostSchema, updateBlogPostSchema } from "@/lib/schemas";
import { logger } from "@/lib/logger";
import type { BlogPost } from "@/types";

export async function createBlogPost(
  input: unknown
): Promise<ActionResult<BlogPost>> {
  return withActionHandler("createBlogPost", async () => {
    const authUser = await requireAuth();
    const data = validateInput(createBlogPostSchema, input);

    const supabase = await createClient();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert({
        ...data,
        title: sanitizeTextInput(data.title),
        excerpt: data.excerpt ? sanitizeTextInput(data.excerpt) : null,
        author_id: authUser.id,
        published_at: data.published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    logger.audit("blog.created", { postId: post.id, userId: authUser.id });
    return post as BlogPost;
  });
}

export async function updateBlogPost(
  input: unknown
): Promise<ActionResult<BlogPost>> {
  return withActionHandler("updateBlogPost", async () => {
    const authUser = await requireAuth();
    const data = validateInput(updateBlogPostSchema, input);

    if (authUser.role !== "admin") {
      const supabase = await createClient();
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("author_id")
        .eq("id", data.id)
        .single();

      if (existing?.author_id !== authUser.id) {
        throw new Error("Bu işlem için yetkiniz yok.");
      }
    }

    const supabase = await createClient();
    const updateData: Record<string, unknown> = { ...data };
    delete updateData.id;

    if (data.title) updateData.title = sanitizeTextInput(data.title);
    if (data.excerpt) updateData.excerpt = sanitizeTextInput(data.excerpt);

    if (data.published !== undefined) {
      updateData.published_at = data.published
        ? new Date().toISOString()
        : null;
    }

    const { data: post, error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw error;

    logger.audit("blog.updated", { postId: data.id, userId: authUser.id });
    return post as BlogPost;
  });
}

export async function deleteBlogPost(postId: string): Promise<ActionResult> {
  return withActionHandler("deleteBlogPost", async () => {
    const authUser = await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);

    if (error) throw error;

    logger.audit("blog.deleted", { postId, userId: authUser.id });
  });
}

export async function togglePublishPost(
  postId: string,
  published: boolean
): Promise<ActionResult<BlogPost>> {
  return withActionHandler("togglePublishPost", async () => {
    const authUser = await requireAuth();

    const supabase = await createClient();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .update({
        published,
        published_at: published ? new Date().toISOString() : null,
      })
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;

    logger.audit("blog.togglePublish", {
      postId,
      published,
      userId: authUser.id,
    });
    return post as BlogPost;
  });
}
