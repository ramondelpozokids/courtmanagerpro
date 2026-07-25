import { z } from 'zod';
import {
  extractedInventoryItemSchema,
  type ExtractedInventoryItem,
} from './types';

const responseSchema = z.object({
  items: z.array(extractedInventoryItemSchema),
});

const SYSTEM_PROMPT = `Eres un experto en utilería de baloncesto profesional (ACB).
Analiza el documento de inventario del club y extrae TODOS los artículos detectados.
Incluye: equipaciones, balones, zapatillas, material médico, conos, petos, canastas, relojes, dispositivos electrónicos y cualquier activo.
Responde SOLO JSON válido con esta forma:
{"items":[{"name":"...","sku":null,"category":"...","brand":null,"model":null,"size":null,"color":null,"quantity":0,"notes":null}]}
category preferida: camiseta_juego, camiseta_entrenamiento, pantalon_juego, pantalon_entrenamiento, zapatillas, calcetines, chaqueta, chandal, accesorios, equipamiento_cancha, electronica, medico, higiene, otro.
Si no hay cantidad, usa null. No inventes artículos que no aparezcan.`;

async function callGemini(parts: Array<Record<string, unknown>>): Promise<string> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key.length < 20) {
    throw new Error('GEMINI_API_KEY no configurada');
  }

  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Gemini HTTP ${res.status}: ${body.slice(0, 400)}`);
  }

  const json = JSON.parse(body) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  if (!text) throw new Error('Gemini no devolvió contenido');
  return text;
}

function parseItemsJson(raw: string): ExtractedInventoryItem[] {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Respuesta IA no es JSON');
    parsed = JSON.parse(match[0]);
  }
  const result = responseSchema.safeParse(parsed);
  if (!result.success) {
    // Soft parse: accept array at root
    if (Array.isArray(parsed)) {
      return parsed
        .map((row) => extractedInventoryItemSchema.safeParse(row))
        .filter((r) => r.success)
        .map((r) => (r as { success: true; data: ExtractedInventoryItem }).data);
    }
    throw new Error(`JSON IA inválido: ${result.error.message}`);
  }
  return result.data.items;
}

/** Heuristic fallback when no Gemini key — parse simple lines "Nombre — qty". */
export function heuristicExtractFromText(text: string): ExtractedInventoryItem[] {
  const items: ExtractedInventoryItem[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.length < 3 || line.length > 200) continue;
    const qtyMatch = line.match(/(?:x\s*|qty[:\s]*|cant(?:idad)?[:\s]*|uds?[:\s]*)(\d{1,5})/i);
    const skuMatch = line.match(/\b([A-Z0-9]{4,12})\b/);
    const name = line
      .replace(/(?:x\s*|qty[:\s]*|cant(?:idad)?[:\s]*|uds?[:\s]*)\d{1,5}/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (name.length < 3) continue;
    items.push({
      name,
      sku: skuMatch?.[1] || null,
      category: null,
      brand: null,
      model: null,
      size: null,
      color: null,
      quantity: qtyMatch ? Number(qtyMatch[1]) : null,
      notes: null,
    });
  }
  // Dedupe by name
  const seen = new Set<string>();
  return items.filter((i) => {
    const k = i.name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 200);
}

export async function extractInventoryWithAi(params: {
  text: string;
  filename: string;
  needsOcr: boolean;
  fileBase64?: string;
  mimeType?: string;
}): Promise<{ items: ExtractedInventoryItem[]; provider: 'gemini' | 'heuristic'; warning?: string }> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key.length < 20) {
    return {
      items: heuristicExtractFromText(params.text),
      provider: 'heuristic',
      warning: 'GEMINI_API_KEY no configurada — extracción heurística limitada',
    };
  }

  try {
    const parts: Array<Record<string, unknown>> = [
      { text: `${SYSTEM_PROMPT}\n\nDocumento: ${params.filename}\n\nTexto extraído:\n${params.text.slice(0, 60000)}` },
    ];

    if (params.needsOcr && params.fileBase64 && params.mimeType?.includes('pdf')) {
      parts.push({
        inline_data: {
          mime_type: params.mimeType || 'application/pdf',
          data: params.fileBase64,
        },
      });
    }

    const raw = await callGemini(parts);
    const items = parseItemsJson(raw);
    if (items.length === 0 && params.text) {
      const fallback = heuristicExtractFromText(params.text);
      return {
        items: fallback,
        provider: 'gemini',
        warning: fallback.length ? 'IA vacía — aplicado fallback heurístico' : 'No se detectaron artículos',
      };
    }
    return { items, provider: 'gemini' };
  } catch (err) {
    console.error('[inventory-ai]', err);
    return {
      items: heuristicExtractFromText(params.text),
      provider: 'heuristic',
      warning: err instanceof Error ? err.message : String(err),
    };
  }
}
