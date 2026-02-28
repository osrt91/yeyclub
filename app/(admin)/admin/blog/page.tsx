import type { Metadata } from "next";
import { getAllPosts } from "@/lib/queries/blog";
import { AdminBlogContent } from "@/components/admin/AdminBlogContent";

export const metadata: Metadata = {
  title: "Blog Yönetimi | YeyClub Admin",
  description: "YeyClub blog yazılarını yönetin.",
};

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return <AdminBlogContent initialPosts={posts} />;
}
