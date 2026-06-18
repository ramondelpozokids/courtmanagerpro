import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import type { Player, Request } from '@/types';

export function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return !url || url.includes('your-project') || url.includes('dummy-project');
}

/** Use demo roster when Supabase is empty or unreachable (production without seed data). */
export function shouldUseDemoFallback(rows: unknown[] | null | undefined): boolean {
  return !rows || rows.length === 0;
}

export function mapDemoPlayers(teamId: string = 'team-acb-123'): Player[] {
  return db.players.map((p) => ({
    id: p.id,
    team_id: teamId,
    user_id: p.id === 'p1' ? 'u1' : null,
    dorsal: p.number,
    full_name: `${p.firstName} ${p.lastName}`,
    position: p.position.toLowerCase() as Player['position'],
    nationality: p.nationality || 'España',
    birth_date: p.birthDate || '1995-01-01',
    photo_url: p.imageUrl || null,
    is_active: p.status === 'ACTIVE',
    shirt_size: p.sizes.jersey,
    shorts_size: p.sizes.shorts,
    shoe_size: Number(p.sizes.shoes) || 46,
    jacket_size: p.sizes.warmupShirt,
    underwear_size: 'XL',
    sock_size: p.sizes.socks,
    suit_size: '52',
    hat_size: 'M',
    jersey_name: p.lastName.toUpperCase(),
    contract_end: '2027-06-30',
    notes: null,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export function mapDemoInventory(teamId: string = 'team-acb-123') {
  return db.inventory.map((item) => ({
    ...item,
    team_id: teamId,
    stock_available: item.stock_available ?? item.stock_total ?? item.stock ?? 0,
    stock_min: item.stock_min ?? item.minStock ?? 5,
    qr_code: item.qr_code ?? item.sku,
    unit_cost: item.unit_cost ?? item.price ?? 0,
    updated_at: item.updated_at ?? new Date().toISOString(),
  }));
}

export function mapDemoRequests(teamId: string = 'team-acb-123'): Request[] {
  return db.requests.map((r) => ({
    id: r.id,
    team_id: teamId,
    requester_id: 'u1',
    player_id: r.playerId,
    title: `Petición: ${r.itemName}`,
    description: r.notes || null,
    priority: 'normal' as const,
    status: (r.status === 'PENDING'
      ? 'pendiente'
      : r.status === 'APPROVED'
        ? 'aprobada'
        : r.status === 'DELIVERED'
          ? 'completada'
          : 'rechazada') as Request['status'],
    category: 'camiseta_juego' as const,
    quantity: r.quantity,
    size: r.size,
    estimated_cost: 85,
    actual_cost: 85,
    approved_by: null,
    approved_at: null,
    completed_by: null,
    completed_at: null,
    rejection_reason: null,
    due_date: null,
    attachments: [],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })) as unknown as Request[];
}
