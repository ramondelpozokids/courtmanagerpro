'use client';

import { PortalBackHeader } from '@/components/legal/LegalPageView';
import { ExternalLink, ShoppingBag } from 'lucide-react';

const SHOP_URL = 'https://shop.realmadrid.com/collections/jerseys-kits-basketball';

const products = [
  {
    name: 'Camiseta Juego Local',
    price: '€85.00',
    img: 'https://shop.realmadrid.com/cdn/shop/files/image_07d5be34-9b06-4afd-9aa9-2bfd0a489720.jpg?v=1768385431&width=832',
  },
  {
    name: 'Camiseta Visitante',
    price: '€85.00',
    img: 'https://shop.realmadrid.com/cdn/shop/files/image_b4701b50-3403-4235-ab4f-d74f11c29772.jpg?v=1767814661&width=832',
  },
  {
    name: 'Pantalón Corto Local',
    price: '€45.00',
    img: 'https://shop.realmadrid.com/cdn/shop/files/image_3e0e5795-0cfe-45e7-8b2d-607ea47a8d94.jpg?v=1768407965&width=832',
  },
  {
    name: 'Cortavientos Técnico',
    price: '€95.00',
    img: 'https://shop.realmadrid.com/cdn/shop/files/image_0dc6e676-5277-4b85-9620-74d9e6e37daa.jpg?v=1768385666&width=832',
  },
];

export default function TiendaPage() {
  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <PortalBackHeader
        title="Tienda Oficial RMB"
        subtitle="Colección técnica de baloncesto 25/26 — vista desde CourtManager Pro"
      />

      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
        Permaneces en CourtManager Pro. Pulsa <strong>Volver al Dashboard</strong> para regresar.
        La compra oficial se realiza en la tienda del Real Madrid (enlace abajo, nueva pestaña).
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
          <ShoppingBag className="h-5 w-5 text-emerald-500" />
          Colección 25/26
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p.name}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 space-y-2"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-white">{p.name}</h3>
              <p className="text-orange-600 font-bold text-sm">{p.price}</p>
            </div>
          ))}
        </div>
      </section>

      <a
        href={SHOP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors"
      >
        Ir a la tienda oficial shop.realmadrid.com
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
