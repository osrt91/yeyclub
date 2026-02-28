import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { ChevronRight, Clock, Eye } from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries/blog";
import { getPostGradient, getCategoryStyle } from "@/lib/data/blog-posts";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogCard } from "@/components/blog/BlogCard";

type Props = {
  params: Promise<{ slug: string }>;
};

function getReadTime(content: string | null): number {
  if (!content) return 2;
  const text = content.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post ? `${post.title} – YeyClub Blog` : "Yazı Bulunamadı",
    description: post?.excerpt ?? "YeyClub blog yazısı.",
  };
}

export default async function BlogDetayPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(
    post.category ?? "Topluluk",
    post.id,
    3
  );

  const gradient = getPostGradient(post.slug);
  const categoryStyle = getCategoryStyle(post.category ?? "Topluluk");
  const readTime = getReadTime(post.content);
  const publishedAt = post.published_at ?? post.created_at;
  const formattedDate = format(new Date(publishedAt), "d MMMM yyyy", {
    locale: tr,
  });

  const authorName = post.author?.full_name ?? "YeyClub Ekibi";
  const postUrl = `/blog/${post.slug}`;

  return (
    <div className="min-h-screen">
      <div
        className={`relative h-64 w-full overflow-hidden bg-gradient-to-br sm:h-80 lg:h-96 ${gradient}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="yey-container">
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${categoryStyle}`}
            >
              {post.category ?? "Topluluk"}
            </span>
          </div>
        </div>
      </div>

      <div className="yey-container py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-foreground/50">
          <Link href="/" className="transition-colors hover:text-yey-yellow">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/blog"
            className="transition-colors hover:text-yey-yellow"
          >
            Blog
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="line-clamp-1 text-foreground/80">{post.title}</span>
        </nav>

        <article className="max-w-3xl">
          <h1 className="yey-heading mb-6 text-3xl sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mb-8 flex flex-wrap items-center gap-4 text-foreground/70">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yey-turquoise to-yey-blue text-sm font-bold text-white">
                {authorName.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-medium">{authorName}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} dk okuma
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              ~{Math.floor(readTime * 12)} görüntülenme
            </span>
          </div>

          {post.content && (
            <div
              className="prose mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          <div className="mb-10">
            <ShareButtons title={post.title} url={postUrl} />
          </div>

          <div className="mb-12">
            <AuthorCard
              name={authorName}
              bio="YeyClub topluluğunu temsil eden ekip. Yardım organizasyonlarından iftar buluşmalarına, pikniklerden gönüllü projelerine kadar her etkinlikte birlikte."
            />
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="yey-heading mb-6 text-2xl">İlgili Yazılar</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <BlogCard key={related.id} post={related} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-yey-yellow"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Bloğa Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
