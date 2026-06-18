"use client";

import { Sidebar } from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <TopBar />

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>

        {/* Mobile Navigation Bar */}
        <MobileNav />
      </div>
    </div>
  );
}
