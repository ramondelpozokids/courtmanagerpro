import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AppProvider } from '@/contexts/AppContext';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { SITE_KEYWORDS, SITE_URL } from '@/content/seo';
import { SECURITY_SCRIPT } from '@/lib/securityLayers';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CourtManager Pro — Gestión de Utilería ACB',
    template: '%s | CourtManager Pro',
  },
  description:
    'Plataforma SaaS de gestión de utilería, tallajes, inventario QR, lavandería, viajes y material médico para equipos profesionales de baloncesto. Real Madrid Baloncesto demo.',
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'Ramón del Pozo Rott' }, { name: 'Carlos Rodriguez Kobe' }],
  creator: 'Ramón del Pozo Rott',
  publisher: 'CourtManager Pro',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: 'CourtManager Pro',
    title: 'CourtManager Pro — Utilería Profesional de Baloncesto',
    description: 'Control de equipación, tallajes, inventario con QR y logística ACB/Euroliga.',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'CourtManager Pro' }],
  },
  twitter: {
    card: 'summary',
    title: 'CourtManager Pro',
    description: 'Gestión integral de utilería para clubes de baloncesto profesional.',
    images: ['/logo.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CourtManager Pro',
  },
  alternates: { canonical: SITE_URL },
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
              {children}
              <ToastContainer />
            </NotificationProvider>
          </AppProvider>
        </AuthProvider>
        <script dangerouslySetInnerHTML={{ __html: SECURITY_SCRIPT }} />
      </body>
    </html>
  );
}
