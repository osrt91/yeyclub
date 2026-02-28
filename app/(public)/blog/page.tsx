import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { getPublishedPosts } from "@/lib/queries/blog";
import { BlogPageContent } from "@/components/blog/BlogPageContent";

export const metadata: Metadata = {
  title: "Blog – YeyClub",
  description: "Topluluk hikayeleri, etkinlik haberleri ve duyurular.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="yey-container py-16 md:py-20">
      <header className="mb-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yey-turquoise/20">
            <FileText className="h-6 w-6 text-yey-turquoise" />
          </div>
          <div>
            <h1 className="yey-heading text-4xl">Blog</h1>
            <p className="yey-text-muted mt-1 text-lg">
              Topluluk hikayeleri, etkinlik haberleri ve duyurular
            </p>
          </div>
        </div>
      </header>

      <BlogPageContent posts={posts} />
    </div>
  );
}
