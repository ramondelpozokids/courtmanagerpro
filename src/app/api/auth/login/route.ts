import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '@/infrastructure/supabase/env';
import { isProductionApp } from '@/lib/app-mode';
import { SUPERADMIN_EMAIL } from '@/lib/permissions';

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
    const msg = /invalid login credentials/i.test(error.message)
      ? email === SUPERADMIN_EMAIL
        ? 'Email o contraseña incorrectos para el superadmin. Usa info@ramondelpozorott.es y la contraseña activa en Supabase.'
        : 'Email o contraseña incorrectos.'
      : error.message;
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    userId: data.user?.id,
    email: data.user?.email,
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
  });

  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
