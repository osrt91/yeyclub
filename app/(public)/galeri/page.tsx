import type { Metadata } from "next";
import { getGalleryItems, getGalleryEvents } from "@/lib/queries/gallery";
import { GalleryPageContent } from "@/components/gallery/GalleryPageContent";

export const metadata: Metadata = {
  title: "Galeri – YeyClub",
  description: "Etkinliklerimizden anılar ve paylaşımlar.",
};

export default async function GaleriPage() {
  const [items, events] = await Promise.all([
    getGalleryItems(),
    getGalleryEvents(),
  ]);

  return (
    <div className="yey-container py-20">
      <div className="mb-10">
        <h1 className="yey-heading mb-3 text-4xl">Galeri</h1>
        <p className="yey-text-muted text-lg">
          Etkinliklerimizden anılar ve paylaşımlar
        </p>
      </div>

      <GalleryPageContent items={items} events={events} />
    </div>
  );
}
