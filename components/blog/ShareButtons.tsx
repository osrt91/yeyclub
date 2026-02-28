"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type ShareButtonsProps = {
  title: string;
  url: string;
};

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [fullUrl, setFullUrl] = useState(url);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFullUrl(`${window.location.origin}${url}`);
  }, [url]);

  const shareText = encodeURIComponent(`${title} - YeyClub`);
  const encodedUrl = encodeURIComponent(fullUrl);

  const shareLinks = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
      icon: Twitter,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
      icon: MessageCircle,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Bağlantı kopyalandı");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopyalama başarısız");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 flex items-center gap-1.5 text-sm text-foreground/70">
        <Share2 className="h-4 w-4" />
        Paylaş:
      </span>
      {shareLinks.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground/70 transition-all hover:border-yey-turquoise/30 hover:bg-yey-turquoise/10 hover:text-yey-turquoise"
          aria-label={`${label} ile paylaş`}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground/70 transition-all hover:border-yey-turquoise/30 hover:bg-yey-turquoise/10 hover:text-yey-turquoise"
        aria-label="Bağlantıyı kopyala"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
