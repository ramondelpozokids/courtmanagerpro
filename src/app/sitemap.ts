import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '', 'players', 'inventory', 'inventory/scanner', 'sizing', 'requests',
    'trips', 'transporte', 'laundry', 'medical', 'reports', 'alerts', 'calendario', 'tienda',
    'prepartido', 'convocatoria', 'botas', 'postpartido', 'incidencias',
    'hotel-vestuario', 'repuestos', 'caducidades-medico',
    'blog', 'blog/noticias', 'login', 'registro', 'seguridad',
    'aviso-legal', 'politica-privacidad', 'proteccion-datos',
    'politica-cookies', 'mapa-sitio', 'condiciones-uso',
  ];

  return routes.map((path) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
