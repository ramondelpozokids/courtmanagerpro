import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assets = path.join(root, 'docs', 'atleti-lab', 'assets');
const svg = path.join(assets, 'EscudoATM.svg');
const out = path.join(assets, 'atleti-crest-official.png');
const tmp = path.join(assets, '_crest.html');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

fs.writeFileSync(
  tmp,
  `<!DOCTYPE html><html><body style="margin:0;background:transparent">
<img src="${pathToFileURL(svg).href}" width="550" height="705" />
</body></html>`
);

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  defaultViewport: { width: 550, height: 705, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
await page.screenshot({ path: out, omitBackground: true });
await browser.close();
fs.unlinkSync(tmp);
console.log('OK', out, fs.statSync(out).size);
