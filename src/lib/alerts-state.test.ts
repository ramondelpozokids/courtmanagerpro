/**
 * Regresión: badge del menú vs bandeja vacía.
 * Ejecutar: npx tsx --test src/lib/alerts-state.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { badgeMatchesInbox, countUnreadAlerts, isPastCalendarAlert, visibleAlerts } from './alerts-state';

describe('alerts-state', () => {
  it('cuenta solo no leídas y no dismissadas', () => {
    const alerts = [
      { id: '1', is_read: false, is_dismissed: false },
      { id: '2', is_read: true, is_dismissed: false },
      { id: '3', is_read: false, is_dismissed: true },
      { id: '4', is_read: false, is_dismissed: false },
    ];
    assert.equal(countUnreadAlerts(alerts), 2);
    assert.equal(visibleAlerts(alerts).length, 3);
  });

  it('bandeja vacía ⇒ badge 0 (regresión del bug 32)', () => {
    const afterDismissAll: Array<{ is_read: boolean; is_dismissed: boolean }> = [];
    assert.equal(countUnreadAlerts(afterDismissAll), 0);
    assert.equal(badgeMatchesInbox(afterDismissAll, 0), true);
    assert.equal(badgeMatchesInbox(afterDismissAll, 32), false);
  });

  it('dismiss masivo deja badge alineado con bandeja', () => {
    const before = Array.from({ length: 32 }, (_, i) => ({
      id: String(i),
      is_read: false,
      is_dismissed: false,
    }));
    assert.equal(countUnreadAlerts(before), 32);

    const after = before.map((a) => ({ ...a, is_dismissed: true, is_read: true }));
    assert.equal(visibleAlerts(after).length, 0);
    assert.equal(countUnreadAlerts(after), 0);
    assert.ok(badgeMatchesInbox(after, 0));
  });

  it('oculta resultados y partidos ya jugados; deja los futuros', () => {
    const pastResult = {
      id: 'r1',
      type: 'calendario_resultado',
      is_read: false,
      is_dismissed: false,
      message: 'Partido contra Unicaja: resultado — victoria',
    };
    const pastDate = {
      id: 'c1',
      type: 'calendario_cambio',
      is_read: false,
      is_dismissed: false,
      message: 'Partido contra Unicaja: fecha 2026-06-14 → 2026-06-20',
      metadata: { change_type: 'fecha', match_date: '2026-06-20' },
    };
    const future = {
      id: 'n1',
      type: 'calendario_nuevo',
      is_read: false,
      is_dismissed: false,
      message: 'vs Dubai Basketball: 2027-10-01 18:00 · Euroliga',
      metadata: { change_type: 'nuevo', match_date: '2027-10-01' },
    };
    assert.equal(isPastCalendarAlert(pastResult), true);
    assert.equal(isPastCalendarAlert(pastDate), true);
    assert.equal(isPastCalendarAlert(future), false);
    assert.equal(visibleAlerts([pastResult, pastDate, future]).map((a) => a.id).join(), 'n1');
  });
});
