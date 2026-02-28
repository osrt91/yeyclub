"use client";

interface SocialEmbedProps {
  type: "instagram" | "youtube";
  url: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function extractInstagramPath(url: string): string | null {
  const match = url.match(
    /instagram\.com\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/
  );
  if (match?.[1] && match?.[2]) return `/${match[1]}/${match[2]}`;
  return null;
}

export function SocialEmbed({ type, url }: SocialEmbedProps) {
  if (type === "youtube") {
    const videoId = extractYouTubeId(url);

    if (!videoId) {
      return (
        <div className="flex aspect-video items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          Geçersiz YouTube bağlantısı
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl shadow-lg">
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    );
  }

  if (type === "instagram") {
    const path = extractInstagramPath(url);

    if (!path) {
      return (
        <div className="flex aspect-square items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          Geçersiz Instagram bağlantısı
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl shadow-lg">
        <iframe
          src={`https://www.instagram.com${path}/embed`}
          title="Instagram gönderi"
          allowTransparency
          loading="lazy"
          className="min-h-[480px] w-full border-0"
        />
      </div>
    );
  }

  return null;
}
