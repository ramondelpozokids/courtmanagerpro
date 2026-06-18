"use client";

import React, { ReactNode } from "react";
import { AuthProvider as RealAuthProvider } from "./AuthContext";
import AppShell from "@/components/layout/AppShell";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <RealAuthProvider>
      <AppShell>
        {children}
      </AppShell>
    </RealAuthProvider>
  );
}
