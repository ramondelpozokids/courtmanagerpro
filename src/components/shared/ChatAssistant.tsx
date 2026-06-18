'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '¡Hola! Soy el asistente inteligente de CourtManager Pro. ¿En qué te puedo ayudar hoy con la utilería del Real Madrid?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const getAssistantReply = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Birthday question
    if (q.includes('cumple') || q.includes('cumpleaños')) {
      // June birthdays: Sissoko (June 20), Almansa (June 7), Maledon (June 12), Alex Len (June 16)
      return "Este mes de Junio celebran su cumpleaños:\n\n• Izan Almansa (7 de Junio)\n• Theo Maledon (12 de Junio)\n• Alex Len (16 de Junio)\n• Mady Sissoko (20 de Junio)\n\n¡No olvides preparar sus juegos de ropa oficial de regalo corporativo de parte del club!";
    }

    // 2. Sizes question
    if (q.includes('talla') || q.includes('tallas')) {
      if (q.includes('campazzo') || q.includes('facu')) {
        return "Facundo Campazzo (Base #7) utiliza camiseta talla **M**, pantalones talla **M** y calzado número **42.5**.";
      }
      if (q.includes('tavares') || q.includes('edy') || q.includes('walter')) {
        return "Walter Samuel Tavares (Pívot #22) utiliza camiseta talla **XXXL**, pantalones talla **XXXL** y calzado de número **52** (¡Es el tallaje y pie más grande de todo el vestuario del Real Madrid!).";
      }
      if (q.includes('llull') || q.includes('sergio')) {
        return "Sergio Llull (Escolta #23) utiliza camiseta talla **L**, pantalones talla **L** y calzado número **44**.";
      }
      if (q.includes('garuba') || q.includes('usman')) {
        return "Usman Garuba (Ala-Pívot #16) utiliza camiseta talla **XXL**, pantalones talla **XXL** y calzado número **49.5**.";
      }
      return "Puedo darte detalles de tallas individuales para cualquier jugador de la plantilla (ej: Facu Campazzo, Edy Tavares, Llull, Garuba). Los jugadores del primer equipo usan generalmente desde la talla L hasta la XXXL en indumentaria.";
    }

    // 3. Trips question
    if (q.includes('viaj') || q.includes('viaje') || q.includes('malaga') || q.includes('barcelona') || q.includes('atenas')) {
      return "Tenemos dos viajes logísticos de utilería planificados este mes:\n\n1. **A Málaga (vs Unicaja)** el 2026-06-20. El equipaje se encuentra actualmente en preparación al 75%.\n2. **A Atenas (vs Panathinaikos)** el 2026-06-26. El plan logístico ya está diseñado en el módulo de Viajes.";
    }

    // 4. Missing stock / Stock alert question
    if (q.includes('material') || q.includes('falta') || q.includes('stock') || q.includes('minimo')) {
      const lowStockItems = db.inventory.filter(i => i.stock <= i.minStock);
      if (lowStockItems.length > 0) {
        const itemsStr = lowStockItems.map(i => `• **${i.name}**: SKU: ${i.sku} (Disponibles: ${i.stock} uds, mínimo: ${i.minStock})`).join('\n');
        return `Actualmente registramos ${lowStockItems.length} artículos en stock crítico por debajo del mínimo establecido:\n\n${itemsStr}\n\nTe sugiero emitir una orden de reposición con el fabricante o una solicitud de compra.`;
      }
      return "¡Buenas noticias! Todos los artículos de utilería oficial e indumentaria se encuentran por encima de los límites de stock mínimos establecidos en el almacén.";
    }

    // Default response
    return "Disculpa, no he entendido del todo tu pregunta. Intenta consultarme con palabras clave como: 'cumpleaños', 'talla de Tavares', 'viajes programados' o 'material que falta'.";
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
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all"
        title="Chat Asistente CourtManager Pro"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 md:w-96 h-[450px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in text-left">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="RMB Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wide">RMB Chat Assistant</h4>
                <p className="text-[10px] text-slate-400 font-medium">Asistente de Utilería RMB</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 items-start ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                  {m.sender === 'user' ? (
                    <div className="h-full w-full bg-orange-600 rounded-full flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                  ) : (
                    <img
                      src="/logo.png"
                      alt="RMB Logo"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[75%] whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-orange-500 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Preset Questions bar */}
          {messages.length < 3 && (
            <div className="px-4 pb-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-orange-500" /> Consultas rápidas recomendadas:
              </p>
              <div className="flex flex-col gap-1 text-[10px]">
                <button
                  onClick={() => selectQuickQuestion('¿Qué talla usa el jugador Facu Campazzo?')}
                  className="text-left px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-600 dark:text-slate-300 font-semibold border border-slate-150 dark:border-slate-800 truncate"
                >
                  ¿Qué talla usa el jugador Facu Campazzo?
                </button>
                <button
                  onClick={() => selectQuickQuestion('¿Qué material falta en el almacén?')}
                  className="text-left px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-600 dark:text-slate-300 font-semibold border border-slate-150 dark:border-slate-800 truncate"
                >
                  ¿Qué material falta en el almacén?
                </button>
                <button
                  onClick={() => selectQuickQuestion('¿Quién cumple años este mes?')}
                  className="text-left px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-600 dark:text-slate-300 font-semibold border border-slate-150 dark:border-slate-800 truncate"
                >
                  ¿Quién cumple años este mes?
                </button>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Pregunta algo (ej: talla de Tavares)..."
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
