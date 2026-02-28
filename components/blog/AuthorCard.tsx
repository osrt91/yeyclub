import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";

type AuthorCardProps = {
  name: string;
  bio: string;
  avatarUrl?: string | null;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AuthorCard({ name, bio, avatarUrl }: AuthorCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yey-turquoise to-yey-blue text-xl font-bold text-white">
            {getInitials(name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="mt-1 text-sm text-foreground/70">{bio}</p>
          <Link
            href="/blog"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-yey-turquoise transition-colors hover:text-yey-yellow"
          >
            <FileText className="h-4 w-4" />
            Tüm Yazılarını Gör
          </Link>
        </div>
      </div>
    </div>
  );
}
