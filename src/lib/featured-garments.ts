import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import type { GarmentUnit } from '@/types/garment';

/** Etiqueta real Adidas — REAL AW JKT · JP4057 · EAN 4068807308923 · talla 2XL */
export const SERGIO_LLULL_AW_JACKET: GarmentUnit = {
  id: 'gu-rmb-llull-jp4057',
  qr_code: 'CMP-RMB-I9-P6-001',
  team_id: CLUB_TEAM_IDS.rmb,
  item_id: 'i9',
  item_name: 'Chubasquero Real Madrid AW JKT 25/26 (Adidas JP4057)',
  display_name: 'Chubasquero #23',
  category: 'chaqueta',
  player_id: 'p6',
  player_name: 'Sergio Llull',
  player_number: 23,
  size: '2XL',
  wash_count: 12,
  status: 'asignada',
  location: 'Vestuario principal — perchero #23 Llull',
  image_url: '/garments/rmb/llull-chubasquero-jp4057.jpg',
  last_wash_date: '2026-06-14',
  condition: 'bueno',
  last_scanned_at: null,
  product_ref: 'JP4057',
  barcode: '4068807308923',
  brand: 'Adidas',
  rfid_tag: 'EAN 696 KH',
  scan_aliases: [
    '4068807308923',
    '4 068807 308923',
    'JP4057',
    'REAL AW JKT',
    'JP4057-LLULL',
  ],
};

export function getFeaturedGarmentsForClub(slug: string): GarmentUnit[] {
  if (slug === 'rmb') return [SERGIO_LLULL_AW_JACKET];
  return [];
}
