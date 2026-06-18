import type { MetadataRoute } from 'next';

const BASE = 'https://courtmanagerpro.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '', 'players', 'inventory', 'inventory/scanner', 'sizing', 'requests',
    'trips', 'laundry', 'medical', 'reports', 'alerts', 'calendario', 'tienda',
    'blog', 'blog/noticias', 'aviso-legal', 'politica-privacidad', 'proteccion-datos',
    'politica-cookies', 'mapa-sitio', 'condiciones-uso',
  ];

  return routes.map((path) => ({
    url: path ? `${BASE}/${path}` : BASE,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
