import type { IInventoryRepository } from '@/domain/repositories/IInventoryRepository';
import { createSupabaseBrowserClient } from '../client';
import type {
  InventoryItem,
  InventoryFilters,
  CreateInventoryItemForm,
  PaginatedResponse,
  PaginationConfig,
  SortConfig,
} from '@/types';

export class SupabaseInventoryRepositoryReal {
  constructor(private readonly supabase: any) {}

  async findAll(
    teamId: string,
    filters: InventoryFilters = {},
    pagination: PaginationConfig = { page: 1, pageSize: 20 },
    sort: any = { field: 'name', direction: 'asc' }
  ): Promise<any> {
    const { page, pageSize } = pagination;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from('inventory_items')
      .select('*', { count: 'exact' })
      .eq('team_id', teamId)
      .eq('is_active', true)
      .order(sort.field, { ascending: sort.direction === 'asc' })
      .range(from, to);

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.condition) query = query.eq('condition', filters.condition);
    if (filters.low_stock) query = query.lte('stock_available', 'stock_min');
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,barcode.ilike.%${filters.search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      data: data as any[],
      count: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    };
  }

  async findById(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async findByQR(qrCode: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('qr_code', qrCode)
      .single();

    if (error) return null;
    return data;
  }

  async findByBarcode(barcode: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (error) return null;
    return data;
  }

  async create(teamId: string, form: any): Promise<any> {
    const qrCode = `CMP-${crypto.randomUUID()}`;
    const { data, error } = await this.supabase
      .from('inventory_items')
      .insert({
        ...form,
        team_id: teamId,
        qr_code: qrCode,
        stock_available: form.stock_total,
        stock_assigned: 0,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, updates: Partial<any>): Promise<any> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('inventory_items')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async getLowStockItems(teamId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_active', true)
      .filter('stock_available', 'lte', 'stock_min');

    if (error) throw new Error(error.message);
    return data;
  }
}
