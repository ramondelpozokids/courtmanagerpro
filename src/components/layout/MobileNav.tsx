"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Package,
  Bell,
  QrCode,
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const mobileLinks = [
    { name: "Inicio", href: "/", icon: LayoutDashboard },
    { name: "Jugadores", href: "/players", icon: Users },
    { name: "Escanear", href: "/inventory/scanner", icon: QrCode, highlight: true },
    { name: "Stock", href: "/inventory", icon: Package },
    { name: "Alertas", href: "/alerts", icon: Bell },
  ];

  return (
    <nav className="md:hidden border-t border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 h-16 flex items-center justify-around px-2 z-10">
      {mobileLinks.map((link) => {
        const isActive = pathname === link.href || (link.href === "/inventory/scanner" && pathname.startsWith("/scan"));
        const Icon = link.icon;
        const highlight = "highlight" in link && link.highlight;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 text-center transition-colors ${
              highlight
                ? isActive
                  ? "text-orange-500"
                  : "text-orange-400"
                : isActive
                  ? "text-orange-500"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <span className={highlight ? "relative" : undefined}>
              <Icon className={`h-5 w-5 shrink-0 ${highlight ? "h-6 w-6" : ""}`} />
              {highlight && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </span>
            <span className={`font-semibold tracking-tight ${highlight ? "text-[9px] font-black" : "text-[10px]"}`}>
              {link.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
