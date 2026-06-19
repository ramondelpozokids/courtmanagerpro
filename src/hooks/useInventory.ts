'use client';

import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { SupabaseInventoryRepository } from '@/infrastructure/supabase/repositories/SupabaseInventoryRepository';
import { isMockMode, mapDemoInventory, shouldUseDemoFallback } from '@/lib/demo-data';
import type {
  InventoryItem,
  InventoryFilters,
  CreateInventoryItemForm,
  PaginationConfig,
  SortConfig,
  PaginatedResponse,
} from '@/types';

export function useInventory(
  teamId: string = DEFAULT_TEAM_ID,
  initialFilters: InventoryFilters = {},
  initialPagination: PaginationConfig = { page: 1, pageSize: 50 }
) {
  const [items, setItems] = useState<PaginatedResponse<InventoryItem>>({
    data: [],
    count: 0,
    page: 1,
    pageSize: 50,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<InventoryFilters>(initialFilters);
  const [pagination, setPagination] = useState<PaginationConfig>(initialPagination);
  const [sort, setSort] = useState<SortConfig>({ field: 'name', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const mockMode = isMockMode();
  const demoActive = mockMode || usingDemoData;
  const repo = new SupabaseInventoryRepository(getSupabaseClient());

  const applyDemoItems = useCallback((tid: string) => {
    const demo = mapDemoInventory(tid);
    setUsingDemoData(true);
    setItems({
      data: demo as InventoryItem[],
      count: demo.length,
      page: 1,
      pageSize: demo.length,
      totalPages: 1,
    });
  }, []);

  const fetchItems = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setError(null);
    try {
      if (mockMode) {
        applyDemoItems(teamId);
        return;
      }

      const result = await repo.findAll(teamId, filters, pagination, sort);
      if (shouldUseDemoFallback(result.data)) {
        applyDemoItems(teamId);
      } else {
        setUsingDemoData(false);
        setItems(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar inventario');
      applyDemoItems(teamId);
    } finally {
      setLoading(false);
    }
  }, [teamId, filters, pagination, sort, mockMode, applyDemoItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = useCallback(async (form: CreateInventoryItemForm): Promise<InventoryItem> => {
    if (demoActive) {
      const item = await repo.create(teamId, form);
      await fetchItems();
      return item;
    }
    const item = await repo.create(teamId, form);
    await fetchItems();
    return item;
  }, [teamId, fetchItems, demoActive, repo]);

  const updateItem = useCallback(async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
    const item = await repo.update(id, updates);
    setItems(prev => ({
      ...prev,
      data: prev.data.map(i => i.id === id ? item : i),
    }));
    return item;
  }, [repo]);

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
  }, [repo]);

  const scanQR = useCallback(async (qrCode: string): Promise<InventoryItem | null> => {
    return repo.findByQR(qrCode);
  }, [repo]);

  const scanBarcode = useCallback(async (barcode: string): Promise<InventoryItem | null> => {
    return repo.findByBarcode(barcode);
  }, [repo]);

  return {
    items: items.data,
    count: items.count,
    totalPages: items.totalPages,
    loading,
    error,
    usingDemoData,
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
