"use client";

import { Sidebar } from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import { ChatAssistant } from "../shared/ChatAssistant";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { footerLegalLinks } from "@/content/legal";

export default function AppShell({ children }: { children: ReactNode }) {
  const [showScroll, setShowScroll] = useState(false);

  // Check scroll position to show/hide the "scroll-to-top" button
  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.querySelector("main");
      if (scrollable) {
        setShowScroll(scrollable.scrollTop > 300);
      }
    };
    const scrollable = document.querySelector("main");
    if (scrollable) {
      scrollable.addEventListener("scroll", handleScroll);
    }
    return () => scrollable?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const scrollable = document.querySelector("main");
    scrollable?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <TopBar />

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
            {children}
          </div>

          {/* Premium legal footer */}
          <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-400 mt-12 flex flex-col md:flex-row items-center justify-between px-6 pr-24 md:pr-28 gap-4">
            <div suppressHydrationWarning={true}>
              &copy; {new Date().getFullYear()} <strong>CourtManager Pro</strong>. Creado por <strong>Ramón del Pozo</strong>.
            </div>
            <div className="flex flex-wrap gap-4 font-bold uppercase tracking-wider text-[9px] justify-center md:justify-end">
              {footerLegalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </footer>
        </main>

        {/* Mobile Navigation Bar */}
        <MobileNav />
      </div>

      {/* Premium Chat Assistant Widget */}
      <ChatAssistant />

      {/* Scroll to top: bottom-right, left of chat logo — clears footer & mobile nav */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-[4.75rem] z-40 p-3 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white shadow-lg hover:scale-105 transition-all"
          title="Subir arriba"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
