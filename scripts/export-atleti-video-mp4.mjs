/**
 * Exporta presentación ejecutiva Atleti Lab a MP4 (1920x1080) + audio ES.
 * Uso: node scripts/export-atleti-video-mp4.mjs
 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assets = path.join(root, 'docs', 'atleti-lab', 'assets');
const audioEs = path.join(root, 'docs', 'dossier-elite-clubs', 'audio', 'es.mp3');
const outDir = path.join(root, 'docs', 'atleti-lab', 'export-video');
const slidesDir = path.join(outDir, 'slides');
const desktopMp4 = path.join(process.env.USERPROFILE || '', 'Desktop', 'CourtManager-Pro-Presentacion-Atleti-Lab.mp4');
const localMp4 = path.join(outDir, 'CourtManager-Pro-Presentacion-Atleti-Lab.mp4');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ffmpeg = path.join(
  process.env.USERPROFILE || '',
  'Desktop',
  'ffmpeg',
  'ffmpeg-8.1-essentials_build',
  'bin',
  'ffmpeg.exe'
);

fs.mkdirSync(slidesDir, { recursive: true });

const slides = [
  {
    id: '01',
    file: '01-intro.png',
    dur: 8,
    html: `
      <div class="c">
        <img class="logo" src="${pathToFileURL(path.join(assets, 'logo.png')).href}" />
        <h1>CourtManager Pro</h1>
        <p class="lead">La plataforma inteligente para la gestión integral<br/>de la utilería deportiva.</p>
        <p class="for">Propuesta de colaboración · Atleti Lab · Atlético de Madrid</p>
      </div>`,
  },
  {
    id: '02',
    file: '02-problem.png',
    dur: 12,
    html: `
      <div class="c">
        <p class="eye">El día a día</p>
        <h2>Retos operativos habituales</h2>
        <div class="probs">
          <div class="p"><span>✕</span>Inventario desactualizado</div>
          <div class="p"><span>✕</span>Material extraviado</div>
          <div class="p"><span>✕</span>Tallas incorrectas</div>
          <div class="p"><span>✕</span>Compras innecesarias</div>
          <div class="p"><span>✕</span>Procesos manuales</div>
        </div>
      </div>`,
  },
  {
    id: '03',
    file: '03-dashboard.png',
    dur: 16,
    shot: 'shot-dashboard.png',
    label: 'Dashboard · sidebar y centro de mando',
  },
  {
    id: '04',
    file: '04-inventory.png',
    dur: 14,
    shot: 'shot-inventory.png',
    label: 'Inventario · equipaciones y material',
  },
  {
    id: '05',
    file: '05-flow.png',
    dur: 9,
    html: `
      <div class="c">
        <p class="eye">Cómo funciona</p>
        <h2>Un ciclo operativo claro</h2>
        <div class="flow">
          <div>Recepción</div><i>→</i>
          <div>Registro</div><i>→</i>
          <div>Asignación</div><i>→</i>
          <div>Preparación</div><i>→</i>
          <div>Historial</div>
        </div>
      </div>`,
  },
  {
    id: '06',
    file: '06-players.png',
    dur: 10,
    shot: 'shot-players.png',
    label: 'Jugadores · fichas y asignaciones',
  },
  {
    id: '07',
    file: '07-moves.png',
    dur: 10,
    shot: 'shot-movimientos.png',
    label: 'Movimientos · historial y trazabilidad',
  },
  {
    id: '08',
    file: '08-benefits.png',
    dur: 9,
    html: `
      <div class="c">
        <p class="eye">En el trabajo diario</p>
        <h2>Qué cambia en la operativa</h2>
        <div class="bens">
          <div>Mayor control del inventario</div>
          <div>Menos errores</div>
          <div>Mayor trazabilidad</div>
          <div>Procesos centralizados</div>
          <div>Preparación más eficiente</div>
        </div>
      </div>`,
  },
  {
    id: '09',
    file: '09-mvp.png',
    dur: 6,
    html: `
      <div class="c">
        <p class="eye">Estado del proyecto</p>
        <h2>MVP funcional</h2>
        <p class="lead">CourtManager Pro es un MVP funcional preparado para<br/>evolucionar junto a las necesidades de un club profesional.</p>
      </div>`,
  },
  {
    id: '10',
    file: '10-cta.png',
    dur: 10,
    html: `
      <div class="c">
        <p class="eye">Siguiente paso</p>
        <h2>¿Os gustaría ver una demostración?</h2>
        <p class="lead">Estaré encantado de realizar una demostración personalizada<br/>y conocer vuestras necesidades para valorar posibles adaptaciones.</p>
        <p class="contact"><strong>Ramón del Pozo Rott</strong><br/>info@ramondelpozorott.es<br/>courtmanagerpro.vercel.app</p>
      </div>`,
  },
  {
    id: '11',
    file: '11-close.png',
    dur: 8,
    html: `
      <div class="c">
        <img class="crest" src="${pathToFileURL(path.join(assets, 'atleti-crest-official.png')).href}" />
        <p class="eye">CourtManager Pro</p>
        <h2 class="close">Diseñado para que la utilería trabaje con la misma precisión<br/>que el equipo sobre el terreno de juego.</h2>
        <p class="contact"><strong>Solicita una demostración personalizada</strong><br/>Ramón del Pozo Rott</p>
      </div>`,
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px; height: 1080px; overflow: hidden;
    font-family: "Instrument Sans", system-ui, sans-serif;
    color: #0f1419;
    background:
      radial-gradient(900px 420px at 12% 0%, rgba(200,16,46,0.08), transparent 60%),
      radial-gradient(700px 360px at 90% 100%, rgba(15,20,25,0.05), transparent 55%),
      #f6f5f2;
  }
  .frame { width: 1920px; height: 1080px; display: grid; place-items: center; position: relative; }
  .c { text-align: center; max-width: 1500px; padding: 40px; }
  .logo { width: 72px; height: 72px; object-fit: contain; margin-bottom: 28px; }
  .crest { width: 88px; height: auto; margin: 0 auto 24px; display: block; }
  .eye { font-size: 18px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #5c6570; margin-bottom: 18px; }
  h1 { font-family: Newsreader, Georgia, serif; font-size: 86px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 22px; }
  h2 { font-family: Newsreader, Georgia, serif; font-size: 52px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 22px; }
  h2.close { font-size: 40px; max-width: 1100px; margin-left: auto; margin-right: auto; }
  .lead { font-size: 28px; color: #5c6570; line-height: 1.45; }
  .for { margin-top: 28px; font-size: 18px; color: #c8102e; font-weight: 600; }
  .contact { margin-top: 36px; font-size: 22px; color: #5c6570; line-height: 1.6; }
  .contact strong { color: #0f1419; }
  .probs { display: flex; gap: 16px; justify-content: center; margin-top: 40px; flex-wrap: wrap; }
  .p { width: 220px; background: #fff; border: 1px solid #e4e2dc; border-radius: 16px; padding: 28px 16px; font-size: 18px; font-weight: 600; }
  .p span { display: grid; place-items: center; width: 36px; height: 36px; margin: 0 auto 14px; border-radius: 50%; background: #f8e8e6; color: #b42318; font-weight: 700; }
  .flow { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 48px; flex-wrap: wrap; }
  .flow div { background: #fff; border: 1px solid #e4e2dc; border-radius: 999px; padding: 16px 26px; font-weight: 600; font-size: 22px; }
  .flow i { font-style: normal; color: #5c6570; font-size: 24px; }
  .bens { display: grid; grid-template-columns: repeat(5, 1fr); gap: 18px; margin-top: 48px; text-align: left; }
  .bens div { border-top: 1px solid #0f1419; padding-top: 18px; font-size: 22px; font-weight: 600; line-height: 1.3; }
  .shot-wrap { width: 1680px; height: 900px; background: #fff; border: 1px solid #e4e2dc; border-radius: 14px; overflow: hidden; box-shadow: 0 24px 64px rgba(15,20,25,0.12); }
  .shot-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: top left; }
  .label { position: absolute; left: 80px; bottom: 48px; font-size: 16px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #5c6570; }
`;

function pageHtml(inner, isShot = false) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head>
  <body><div class="frame">${inner}${isShot ? '' : ''}</div></body></html>`;
}

const browser = await puppeteer.launch({
  executablePath: fs.existsSync(chrome) ? chrome : undefined,
  headless: true,
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  for (const s of slides) {
    let inner;
    if (s.shot) {
      const src = pathToFileURL(path.join(assets, s.shot)).href;
      inner = `<div class="shot-wrap"><img src="${src}" /></div><div class="label">${s.label}</div>`;
    } else {
      inner = s.html;
    }
    const tmp = path.join(slidesDir, `_${s.id}.html`);
    fs.writeFileSync(tmp, pageHtml(inner, !!s.shot), 'utf8');
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 200));
    const out = path.join(slidesDir, s.file);
    await page.screenshot({ path: out, type: 'png' });
    fs.unlinkSync(tmp);
    console.log('slide', s.file);
  }
} finally {
  await browser.close();
}

// ffmpeg concat list
const listPath = path.join(outDir, 'slides.txt');
const lines = [];
for (const s of slides) {
  const img = path.join(slidesDir, s.file).replace(/\\/g, '/');
  lines.push(`file '${img}'`);
  lines.push(`duration ${s.dur}`);
}
const last = path.join(slidesDir, slides[slides.length - 1].file).replace(/\\/g, '/');
lines.push(`file '${last}'`);
fs.writeFileSync(listPath, lines.join('\n'), 'utf8');

if (!fs.existsSync(ffmpeg)) throw new Error('ffmpeg no encontrado: ' + ffmpeg);
if (!fs.existsSync(audioEs)) throw new Error('audio no encontrado: ' + audioEs);

const args = [
  '-y',
  '-f', 'concat', '-safe', '0', '-i', listPath,
  '-i', audioEs,
  '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
  '-c:a', 'aac', '-b:a', '192k',
  '-shortest',
  localMp4,
];

console.log('ffmpeg…');
const r = spawnSync(ffmpeg, args, { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status || 1);

fs.copyFileSync(localMp4, desktopMp4);
console.log('OK', localMp4, Math.round(fs.statSync(localMp4).size / 1024 / 1024), 'MB');
console.log('Desktop:', desktopMp4);
