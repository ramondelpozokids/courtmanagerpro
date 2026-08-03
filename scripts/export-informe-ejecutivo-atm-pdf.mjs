/**
 * PDF informe ejecutivo ATM con Chrome headless (sin puppeteer).
 * node scripts/export-informe-ejecutivo-atm-pdf.mjs
 */
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'docs', 'auditoria', 'INFORME-EJECUTIVO-ATM.html');
const outPdf = path.join(root, 'docs', 'auditoria', 'CourtManager-Pro-Informe-Ejecutivo-ATM.pdf');
const outTmp = path.join(root, 'docs', 'auditoria', '_tmp-informe-ejecutivo-atm.pdf');
const desktopPdf = path.join(
  process.env.USERPROFILE || '',
  'Desktop',
  'CourtManager-Pro-Informe-Ejecutivo-ATM.pdf'
);
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(htmlPath)) throw new Error('Missing ' + htmlPath);

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

try {
  fs.copyFileSync(outTmp, outPdf);
} catch (e) {
  console.warn('PDF destino bloqueado:', e.message);
}

try {
  fs.copyFileSync(outTmp, desktopPdf);
} catch (e) {
  console.warn('No se pudo copiar al Escritorio:', e.message);
}

const finalPath = fs.existsSync(outPdf) ? outPdf : outTmp;
console.log('OK', finalPath, Math.round(fs.statSync(outTmp).size / 1024), 'KB');
