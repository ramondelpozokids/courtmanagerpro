'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { SupabaseInventoryRepository } from '@/infrastructure/supabase/repositories/SupabaseInventoryRepository';
import type {
  InventoryItem,
  InventoryFilters,
  CreateInventoryItemForm,
  PaginationConfig,
  SortConfig,
  PaginatedResponse,
} from '@/types';

export function useInventory(
  teamId: string = 'team-acb-123',
  initialFilters: InventoryFilters = {},
  initialPagination: PaginationConfig = { page: 1, pageSize: 20 }
) {
  const [items, setItems] = useState<PaginatedResponse<InventoryItem>>({
    data: [],
    count: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<InventoryFilters>(initialFilters);
  const [pagination, setPagination] = useState<PaginationConfig>(initialPagination);
  const [sort, setSort] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repo = new SupabaseInventoryRepository(getSupabaseClient());

  const fetchItems = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await repo.findAll(teamId, filters, pagination, sort);
      setItems(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  }, [teamId, filters, pagination, sort]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = useCallback(async (form: CreateInventoryItemForm): Promise<InventoryItem> => {
    const item = await repo.create(teamId, form);
    await fetchItems();
    return item;
  }, [teamId, fetchItems]);

  const updateItem = useCallback(async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
    const item = await repo.update(id, updates);
    setItems(prev => ({
      ...prev,
      data: prev.data.map(i => i.id === id ? item : i),
    }));
    return item;
  }, []);

  const adjustStock = useCallback(async (id: string, qtyChange: number, action: "ADD" | "SET" | "REDUCE") => {
    const item = items.data.find(i => i.id === id);
    if (!item) return;
    let newStock = item.stock_available;
    if (action === "ADD") newStock += qtyChange;
    else if (action === "REDUCE") newStock = Math.max(0, newStock - qtyChange);
    else if (action === "SET") newStock = Math.max(0, qtyChange);
    
    return updateItem(id, { stock_available: newStock });
  }, [items.data, updateItem]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    await repo.delete(id);
    setItems(prev => ({
      ...prev,
      data: prev.data.filter(i => i.id !== id),
      count: prev.count - 1,
    }));
  }, []);

  const scanQR = useCallback(async (qrCode: string): Promise<InventoryItem | null> => {
    return repo.findByQR(qrCode);
  }, []);

  const scanBarcode = useCallback(async (barcode: string): Promise<InventoryItem | null> => {
    return repo.findByBarcode(barcode);
  }, []);

  return {
    items: items.data,
    count: items.count,
    totalPages: items.totalPages,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    sort,
    setSort,
    createItem,
    updateItem,
    adjustStock,
    deleteItem,
    scanQR,
    scanBarcode,
    refresh: fetchItems,
  };
}
