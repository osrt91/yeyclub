import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  Target,
  Users,
  Eye,
  Zap,
  ArrowRight,
} from "lucide-react";
import { SocialSection } from "@/components/home/SocialSection";

export const metadata: Metadata = {
  title: "Hakkımızda | YeyClub",
  description:
    "YeyClub topluluğunun hikayesi, misyonu, vizyonu ve ekibi hakkında bilgi edinin.",
  openGraph: {
    title: "Hakkımızda | YeyClub",
    description:
      "İstanbul'un en enerjik gönüllü topluluğu YeyClub hakkında her şey.",
  },
};

const timeline = [
  {
    year: "2023",
    text: "WhatsApp grubumuz kuruldu (5 kişi)",
    color: "bg-yey-yellow",
  },
  {
    year: "2024",
    text: "İlk çorba dağıtımı (15 gönüllü)",
    color: "bg-yey-turquoise",
  },
  {
    year: "2025",
    text: "50+ aktif üye, düzenli etkinlikler",
    color: "bg-yey-blue",
  },
  {
    year: "2026",
    text: "YeyClub platformu yayında!",
    color: "bg-yey-red",
  },
];

const values = [
  {
    title: "Dayanışma",
    desc: "Birlikte daha güçlüyüz. Her zorlukta yan yana duruyoruz.",
    icon: Heart,
    accent: "text-yey-red",
    bg: "bg-yey-red/10",
    border: "border-yey-red/20",
  },
  {
    title: "Gönüllülük",
    desc: "Karşılıksız vererek büyüyoruz. Her katkı değerli.",
    icon: Users,
    accent: "text-yey-turquoise",
    bg: "bg-yey-turquoise/10",
    border: "border-yey-turquoise/20",
  },
  {
    title: "Şeffaflık",
    desc: "Tüm süreçlerimiz açık ve hesap verebilir.",
    icon: Eye,
    accent: "text-yey-blue",
    bg: "bg-yey-blue/10",
    border: "border-yey-blue/20",
  },
  {
    title: "Enerji",
    desc: "Pozitif enerjiyle harekete geçiyoruz. Durma, sende YEY'le!",
    icon: Zap,
    accent: "text-yey-yellow",
    bg: "bg-yey-yellow/10",
    border: "border-yey-yellow/20",
  },
];

