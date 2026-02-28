"use client";

import { SocialEmbed } from "@/components/common/SocialEmbed";

const embeds: { type: "instagram" | "youtube"; url: string }[] = [
  {
    type: "youtube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/p/PLACEHOLDER1",
  },
  {
    type: "youtube",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  },
  {
    type: "instagram",
    url: "https://www.instagram.com/reel/PLACEHOLDER2",
  },
];

export function SocialSection() {
  return (
    <section className="bg-background py-14">
      <div className="yey-container">
        <h2 className="yey-heading mb-4 text-center text-3xl sm:text-4xl">
          Sosyal Medya
        </h2>
        <p className="yey-text-muted mx-auto mb-12 max-w-xl text-center text-lg">
          YouTube ve Instagram&apos;dan en son paylaşımlarımız.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {embeds.map((embed, i) => (
            <SocialEmbed key={i} type={embed.type} url={embed.url} />
          ))}
        </div>
      </div>
    </section>
  );
}
