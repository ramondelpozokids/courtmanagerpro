/**
 * Tests de isProductionApp / isHostingProduction (MEDIUM-04).
 * Ejecutar: npx tsx --test src/lib/app-mode.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';

const KEYS = [
  'VERCEL_ENV',
  'NEXT_PUBLIC_DEMO_MODE',
  'NEXT_PUBLIC_SUPABASE_URL',
] as const;

const saved: Record<string, string | undefined> = {};

function stashEnv() {
  for (const k of KEYS) saved[k] = process.env[k];
}

function restoreEnv() {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
}

async function loadAppMode() {
  // Re-import fresco tras mutar env (ESM cache: usamos query bust vía dynamic en CJS-like)
  const mod = await import('./app-mode');
  return mod;
}

describe('isProductionApp', () => {
  beforeEach(() => {
    stashEnv();
  });

  afterEach(() => {
    restoreEnv();
  });

  it('en VERCEL_ENV=production siempre es true aunque DEMO_MODE=true', async () => {
    process.env.VERCEL_ENV = 'production';
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://dummy-project.supabase.co';
    // Re-evaluar funciones puras (leen process.env en cada llamada)
    const { isProductionApp, isHostingProduction, isDemoMode } = await loadAppMode();
    assert.equal(isHostingProduction(), true);
    assert.equal(isDemoMode(), true);
    assert.equal(isProductionApp(), true);
  });

  it('sin Vercel: demo mode ⇒ no producción', async () => {
    delete process.env.VERCEL_ENV;
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
    const { isProductionApp } = await loadAppMode();
    assert.equal(isProductionApp(), false);
  });

  it('sin Vercel: URL real y sin DEMO ⇒ producción', async () => {
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_DEMO_MODE;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abc.supabase.co';
    const { isProductionApp, isMockMode } = await loadAppMode();
    assert.equal(isMockMode(), false);
    assert.equal(isProductionApp(), true);
  });

  it('sin Vercel: URL dummy ⇒ no producción', async () => {
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_DEMO_MODE;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://dummy-project.supabase.co';
    const { isProductionApp } = await loadAppMode();
    assert.equal(isProductionApp(), false);
  });

  it('nunca devuelve false bajo VERCEL_ENV=production', async () => {
    process.env.VERCEL_ENV = 'production';
    for (const demo of ['true', 'false', undefined]) {
      if (demo === undefined) delete process.env.NEXT_PUBLIC_DEMO_MODE;
      else process.env.NEXT_PUBLIC_DEMO_MODE = demo;
      for (const url of [
        'https://real.supabase.co',
        'https://dummy-project.supabase.co',
        '',
      ]) {
        process.env.NEXT_PUBLIC_SUPABASE_URL = url;
        const { isProductionApp } = await loadAppMode();
        assert.equal(
          isProductionApp(),
          true,
          `esperaba true con DEMO=${demo} url=${url}`
        );
      }
    }
  });
});
