import React from "react";

export default function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0) {
    return (
      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600 uppercase tracking-wide">
        Sin Stock
      </span>
    );
  }
  if (stock <= minStock) {
    return (
      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-600 uppercase tracking-wide animate-pulse">
        Bajo Mínimo ({stock})
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-600 uppercase tracking-wide">
      OK ({stock})
    </span>
  );
}
