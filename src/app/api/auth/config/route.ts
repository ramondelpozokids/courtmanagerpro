import { NextResponse } from 'next/server';
import { supabaseUrl } from '@/infrastructure/supabase/env';
import { isProductionApp } from '@/lib/app-mode';
import {
  isAtmDemoAccessEnabled,
  showAtmDemoLoginHint,
} from '@/lib/atm-demo-access';

/** Diagnóstico público mínimo (sin secretos ni project ref en producción). */
export async function GET() {
  const url = supabaseUrl;
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const configured =
    !!url &&
    !url.includes('dummy-project') &&
    !url.includes('your-project') &&
    !url.includes('tu-proyecto');

  const production = isProductionApp();
  const atmDemoEnabled = isAtmDemoAccessEnabled();
  const atmDemoHint = showAtmDemoLoginHint();

  if (production) {
    return NextResponse.json({
      production: true,
      supabaseConfigured: configured,
      demoMode: false,
      atmDemoEnabled,
      atmDemoHint,
    });
  }

  let projectRef: string | null = null;
  try {
    projectRef = configured ? new URL(url).hostname.split('.')[0] : null;
  } catch {
    projectRef = 'invalid';
  }

  return NextResponse.json({
    production: false,
    supabaseConfigured: configured,
    projectRef,
    demoMode,
    atmDemoEnabled,
    atmDemoHint,
  });
}
