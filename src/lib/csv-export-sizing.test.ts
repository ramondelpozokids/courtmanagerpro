import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSizingUtileriaCsvLines,
  CLUB_CSV_IDENTITY,
} from './csv-export';

const BLANK = ';;;;;;;;;';

test('CSV tallas sigue plantilla utilería Excel (membrete col. A + tabla)', () => {
  const identity = CLUB_CSV_IDENTITY.rmb;
  const lines = buildSizingUtileriaCsvLines(
    identity,
    [
      {
        dorsal: 3,
        full_name: 'Timothé Luwawu-Cabarrot',
        position: 'alero',
        sizes: { jersey_home: 'L', shorts_game: 'L' },
      },
    ],
    [],
    []
  );

  for (let i = 0; i < 8; i += 1) {
    assert.equal(lines[i], BLANK, `fila ${i + 1} debe estar vacía`);
  }

  assert.equal(lines[8], 'REAL MADRID C.F.;;;;;;;;;');
  assert.equal(lines[9], 'Real Madrid Baloncesto;;;;;;;;;');
  assert.equal(lines[10], 'Estadio Santiago Bernabéu;;;;;;;;;');
  assert.equal(
    lines[11],
    'Av. Concha Espina, 1 · 28036 Madrid España;;;;;;;;;'
  );
  assert.equal(lines[12], 'realmadrid.com;;;;;;;;;');

  for (let i = 13; i < 19; i += 1) {
    assert.equal(lines[i], BLANK, `fila ${i + 1} debe estar vacía (separador)`);
  }

  assert.equal(
    lines[19],
    'Dorsal;Nombre;Grupo;Posición / rol;Talla camiseta;Talla pantalón;Talla entrenamiento;Talla chaqueta;Talla calzado;Notas'
  );
  assert.match(lines[20], /^3;Timothé Luwawu-Cabarrot;Jugador;Alero;L;L;/);
});
