import { extractDocumentText } from './extractText';
import { extractInventoryWithAi } from './aiExtract';
import { computeInventoryDiff, type ExistingInventoryRow } from './diffEngine';
import type { InventoryDiffPreview } from './types';

export async function analyzeInventoryDocument(params: {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  existingItems: ExistingInventoryRow[];
}): Promise<{
  preview: InventoryDiffPreview;
  extractedCount: number;
  provider: string;
  warning?: string;
  needsOcr: boolean;
}> {
  const { text, needsOcr, kind } = await extractDocumentText(
    params.buffer,
    params.filename,
    params.mimeType
  );

  const fileBase64 =
    needsOcr && kind === 'pdf' ? params.buffer.toString('base64') : undefined;

  const { items, provider, warning } = await extractInventoryWithAi({
    text,
    filename: params.filename,
    needsOcr,
    fileBase64,
    mimeType: params.mimeType,
  });

  const preview = computeInventoryDiff(items, params.existingItems, params.filename);

  return {
    preview,
    extractedCount: items.length,
    provider,
    warning,
    needsOcr,
  };
}
