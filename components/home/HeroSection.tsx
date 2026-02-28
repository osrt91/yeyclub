"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

function CountUp({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, target]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 50, suffix: "+", label: "Üye" },
  { value: 20, suffix: "+", label: "Etkinlik" },
  { value: 3, suffix: "+", label: "Yıl" },
];

const floatingStars = [
  { top: "10%", left: "5%", size: 16, delay: 0 },
  { top: "20%", left: "90%", size: 12, delay: 0.5 },
  { top: "60%", left: "8%", size: 20, delay: 1 },
  { top: "70%", left: "93%", size: 14, delay: 1.5 },
  { top: "40%", left: "15%", size: 10, delay: 2 },
  { top: "30%", left: "85%", size: 18, delay: 0.8 },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-yey-dark-bg via-yey-dark-bg/98 to-yey-dark-bg/90 px-4">
      {floatingStars.map((star, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-yey-yellow/20"
          style={{ top: star.top, left: star.left }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4 + star.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        >
          <Star size={star.size} fill="currentColor" />
        </motion.div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,181,50,0.08)_0%,transparent_70%)]" />

      <div className="yey-container relative z-10 text-center">
        <motion.h1
          className="yey-heading mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Durma, Sende{" "}
          <span className="bg-gradient-to-r from-yey-yellow to-yey-yellow/80 bg-clip-text text-transparent">
            YEY&apos;le!
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-12 max-w-2xl text-lg text-white/70 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          İstanbul&apos;un en enerjik topluluğuna katıl. Çorba dağıtımından
          iftar organizasyonlarına, eğlence etkinliklerinden sosyal sorumluluk
          projelerine — birlikte daha güçlüyüz.
        </motion.p>

        <motion.div
          className="mx-auto mb-12 flex max-w-lg justify-center gap-8 sm:gap-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-yey-yellow sm:text-4xl">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Link
            href="/etkinlikler"
            className="yey-btn-primary group w-full sm:w-auto"
          >
            Etkinlikleri Keşfet
            <ArrowRight className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/kayit" className="yey-btn-secondary w-full sm:w-auto">
            Topluluğa Katıl
          </Link>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
