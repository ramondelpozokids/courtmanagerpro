'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Sparkles } from 'lucide-react';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { useClubBranding } from '@/contexts/ClubDemoContext';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export function ChatAssistant() {
  const branding = useClubBranding();
  const clubLabel = branding.shortName || branding.name;
  const logoSrc = branding.logoUrl || '/images/botiquin.svg';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const greetedSlug = useRef<string | null>(null);

  useEffect(() => {
    if (greetedSlug.current === branding.slug) return;
    greetedSlug.current = branding.slug;
    setMessages([
      {
        sender: 'bot',
        text: `¡Hola! Soy el asistente de utilería de CourtManager Pro para **${branding.name}**. ¿En qué te puedo ayudar?`,
      },
    ]);
  }, [branding.slug, branding.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const getAssistantReply = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('cumple') || q.includes('cumpleaños')) {
      return `Consulta los cumpleaños del mes en el dashboard de **${clubLabel}** (tarjeta de próximos cumpleaños).`;
    }

    if (q.includes('talla') || q.includes('tallas')) {
      return `Las tallas de la plantilla de **${clubLabel}** están en **Tabla de Tallas**. Puedes filtrar por dorsal o nombre.`;
    }

    if (q.includes('viaj') || q.includes('viaje')) {
      return `Los viajes de utilería de **${clubLabel}** están en el módulo **Viajes**. Ahí verás maletas, packing list y estado de preparación.`;
    }

    if (q.includes('material') || q.includes('falta') || q.includes('stock') || q.includes('minimo')) {
      const lowStockItems = db.inventory.filter((i) => i.stock <= i.minStock);
      if (lowStockItems.length > 0) {
        const itemsStr = lowStockItems
          .map((i) => `• **${i.name}**: SKU: ${i.sku} (Disponibles: ${i.stock} uds, mínimo: ${i.minStock})`)
          .join('\n');
        return `Stock crítico en el almacén activo:\n\n${itemsStr}\n\nRevisa Inventario o Almacén general.`;
      }
      return `No hay artículos por debajo del mínimo en el inventario cargado de **${clubLabel}**.`;
    }

    if (q.includes('medico') || q.includes('médico') || q.includes('botiqu')) {
      return `El material médico y botiquines de **${clubLabel}** están en **Material Médico**. El botiquín de viaje también aparece en Inventario.`;
    }

    return `Puedo ayudarte con utilería de **${clubLabel}**. Prueba: «tallas», «viajes», «stock» o «botiquín».`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      const reply = getAssistantReply(userText);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 700);
  };

  const selectQuickQuestion = (q: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setTimeout(() => {
      const reply = getAssistantReply(q);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 700);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-14 w-14 flex items-center justify-center transition-transform hover:scale-105 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg p-1.5"
        title={`Chat utilería — ${clubLabel}`}
      >
        <img
          src={logoSrc}
          alt={clubLabel}
          className={`h-full w-full object-contain ${isOpen ? 'opacity-50' : ''}`}
        />
        {isOpen && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80">
            <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[450px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in text-left">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-full bg-white/10 p-0.5">
                <img src={logoSrc} alt={clubLabel} className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wide">Asistente {clubLabel}</h4>
                <p className="text-[10px] text-slate-400 font-medium">Utilería · {branding.name}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 items-start ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                  {m.sender === 'user' ? (
                    <div className="h-full w-full bg-orange-600 rounded-full flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                  ) : (
                    <img src={logoSrc} alt={clubLabel} className="w-full h-full object-contain" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[75%] whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {messages.length < 3 && (
            <div className="px-4 pb-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-orange-500" /> Consultas rápidas:
              </p>
              <div className="flex flex-col gap-1 text-[10px]">
                <button
                  onClick={() => selectQuickQuestion('¿Qué material falta en el almacén?')}
                  className="text-left px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-600 dark:text-slate-300 font-semibold border border-slate-150 dark:border-slate-800 truncate"
                >
                  ¿Qué material falta en el almacén?
                </button>
                <button
                  onClick={() => selectQuickQuestion('¿Dónde está el botiquín de viaje?')}
                  className="text-left px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-600 dark:text-slate-300 font-semibold border border-slate-150 dark:border-slate-800 truncate"
                >
                  ¿Dónde está el botiquín de viaje?
                </button>
                <button
                  onClick={() => selectQuickQuestion('¿Cómo veo las tallas de la plantilla?')}
                  className="text-left px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-600 dark:text-slate-300 font-semibold border border-slate-150 dark:border-slate-800 truncate"
                >
                  ¿Cómo veo las tallas de la plantilla?
                </button>
              </div>
            </div>
          )}

          <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder={`Pregunta sobre utilería ${clubLabel}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
