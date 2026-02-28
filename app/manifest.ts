import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YeyClub - Durma Sende YEY'le",
    short_name: "YeyClub",
    description: "İstanbul'un en enerjik topluluk platformu",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1A2E",
    theme_color: "#FFB532",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
