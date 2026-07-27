/**
 * Exporta el dossier Atleti Lab a PDF A4.
 * Uso: node scripts/export-atleti-lab-pdf.mjs
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'docs', 'atleti-lab', 'DOSSIER-ATLETI-LAB.html');
const outPdf = path.join(root, 'docs', 'atleti-lab', 'CourtManager-Pro-Atleti-Lab.pdf');
const outPdfTmp = path.join(root, 'docs', 'atleti-lab', '_tmp-atleti-lab.pdf');
const desktopPdf = path.join(
  process.env.USERPROFILE || '',
  'Desktop',
  'CourtManager-Pro-Atleti-Lab.pdf'
);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await puppeteer.launch({
  executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });
  await page.emulateMediaType('print');
  await new Promise((r) => setTimeout(r, 600));

  await page.pdf({
    path: outPdfTmp,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  try {
    fs.copyFileSync(outPdfTmp, outPdf);
  } catch (e) {
    console.warn('PDF destino bloqueado (¿abierto?):', e.message);
    console.warn('Guardado temporal:', outPdfTmp);
  }

  try {
    fs.copyFileSync(outPdfTmp, desktopPdf);
  } catch (e) {
    console.warn('No se pudo copiar al Escritorio:', e.message);
  }

  const finalPath = fs.existsSync(outPdf) ? outPdf : outPdfTmp;
  console.log('OK', finalPath, Math.round(fs.statSync(outPdfTmp).size / 1024), 'KB');
} finally {
  await browser.close();
}
