import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Youtube,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "İletişim | YeyClub",
  description:
    "YeyClub ile iletişime geçin. Sorularınız, önerileriniz ve iş birliği talepleriniz için bize ulaşın.",
  openGraph: {
    title: "İletişim | YeyClub",
    description: "YeyClub topluluğuyla iletişime geçin.",
  },
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Adres",
    value: "İstanbul, Türkiye",
    href: null,
  },
  {
    icon: Mail,
    label: "E-posta",
    value: "info@yeyclub.com",
    href: "mailto:info@yeyclub.com",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+90 555 123 4567",
    href: "https://wa.me/905551234567",
  },
];

export default function IletisimPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-yey-dark-bg to-yey-dark-bg/95 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,181,50,0.1)_0%,transparent_60%)]" />
        <div className="yey-container relative z-10">
          <div className="mx-auto mb-4 inline-flex rounded-2xl bg-yey-yellow/10 p-4">
            <Mail className="h-8 w-8 text-yey-yellow" />
          </div>
          <h1 className="yey-heading text-5xl text-white sm:text-6xl">
            İletişim
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
            Bizimle iletişime geçin. Sorularınız, önerileriniz ve geri
            bildirimleriniz için buradayız.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-20">
        <div className="yey-container grid gap-12 lg:grid-cols-5">
          {/* Left - Contact Info */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="yey-heading mb-6 text-2xl">İletişim Bilgileri</h2>
              <div className="space-y-5">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 rounded-xl bg-yey-turquoise/10 p-3">
                        <Icon className="h-5 w-5 text-yey-turquoise" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground/50">
                          {info.label}
                        </p>
                        <p className="font-medium text-foreground">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  );

                  return info.href ? (
                    <a
                      key={info.label}
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl p-3 transition-colors hover:bg-foreground/[0.03]"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={info.label} className="rounded-xl p-3">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social */}
            <div className="yey-card">
              <h3 className="yey-heading mb-4 text-lg">Sosyal Medya</h3>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/yeyclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-foreground/10 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-yey-red/30 hover:bg-yey-red/5 hover:text-yey-red"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <a
                  href="https://youtube.com/@yeyclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-foreground/10 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-yey-red/30 hover:bg-yey-red/5 hover:text-yey-red"
                >
                  <Youtube className="h-4 w-4" />
                  YouTube
                </a>
              </div>
            </div>

            {/* Working hours */}
            <div className="yey-card">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-yey-yellow/10 p-3">
                  <Clock className="h-5 w-5 text-yey-yellow" />
                </div>
                <div>
                  <h3 className="yey-heading text-lg">Çalışma Saatleri</h3>
                  <p className="yey-text-muted mt-1 text-sm">
                    7/24 WhatsApp üzerinden ulaşabilirsiniz
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
