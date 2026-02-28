"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogIn, UserPlus } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-foreground/10",
        "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="yey-container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-xl font-bold text-yey-yellow transition-colors hover:text-yey-yellow/90"
        >
          YeyClub
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Ana menü">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium text-foreground/90 transition-colors hover:text-yey-yellow",
                  isActive && "text-yey-yellow"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yey-yellow" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/giris"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-foreground/10 hover:text-yey-yellow"
            >
              <LogIn className="h-4 w-4" />
              Giriş
            </Link>
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 rounded-lg bg-yey-yellow px-4 py-2 text-sm font-medium text-yey-dark-bg transition-colors hover:bg-yey-yellow/90"
            >
              <UserPlus className="h-4 w-4" />
              Kayıt
            </Link>
          </div>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menüyü aç"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2.5 transition-colors hover:bg-foreground/10 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden"
            aria-modal="true"
            role="dialog"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-4">
                <span className="text-xl font-bold text-yey-yellow">YeyClub</span>
                <button
                  type="button"
                  aria-label="Menüyü kapat"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2.5 transition-colors hover:bg-foreground/10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <motion.nav
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-1 flex-col gap-1 px-4 py-6"
                aria-label="Mobil menü"
              >
                {NAV_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-lg px-4 py-3 text-lg font-medium transition-colors",
                        isActive
                          ? "bg-yey-yellow/20 text-yey-yellow"
                          : "text-foreground/90 hover:bg-foreground/10 hover:text-yey-yellow"
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <div className="mt-6 flex flex-col gap-2 border-t border-foreground/10 pt-6">
                  <Link
                    href="/giris"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-foreground/90 hover:bg-foreground/10"
                  >
                    <LogIn className="h-5 w-5" />
                    Giriş
                  </Link>
                  <Link
                    href="/kayit"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-2 rounded-lg bg-yey-yellow px-4 py-3 font-medium text-yey-dark-bg hover:bg-yey-yellow/90"
                  >
                    <UserPlus className="h-5 w-5" />
                    Kayıt
                  </Link>
                </div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
