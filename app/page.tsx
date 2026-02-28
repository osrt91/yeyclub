import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { UpcomingEventsSection } from "@/components/home/UpcomingEventsSection";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "YeyClub - Topluluk Etkinlikleri",
  description: "YeyClub ile topluluk etkinliklerini keşfet, katıl ve paylaş.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="py-12">
        <div className="yey-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="yey-heading mb-6 text-3xl sm:text-4xl">
                Biz Kimiz?
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-foreground/70">
                YeyClub, İstanbul merkezli bir gönüllü topluluğudur. 2023
                yılından bu yana sosyal sorumluluk projeleri, kültürel
                etkinlikler ve eğlence organizasyonları düzenliyoruz.
              </p>
              <p className="mb-8 leading-relaxed text-foreground/60">
                Amacımız, birlikte güzel şeyler yapmak, topluma katkı sağlamak
                ve bu süreçte kalıcı dostluklar kurmaktır.
              </p>
              <Link
                href="/hakkimizda"
                className="group inline-flex items-center gap-2 font-medium text-yey-turquoise transition-colors hover:text-yey-turquoise/80"
              >
                Daha Fazla
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="yey-card flex aspect-video items-center justify-center bg-gradient-to-br from-yey-turquoise/10 to-yey-yellow/10">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-yey-yellow">
                  YEY
                </div>
                <div className="text-xl font-medium text-foreground/40">
                  Birlikte Daha Güçlüyüz
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoriesSection />
      <UpcomingEventsSection />
      <CtaBanner />
    </>
  );
}
