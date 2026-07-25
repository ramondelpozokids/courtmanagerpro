import mammoth from 'mammoth';

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return (result.value || '').trim();
}

export async function extractTextFromPdf(buffer: Buffer): Promise<{ text: string; likelyScanned: boolean }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text?: string; numpages?: number }>;
    const data = await pdfParse(buffer);
    const text = (data.text || '').trim();
    const likelyScanned = text.length < 40 && (data.numpages || 1) > 0;
    return { text, likelyScanned };
  } catch (err) {
    console.warn('[inventory-ocr] pdf-parse failed:', err);
    return { text: '', likelyScanned: true };
  }
}

export async function extractDocumentText(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ text: string; needsOcr: boolean; kind: 'pdf' | 'docx' | 'doc' | 'unknown' }> {
  const lower = filename.toLowerCase();

  if (
    mimeType.includes('wordprocessingml') ||
    lower.endsWith('.docx')
  ) {
    const text = await extractTextFromDocx(buffer);
    return { text, needsOcr: text.length < 20, kind: 'docx' };
  }

  if (lower.endsWith('.doc') || mimeType === 'application/msword') {
    // Legacy DOC: try as binary text scrape (limited); OCR path preferred
    const ascii = buffer.toString('utf8').replace(/[^\x09\x0A\x0D\x20-\x7EÁÉÍÓÚáéíóúñÑüÜ¿¡]/g, ' ');
    const cleaned = ascii.replace(/\s+/g, ' ').trim();
    return {
      text: cleaned.slice(0, 50000),
      needsOcr: cleaned.length < 80,
      kind: 'doc',
    };
  }

  if (mimeType.includes('pdf') || lower.endsWith('.pdf')) {
    const { text, likelyScanned } = await extractTextFromPdf(buffer);
    return { text, needsOcr: likelyScanned || text.length < 40, kind: 'pdf' };
  }

  return { text: buffer.toString('utf8').slice(0, 50000), needsOcr: true, kind: 'unknown' };
}
