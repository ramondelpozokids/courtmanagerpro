import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AppProvider } from '@/contexts/AppContext';
import { ToastContainer } from '@/components/shared/ToastContainer';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'CourtManager Pro',
  description: 'Gestión integral de utilería para equipos profesionales de baloncesto ACB',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CourtManager Pro',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          <AppProvider>
            <NotificationProvider>
              <AppShell>
                {children}
              </AppShell>
              <ToastContainer />
            </NotificationProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
