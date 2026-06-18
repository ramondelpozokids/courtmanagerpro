import React from "react";
import { PlayerSizes } from "@/domain/entities/Player";
import { Shirt, Footprints, Clipboard } from "lucide-react";

export default function PlayerSizeChart({ sizes }: { sizes: PlayerSizes }) {
  const categories = [
    { name: "Camiseta Oficial", icon: Shirt, value: sizes.jersey, note: "Corte Slim-Fit" },
    { name: "Pantalón Corto", icon: Shirt, value: sizes.shorts, note: "Ancho Holgado" },
    { name: "Zapatillas Baloncesto", icon: Footprints, value: sizes.shoes, note: "Suela de Goma Pro" },
    { name: "Medias Compresión", icon: Clipboard, value: sizes.socks, note: "Tensión Media" },
    { name: "Chándal Oficial / Pre-Match", icon: Shirt, value: sizes.warmupShirt, note: "Manga Extra Larga" }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left">
      <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4">Carta de Tallaje y Ajustes</h3>
      <div className="space-y-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg text-orange-500">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{cat.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{cat.note}</span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-lg">
                {cat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
