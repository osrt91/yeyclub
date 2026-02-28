import Link from "next/link";
import { Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS, EVENT_CATEGORIES } from "@/lib/constants";

const quickLinks = NAV_LINKS.filter((link) =>
  ["/etkinlikler", "/galeri", "/takvim", "/hakkimizda", "/iletisim"].includes(
    link.href
  )
);

const categoryLinks = EVENT_CATEGORIES.map((cat) => ({
  href: `/etkinlikler?kategori=${cat.id}`,
  label: cat.label,
}));

export function Footer() {
  return (
    <footer className="bg-yey-dark-bg text-white">
      <div className="yey-container py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="mb-4 inline-block text-2xl font-bold tracking-tight"
            >
              <span className="text-yey-yellow">YEY</span>
              <span className="text-yey-turquoise">CLUB</span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-white/60">
              İstanbul&apos;un en enerjik gönüllü topluluğu. Yardım
              organizasyonlarından eğlence etkinliklerine, birlikte güzel işler yapıyoruz.
            </p>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-yey-yellow/20 hover:text-yey-yellow"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-yey-red/20 hover:text-yey-red"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-green-500/20 hover:text-green-400"
                aria-label="WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Hızlı Bağlantılar
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-yey-yellow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Etkinlik Türleri
            </h3>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-yey-turquoise"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              İletişim
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yey-turquoise" />
                İstanbul, Türkiye
              </li>
              <li>
                <a
                  href="mailto:info@yeyclub.com"
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-yey-yellow"
                >
                  <Mail className="h-4 w-4 shrink-0 text-yey-yellow" />
                  info@yeyclub.com
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-green-400"
                >
                  <Phone className="h-4 w-4 shrink-0 text-green-400" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="yey-container flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} YeyClub. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-white/30">
            Durma, Sende{" "}
            <span className="text-yey-yellow">YEY&apos;le</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
