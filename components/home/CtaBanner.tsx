import Link from "next/link";
import { Heart } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-yey-turquoise to-yey-turquoise/80 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1)_0%,transparent_50%)]" />

      <div className="yey-container relative z-10 text-center">
        <Heart className="mx-auto mb-6 h-12 w-12 text-white/80" />
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Topluluğumuza Katıl
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
          YeyClub ailesiyle tanış, etkinliklere katıl, yeni insanlarla tanış ve
          birlikte güzel anılar biriktir.
        </p>
        <Link
          href="/kayit"
          className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 font-semibold text-yey-turquoise transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
        >
          Hemen Kayıt Ol
        </Link>
      </div>
    </section>
  );
}
