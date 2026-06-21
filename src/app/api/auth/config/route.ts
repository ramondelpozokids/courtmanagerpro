import { NextResponse } from 'next/server';
import { supabaseUrl } from '@/infrastructure/supabase/env';
import { isProductionApp } from '@/lib/app-mode';

/** Diagnóstico público: ¿Supabase configurado en este deploy? (sin secretos) */
export async function GET() {
  const url = supabaseUrl;
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const configured =
    !!url &&
    !url.includes('dummy-project') &&
    !url.includes('your-project') &&
    !url.includes('tu-proyecto');

  let projectRef = '';
  try {
    projectRef = new URL(url).hostname.split('.')[0];
  } catch {
    projectRef = 'invalid';
  }

  return NextResponse.json({
    production: isProductionApp(),
    supabaseConfigured: configured,
    projectRef: configured ? projectRef : null,
    demoMode,
  });
}
