import Link from "next/link";
import { Home, Star } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-yey-yellow/20 to-yey-turquoise/20 blur-2xl" />
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2">
            <Star className="h-8 w-8 text-yey-yellow" fill="currentColor" />
            <span className="text-6xl font-black tracking-tighter text-yey-yellow">
              404
            </span>
            <Star className="h-8 w-8 text-yey-yellow" fill="currentColor" />
          </div>
          <h1 className="yey-heading mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            Sayfa Bulunamadı
          </h1>
          <p className="yey-text-muted mb-10 max-w-md text-lg">
            Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link
            href="/"
            className="yey-btn-primary group inline-flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Ana Sayfaya Dön
          </Link>
          <p className="mt-8 text-sm text-foreground/50">
            Durma, Sende <span className="font-semibold text-yey-yellow">YEY&apos;le</span>
          </p>
        </div>
      </div>
    </div>
  );
}
