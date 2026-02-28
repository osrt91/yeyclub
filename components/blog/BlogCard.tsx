import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

const GRADIENT_PLACEHOLDERS = [
  "from-yey-turquoise/60 to-yey-blue/40",
  "from-yey-yellow/50 to-yey-red/30",
  "from-yey-red/40 to-yey-yellow/30",
  "from-yey-blue/50 to-yey-ice-blue/30",
  "from-yey-turquoise/50 to-yey-ice-blue/40",
] as const;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Topluluk: ["topluluk", "hikaye", "organize", "birlikte"],
  Etkinlik: ["etkinlik", "piknik", "iftar", "çorba", "dağıtım"],
  Gönüllülük: ["gönüllü", "gönüllülük", "rehber"],
  Duyuru: ["duyuru", "yol", "harita", "program", "2026"],
};

function getCategory(title: string): string {
  const lower = title.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return cat;
  }
  return "Topluluk";
}

function getReadTime(content: string | null): number {
  if (!content) return 2;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getGradientIndex(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % GRADIENT_PLACEHOLDERS.length;
}

const CATEGORY_STYLES: Record<string, string> = {
  Topluluk: "bg-yey-turquoise/20 text-yey-turquoise",
  Etkinlik: "bg-yey-yellow/20 text-yey-yellow",
  Gönüllülük: "bg-yey-blue/20 text-yey-blue",
  Duyuru: "bg-yey-red/20 text-yey-red",
};

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const category = post.category ?? getCategory(post.title);
  const readTime = getReadTime(post.content);
  const gradient = GRADIENT_PLACEHOLDERS[getGradientIndex(post.slug)];
  const dateStr = post.published_at ?? post.created_at;
  const formattedDate = format(new Date(dateStr), "d MMMM yyyy", { locale: tr });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-yey-turquoise/20 bg-background/80 shadow-lg backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-yey-turquoise/10 hover:border-yey-turquoise/40",
        featured && "md:flex md:flex-row"
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          featured ? "h-52 md:h-72 md:w-1/2" : "h-44"
        )}
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br",
              gradient
            )}
          />
        )}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold",
            CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Topluluk
          )}
        >
          {category}
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col p-5", featured && "md:justify-center")}>
        <h3
          className={cn(
            "font-bold text-foreground transition-colors line-clamp-2 group-hover:text-yey-turquoise",
            featured ? "text-xl md:text-2xl" : "text-lg"
          )}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="yey-text-muted mt-2 line-clamp-3 text-sm">{post.excerpt}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 shrink-0 rounded-full bg-yey-turquoise/20" />
            <span className="text-sm text-foreground/70">YeyClub Ekibi</span>
          </div>
          <span className="text-sm text-foreground/50">{formattedDate}</span>
          <span className="flex items-center gap-1 text-sm text-foreground/50">
            <Clock className="h-3.5 w-3.5" />
            {readTime} dk okuma
          </span>
        </div>
      </div>
    </Link>
  );
}
