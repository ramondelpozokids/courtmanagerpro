import type { IInventoryRepository } from '@/domain/repositories/IInventoryRepository';
import { getSupabaseClient } from '../client';
import { db } from './InMemoryDB';
import type {
  InventoryItem,
  InventoryFilters,
  CreateInventoryItemForm,
  PaginatedResponse,
  PaginationConfig,
  SortConfig,
} from '@/types';

export class SupabaseInventoryRepository {
  private readonly supabase: any;
  private readonly isMockMode: boolean;

  constructor(supabaseClient?: any) {
    this.supabase = supabaseClient || getSupabaseClient();
    // Fallback to mock mode if credentials are dummy or missing
    this.isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");
  }

  async findAll(
    teamId: string,
    filters: InventoryFilters = {},
    pagination: PaginationConfig = { page: 1, pageSize: 20 },
    sort: SortConfig = { field: 'name', direction: 'asc' }
  ): Promise<PaginatedResponse<InventoryItem>> {
    if (this.isMockMode) {
      // Mock mode: Filter in-memory db
      let mockData = db.inventory.map(item => ({
        ...item,
        // Adapt categories
        category: (item.category.toLowerCase().replace("uniform", "camiseta_juego") as any)
      })) as any[];

      if (filters.category) {
        // Simple map
        const mappedCat = filters.category === "camiseta_juego" ? "UNIFORM" : filters.category;
        mockData = mockData.filter(i => i.category === mappedCat);
      }

      if (filters.search) {
        mockData = mockData.filter(i => 
          i.name.toLowerCase().includes(filters.search!.toLowerCase()) || 
          i.sku.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      const count = mockData.length;
      return {
        data: mockData,
        count,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(count / pagination.pageSize),
      };
    }

    // Live mode
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
    if (filters.low_stock) query = query.lte('stock_available', 'stock_min');
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
      );
    }

    const { data, error, count } = await query;
    if (error || !data?.length) {
      const prev = this.isMockMode;
      (this as any).isMockMode = true;
      const fallback = await this.findAll(teamId, filters, pagination, sort);
      (this as any).isMockMode = prev;
      return fallback;
    }

    return {
      data: (data || []) as any[],
      count: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    };
  }

  async getById(id: string): Promise<InventoryItem | null> {
    return this.findById(id);
  }

  async getAll(): Promise<InventoryItem[]> {
    const res = await this.findAll("team-acb-123");
    return res.data;
  }

  async getByCategory(category: string): Promise<InventoryItem[]> {
    const res = await this.findAll("team-acb-123", { category: category as any });
    return res.data;
  }

  async updateStock(id: string, newStock: number): Promise<InventoryItem> {
    return this.update(id, { stock_available: newStock });
  }

  async findById(id: string): Promise<InventoryItem | null> {
    if (this.isMockMode) {
      return (db.inventory.find(i => i.id === id) as any) || null;
    }

    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as any;
  }

  async findByQR(qrCode: string): Promise<InventoryItem | null> {
    if (this.isMockMode) {
      return (db.inventory.find(i => i.sku === qrCode || i.qrCodeUrl?.includes(qrCode)) as any) || null;
    }

    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('qr_code', qrCode)
      .single();

    if (error) return null;
    return data as any;
  }

  async findByBarcode(barcode: string): Promise<InventoryItem | null> {
    if (this.isMockMode) {
      return (db.inventory.find(i => i.barcode === barcode) as any) || null;
    }

    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (error) return null;
    return data as any;
  }

  async create(teamIdOrForm: any, maybeForm?: any): Promise<InventoryItem> {
    let teamId = "team-acb-123";
    let form = teamIdOrForm;

    if (maybeForm !== undefined) {
      teamId = teamIdOrForm;
      form = maybeForm;
    }

    if (this.isMockMode) {
      const newItem = {
        id: "i_" + Math.random().toString(36).substr(2, 9),
        name: form.name,
        sku: form.sku || "CMP-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
        category: form.category as any,
        stock: form.stock_total || 25,
        minStock: form.stock_min || 5,
        location: form.location || "Almacén Principal",
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${form.sku || "CMP"}`,
        price: form.unit_cost || 0,
        lastUpdated: new Date().toISOString().split("T")[0]
      };
      db.inventory.push(newItem as any);
      return newItem as any;
    }

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
    return data as any;
  }

  async update(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    if (this.isMockMode) {
      const idx = db.inventory.findIndex(i => i.id === id);
      if (idx !== -1) {
        db.inventory[idx] = { ...db.inventory[idx], ...updates as any };
        return db.inventory[idx] as any;
      }
      throw new Error("Item not found");
    }

    const { data, error } = await this.supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any;
  }

  async delete(id: string): Promise<boolean> {
    if (this.isMockMode) {
      db.inventory = db.inventory.filter(i => i.id !== id);
      return true;
    }

    const { error } = await this.supabase
      .from('inventory_items')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  async getLowStockItems(teamId: string): Promise<InventoryItem[]> {
    if (this.isMockMode) {
      return db.inventory.filter(i => i.stock <= i.minStock) as any;
    }

    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_active', true)
      .filter('stock_available', 'lte', 'stock_min');

    if (error) throw new Error(error.message);
    return data as any[];
  }
}
