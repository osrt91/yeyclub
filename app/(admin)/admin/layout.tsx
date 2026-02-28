"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Calendar,
  Users,
  Image,
  FileText,
  Bell,
  Settings,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/etkinlikler", label: "Etkinlikler", icon: Calendar },
  { href: "/admin/uyeler", label: "Üyeler", icon: Users },
  { href: "/admin/galeri", label: "Galeri", icon: Image },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/bildirim", label: "Bildirimler", icon: Bell },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-foreground/10 px-6 py-5">
        <Shield className="h-6 w-6 text-yey-yellow" />
        <span className="text-lg font-bold text-foreground">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin menüsü">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-yey-yellow/20 text-yey-yellow"
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-foreground/10 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          Siteye Dön
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-foreground/10 bg-background transition-transform duration-200 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-5 rounded-lg p-1.5 text-foreground/60 transition-colors hover:bg-foreground/10"
          aria-label="Menüyü kapat"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-foreground/10 bg-background lg:block">
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-foreground/10 bg-background/80 px-4 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground/60 transition-colors hover:bg-foreground/10 lg:hidden"
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-yey-yellow">YEY</span>
            <span className="text-sm font-bold text-yey-turquoise">CLUB</span>
            <span className="yey-text-muted text-sm">Yönetim</span>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
