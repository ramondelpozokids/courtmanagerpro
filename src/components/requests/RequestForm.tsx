"use client";

import { useEffect, useState } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { useInventory } from "@/hooks/useInventory";
import { DEFAULT_TEAM_ID } from "@/lib/team-constants";
import { X } from "lucide-react";

interface RequestFormProps {
  teamId?: string;
  onSubmit: (data: {
    playerId: string;
    playerName: string;
    itemId: string;
    itemName: string;
    quantity: number;
    size: string;
    notes?: string;
  }) => void | Promise<void>;
  onClose?: () => void;
}

export default function RequestForm({
  teamId = DEFAULT_TEAM_ID,
  onSubmit,
  onClose,
}: RequestFormProps) {
  const { players } = usePlayers(teamId);
  const { items } = useInventory(teamId);

  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState("XL");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (players.length && !selectedPlayerId) {
      setSelectedPlayerId(players[0].id);
    }
  }, [players, selectedPlayerId]);

  useEffect(() => {
    if (items.length && !selectedItemId) {
      setSelectedItemId(items[0].id);
      if (items[0].size) setSize(String(items[0].size));
    }
  }, [items, selectedItemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const player = players.find((p) => p.id === selectedPlayerId);
    const item = items.find((i) => i.id === selectedItemId);

    if (!player || !item) {
      alert("Por favor selecciona un jugador y un artículo");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        playerId: player.id,
        playerName: player.full_name,
        itemId: item.id,
        itemName: item.name,
        quantity,
        size,
        notes,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-lg mx-auto space-y-5 text-left"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
          Nueva Solicitud de Material Deportivo
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Seleccionar Jugador
          </label>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-850 dark:text-slate-100"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.dorsal} — {p.full_name} ({p.position})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Artículo de Utilería
          </label>
          <select
            value={selectedItemId}
            onChange={(e) => {
              setSelectedItemId(e.target.value);
              const it = items.find((i) => i.id === e.target.value);
              if (it?.size) setSize(String(it.size));
            }}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-850 dark:text-slate-100"
          >
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} (Stock: {i.stock_available} | Talla: {i.size || "Única"})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Talla Requerida
            </label>
            <input
              type="text"
              required
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
              placeholder="XL / 47.5"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Notas / Motivo de la Solicitud
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-850 dark:text-slate-100"
            placeholder="Ej: Desgaste natural tras entreno, reposición para partido de competicion..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !players.length || !items.length}
          className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/10"
        >
          {submitting ? "Enviando…" : "Enviar Solicitud"}
        </button>
      </div>
    </form>
  );
}
