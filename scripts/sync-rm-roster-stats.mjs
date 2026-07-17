/**
 * @deprecated Usa `npm run sync:rm-plantilla` — este script redirige al sincronizador completo.
 */
import { spawnSync } from 'child_process';

console.log('Delegando a sync-rm-plantilla.mjs (plantilla completa + stats)…');
const result = spawnSync(process.execPath, ['scripts/sync-rm-plantilla.mjs'], {
  stdio: 'inherit',
  cwd: process.cwd(),
});
process.exit(result.status ?? 1);
