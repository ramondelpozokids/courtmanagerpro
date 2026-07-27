/**
 * Genera capturas UI de CourtManager Pro para el dossier Atleti Lab.
 * Uso: node scripts/export-atleti-ui-shots.mjs
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'docs', 'atleti-lab', 'assets', 'ui-shots.html');
const outDir = path.join(root, 'docs', 'atleti-lab', 'assets');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const shots = [
  { id: 'dash', file: 'shot-dashboard.png' },
  { id: 'inv', file: 'shot-inventory.png' },
  { id: 'players', file: 'shot-players.png' },
  { id: 'moves', file: 'shot-movimientos.png' },
];

const browser = await puppeteer.launch({
  executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 400));

  for (const s of shots) {
    const el = await page.$(`#${s.id}`);
    if (!el) throw new Error(`Missing #${s.id}`);
    const out = path.join(outDir, s.file);
    await el.screenshot({ path: out, type: 'png' });
    console.log('OK', s.file, Math.round(fs.statSync(out).size / 1024), 'KB');
  }
} finally {
  await browser.close();
}
