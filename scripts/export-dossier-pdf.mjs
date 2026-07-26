/**
 * Genera CourtManager-Pro-Dossier.pdf con fondos e imágenes.
 * Uso: node scripts/export-dossier-pdf.mjs
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'docs', 'dossier-elite-clubs', 'DOSSIER.html');
const outPdf = path.join(root, 'docs', 'dossier-elite-clubs', 'CourtManager-Pro-Dossier.pdf');
const desktopPdf = path.join(process.env.USERPROFILE || '', 'Desktop', 'CourtManager-Pro-Dossier.pdf');
const kitPdf = path.join(process.env.USERPROFILE || '', 'Desktop', 'CourtManager-Pro-Dossier-Elite', 'CourtManager-Pro-Dossier.pdf');

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
  // Espera a que cargue el hero
  await page.waitForSelector('.cover-media img', { timeout: 15000 });
  await page.evaluate(async () => {
    const img = document.querySelector('.cover-media img');
    if (img && !img.complete) {
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        setTimeout(res, 5000);
      });
    }
    // Fuerza print-color en captura
    document.documentElement.style.setProperty('-webkit-print-color-adjust', 'exact');
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.pdf({
    path: outPdf,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  for (const dest of [desktopPdf, kitPdf]) {
    try {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(outPdf, dest);
    } catch (e) {
      console.warn('No se pudo copiar a', dest, e.message);
    }
  }

  const size = fs.statSync(outPdf).size;
  console.log('OK', outPdf, Math.round(size / 1024), 'KB');
} finally {
  await browser.close();
}