const team = [
  { name: "Ahmet Y.", role: "Kurucu", gradient: "from-yey-yellow to-yey-red" },
  {
    name: "Elif K.",
    role: "Etkinlik Koordinatörü",
    gradient: "from-yey-turquoise to-yey-blue",
  },
  {
    name: "Mert S.",
    role: "İletişim",
    gradient: "from-yey-blue to-yey-turquoise",
  },
  {
    name: "Zeynep A.",
    role: "Gönüllü Koordinatörü",
    gradient: "from-yey-red to-yey-yellow",
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-yey-dark-bg to-yey-dark-bg/95 py-28 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,151,178,0.12)_0%,transparent_60%)]" />
        <div className="yey-container relative z-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-yey-turquoise">
            Topluluk ruhuyla büyüyoruz
          </p>
          <h1 className="yey-heading text-5xl text-white sm:text-6xl lg:text-7xl">
            Hakkımızda
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            İstanbul&apos;un kalbinde, gönüllülük ruhuyla bir araya gelen bir
            topluluğuz. Birlikte üretmek, paylaşmak ve büyümek için buradayız.
          </p>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="bg-background py-20">
        <div className="yey-container grid gap-8 md:grid-cols-2">
          <div className="yey-card group relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yey-red/10 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-yey-red/10 p-3">
                <Heart className="h-7 w-7 text-yey-red" />
              </div>
              <h2 className="yey-heading mb-3 text-2xl">Misyonumuz</h2>
              <p className="yey-text-muted text-lg leading-relaxed">
                İstanbul&apos;da ihtiyaç sahiplerine ulaşmak, topluluk
                bilincini güçlendirmek ve sürdürülebilir dayanışma kültürü
                oluşturmak.
              </p>
            </div>
          </div>

          <div className="yey-card group relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yey-turquoise/10 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-yey-turquoise/10 p-3">
                <Target className="h-7 w-7 text-yey-turquoise" />
              </div>
              <h2 className="yey-heading mb-3 text-2xl">Vizyonumuz</h2>
              <p className="yey-text-muted text-lg leading-relaxed">
                Her mahalleye ulaşan, sürdürülebilir bir gönüllülük ağı
                oluşturmak ve toplumsal değişime öncülük etmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hikayemiz - Timeline */}
      <section className="bg-foreground/[0.03] py-20">
        <div className="yey-container">
          <h2 className="yey-heading mb-4 text-center text-3xl sm:text-4xl">
            Hikayemiz
          </h2>
          <p className="yey-text-muted mx-auto mb-16 max-w-xl text-center text-lg">
            Küçük bir WhatsApp grubundan büyük bir topluluğa uzanan yolculuğumuz.
          </p>

          <div className="relative mx-auto max-w-3xl">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-gradient-to-b from-yey-yellow via-yey-turquoise to-yey-red md:left-1/2 md:block md:-translate-x-px" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className="relative flex items-start gap-6 md:gap-0"
                >
                  {/* Mobile dot */}
                  <div className="relative z-10 flex-shrink-0 md:hidden">
                    <div
                      className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center shadow-lg`}
                    >
                      <div className="h-3 w-3 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div
                    className={`w-full md:flex md:items-center ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`md:w-[calc(50%-2rem)] ${
                        i % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
                      }`}
                    >
                      <div className="yey-card">
                        <span
                          className={`text-sm font-bold ${
                            item.color
                              .replace("bg-", "text-")
                          }`}
                        >
                          {item.year}
                        </span>
                        <p className="mt-1 text-foreground">{item.text}</p>
                      </div>
                    </div>

                    {/* Desktop dot */}
                    <div className="relative z-10 hidden md:flex md:w-16 md:justify-center">
                      <div
                        className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center shadow-lg ring-4 ring-background`}
                      >
                        <div className="h-3.5 w-3.5 rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="bg-background py-20">
        <div className="yey-container">
          <h2 className="yey-heading mb-4 text-center text-3xl sm:text-4xl">
            Değerlerimiz
          </h2>
          <p className="yey-text-muted mx-auto mb-12 max-w-xl text-center text-lg">
            Bizi bir arada tutan ve yönlendiren temel ilkeler.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className={`group rounded-xl border ${v.border} bg-background/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div
                    className={`mx-auto mb-4 inline-flex rounded-2xl ${v.bg} p-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-8 w-8 ${v.accent}`} />
                  </div>
                  <h3 className="yey-heading mb-2 text-xl">{v.title}</h3>
                  <p className="yey-text-muted text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ekibimiz */}
      <section className="bg-foreground/[0.03] py-20">
        <div className="yey-container">
          <h2 className="yey-heading mb-4 text-center text-3xl sm:text-4xl">
            Ekibimiz
          </h2>
          <p className="yey-text-muted mx-auto mb-12 max-w-xl text-center text-lg">
            YeyClub&apos;ı ayakta tutan harika insanlar.
          </p>

          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="yey-card group text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-2xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  {member.name.charAt(0)}
                </div>
                <h3 className="yey-heading text-lg">{member.name}</h3>
                <p className="yey-text-muted mt-1 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SocialSection />

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-yey-dark-bg to-yey-dark-bg py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,181,50,0.15)_0%,transparent_50%),radial-gradient(circle_at_70%_50%,rgba(0,151,178,0.15)_0%,transparent_50%)]" />
        <div className="yey-container relative z-10 text-center">
          <h2 className="yey-heading mb-4 text-3xl text-white sm:text-4xl">
            Sen de Aramıza Katıl
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-lg text-white/60">
            Gönüllülük ağımıza katıl, birlikte güzel şeyler yapalım.
          </p>
          <Link href="/kayit" className="yey-btn-primary group text-lg">
            Bize Katıl
            <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
