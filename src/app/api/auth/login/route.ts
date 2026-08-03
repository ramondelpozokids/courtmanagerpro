import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '@/infrastructure/supabase/env';
import { isProductionApp } from '@/lib/app-mode';
import {
  checkLoginRateLimit,
  getClientIp,
  pruneLoginRateLimitBuckets,
} from '@/lib/login-rate-limit';
import {
  isAtmDemoAccessEnabled,
  isAtmDemoEmail,
} from '@/lib/atm-demo-access';

const GENERIC_AUTH_ERROR = 'Email o contraseña incorrectos.';

export async function POST(request: NextRequest) {
  if (!isProductionApp()) {
    return NextResponse.json(
      { error: 'Login API solo en producción. Usa auth mock en demo.' },
      { status: 400 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (isAtmDemoEmail(email) && !isAtmDemoAccessEnabled()) {
    return NextResponse.json(
      { error: 'El acceso demo ATM está desactivado.' },
      { status: 403 }
    );
  }

  pruneLoginRateLimitBuckets();
  const ip = getClientIp(request);
  const limit = await checkLoginRateLimit(ip, email);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Demasiados intentos de acceso. Espera unos minutos e inténtalo de nuevo.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSec),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
  }

  const pendingCookies: { name: string; value: string; options?: object }[] = [];

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        pendingCookies.push(...cookiesToSet);
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: GENERIC_AUTH_ERROR }, { status: 401 });
  }

  if (isAtmDemoEmail(data.user?.email) && !isAtmDemoAccessEnabled()) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: 'El acceso demo ATM está desactivado.' },
      { status: 403 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    userId: data.user?.id,
    email: data.user?.email,
  });

  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, {
      ...options,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  });

  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-RateLimit-Remaining', String(limit.remaining));

  return response;
}
