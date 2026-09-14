/**
 * Exporta el dossier Atleti Lab a PDF A4 (Chrome headless).
 * Uso: node scripts/export-atleti-lab-pdf.mjs
 */
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'docs', 'atleti-lab', 'DOSSIER-ATLETI-LAB.html');
const outPdf = path.join(root, 'docs', 'atleti-lab', 'CourtManager-Pro-Dossier-Atleti-Lab.pdf');
const outPdfLegacy = path.join(root, 'docs', 'atleti-lab', 'CourtManager-Pro-Atleti-Lab.pdf');
const outTmp = path.join(root, 'docs', 'atleti-lab', '_tmp-atleti-lab.pdf');
const desktopPdf = path.join(
  process.env.USERPROFILE || '',
  'Desktop',
  'CourtManager-Pro-Dossier-Atleti-Lab.pdf'
);
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(htmlPath)) throw new Error('Missing ' + htmlPath);
if (!fs.existsSync(chrome)) throw new Error('Chrome not found');

const r = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${outTmp}`,
    '--print-to-pdf-no-header',
    pathToFileURL(htmlPath).href,
  ],
  { encoding: 'utf8' }
);

if (!fs.existsSync(outTmp)) {
  console.error(r.stderr || r.stdout);
  throw new Error('PDF failed');
}

for (const dest of [outPdf, outPdfLegacy, desktopPdf]) {
  try {
    fs.copyFileSync(outTmp, dest);
  } catch (e) {
    console.warn('copy', dest, e.message);
  }
}

console.log('OK', outPdf, Math.round(fs.statSync(outTmp).size / 1024), 'KB');
