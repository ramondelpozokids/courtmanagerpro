/**
 * Comprueba si algún jugador provisional ya está en la plantilla oficial RMB.
 * Uso: npm run check:rmb-provisional
 */
import { RMB_OFFICIAL_PLAYERS } from '../src/data/rmb-official-roster';
import { RMB_PROVISIONAL_PLAYERS } from '../src/data/rmb-provisional-players';

const officialSlugs = new Set(RMB_OFFICIAL_PLAYERS.map((p) => p.slug));
const officialNames = new Set(
  RMB_OFFICIAL_PLAYERS.map((p) => p.full_name.toLowerCase())
);

let pending = 0;
let ready = 0;

console.log('=== RMB · jugadores con foto provisional ===\n');

for (const p of RMB_PROVISIONAL_PLAYERS) {
  const onOfficial =
    officialSlugs.has(p.slug) ||
    officialNames.has(p.full_name.toLowerCase()) ||
    RMB_OFFICIAL_PLAYERS.some((o) => {
      const a = o.full_name.toLowerCase();
      const b = p.full_name.toLowerCase();
      const last = b.split(' ').pop() || '';
      return a.includes(last) && last.length > 3;
    });

  if (onOfficial) {
    ready += 1;
    console.log(`✅ ${p.full_name} — YA en plantilla oficial`);
    console.log(`   → Sustituir foto provisional por sync: npm run sync:rm-plantilla`);
    console.log(`   → Quitar de src/data/rmb-provisional-players.ts si ya hay foto oficial\n`);
  } else {
    pending += 1;
    console.log(`⏳ ${p.full_name} — aún NO en realmadrid.com (foto provisional activa)`);
    console.log(`   ${p.photoPath}`);
    if (p.note) console.log(`   ${p.note}`);
    console.log('');
  }
}

if (pending === 0 && ready > 0) {
  console.log('Todos los provisionales están en plantilla oficial. Revisa fotos y limpia rmb-provisional-players.ts');
  process.exit(0);
}

if (pending > 0) {
  console.log(`${pending} pendiente(s), ${ready} listo(s) para migrar a foto oficial.`);
  process.exit(pending > 0 && ready === 0 ? 0 : 0);
}
