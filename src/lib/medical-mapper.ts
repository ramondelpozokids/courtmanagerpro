import type { MedicalItem as UiMedicalItem } from '@/domain/entities/MedicalItem';

export type MedicalUiItem = UiMedicalItem & {
  kit?: string;
  brand?: string;
  category?: string;
  prescription_required?: boolean;
  reference?: string | null;
  unit_cost?: number | null;
};

function computeStatus(expiryDate: string | null | undefined, stock: number, stockMin: number): UiMedicalItem['status'] {
  if (expiryDate) {
    const exp = new Date(expiryDate);
    const now = new Date();
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    if (exp < now) return 'EXPIRED';
    if (exp <= in30) return 'EXPIRING_SOON';
  }
  if (stock <= stockMin) return 'EXPIRING_SOON';
  return 'OK';
}

export function medicalRowToUi(row: Record<string, unknown>): MedicalUiItem {
  const expiry = row.expiry_date ? String(row.expiry_date).slice(0, 10) : '';
  const qty = Number(row.stock_total ?? 0);
  const min = Number(row.stock_min ?? 1);
  return {
    id: String(row.id),
    name: String(row.name),
    quantity: qty,
    minQuantity: min,
    expiryDate: expiry || '—',
    batchNumber: String(row.batch_number || '—'),
    status: computeStatus(expiry || null, qty, min),
    location: String(row.location || row.kit || '—'),
    kit: row.kit ? String(row.kit) : String(row.location || ''),
    brand: row.brand ? String(row.brand) : undefined,
    category: row.category ? String(row.category) : undefined,
    prescription_required: Boolean(row.prescription_required),
    reference: row.reference ? String(row.reference) : null,
    unit_cost: row.unit_cost != null ? Number(row.unit_cost) : null,
  };
}

export function medicalUiToDb(
  body: {
    name: string;
    kit?: string;
    location?: string;
    quantity?: number;
    minQuantity?: number;
    expiryDate?: string;
    batchNumber?: string;
    category?: string;
    brand?: string;
    prescription_required?: boolean;
  },
  teamId: string
) {
  const kit = body.kit || body.location || 'Armario Central';
  return {
    team_id: teamId,
    name: body.name,
    category: body.category || 'material_cura',
    brand: body.brand || null,
    stock_total: body.quantity ?? 0,
    stock_min: body.minQuantity ?? 5,
    expiry_date: body.expiryDate || null,
    batch_number: body.batchNumber || `B-${Math.floor(1000 + Math.random() * 9000)}`,
    location: body.location || kit,
    kit,
    prescription_required: Boolean(body.prescription_required),
    is_active: true,
  };
}
