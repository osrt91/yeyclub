import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFB532",
};

export const metadata: Metadata = {
  title: {
    default: "YeyClub - Durma Sende YEY'le",
    template: "%s | YeyClub",
  },
  description:
    "YeyClub - İstanbul'un en enerjik topluluk platformu. Yardım organizasyonları, iftar buluşmaları ve eğlence etkinlikleriyle topluluk ruhunu yaşa!",
  metadataBase: new URL("https://yeyclub.com"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://yeyclub.com",
    siteName: "YeyClub",
    title: "YeyClub - Durma Sende YEY'le",
    description:
      "İstanbul'un en enerjik topluluk platformu. Etkinliklere katıl, topluluğun parçası ol!",
  },
  twitter: {
    card: "summary_large_image",
    title: "YeyClub - Durma Sende YEY'le",
    description:
      "İstanbul'un en enerjik topluluk platformu.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
