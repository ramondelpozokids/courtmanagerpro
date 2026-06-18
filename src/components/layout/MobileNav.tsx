"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Bell
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const mobileLinks = [
    { name: "Inicio", href: "/", icon: LayoutDashboard },
    { name: "Jugadores", href: "/players", icon: Users },
    { name: "Inventario", href: "/inventory", icon: Package },
    { name: "Peticiones", href: "/requests", icon: FileText },
    { name: "Alertas", href: "/alerts", icon: Bell },
  ];

  return (
    <nav className="md:hidden border-t border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 h-16 flex items-center justify-around px-2 z-10">
      {mobileLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 text-center transition-colors ${
              isActive
                ? "text-orange-500"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-semibold tracking-tight">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
