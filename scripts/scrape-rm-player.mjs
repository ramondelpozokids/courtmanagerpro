import { readFileSync, writeFileSync } from 'fs';

const slug = process.argv[2] || 'facundo-campazzo';

async function fetchPlayer(slug) {
  const url = `https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/${slug}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });
  return res.text();
}

function extractNgState(html) {
  const match = html.match(/<script id="ng-state" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  return JSON.parse(match[1]);
}

function findStatsNodes(obj, path = '', out = []) {
  if (!obj || typeof obj !== 'object') return out;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => findStatsNodes(item, `${path}[${i}]`, out));
    return out;
  }

  const keys = Object.keys(obj);
  const hasStatsShape =
    ('matchesPlayed' in obj || 'partidosJugados' in obj || 'matches' in obj) &&
    ('points' in obj || 'puntos' in obj);

  if (hasStatsShape) out.push({ path, value: obj });

  for (const [k, v] of Object.entries(obj)) {
    if (/stat|competition|liga|euroliga|player/i.test(k) || typeof v === 'object') {
      findStatsNodes(v, path ? `${path}.${k}` : k, out);
    }
  }
  return out;
}

const html = await fetchPlayer(slug);
const state = extractNgState(html);
writeFileSync('tmp-rm-ng-state.json', JSON.stringify(state, null, 2));

const nodes = findStatsNodes(state);
console.log('nodes', nodes.length);
for (const n of nodes.slice(0, 20)) {
  console.log(n.path, JSON.stringify(n.value).slice(0, 200));
}

// search competition keys
function walk(obj, needle, path = '', hits = []) {
  if (!obj || typeof obj !== 'object') return hits;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => walk(v, needle, `${path}[${i}]`, hits));
    return hits;
  }
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (typeof v === 'string' && v.toLowerCase().includes(needle)) hits.push({ path: p, value: v });
    if (typeof v === 'object') walk(v, needle, p, hits);
  }
  return hits;
}

for (const term of ['liga endesa', 'euroliga', 'copa del rey', 'supercopa']) {
  const hits = walk(state, term);
  console.log(term, hits.length, hits.slice(0, 3));
}
