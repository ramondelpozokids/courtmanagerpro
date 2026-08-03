import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseUrl, supabaseAnonKey } from '@/infrastructure/supabase/env';

/**
 * Establece la sesión Supabase en cookies httpOnly de la respuesta.
 * Evita devolver access_token / refresh_token en el JSON (riesgo XSS / Network tab).
 */
export async function attachSupabaseSessionCookies(
  request: NextRequest | Request,
  response: NextResponse,
  session: { access_token: string; refresh_token: string }
): Promise<NextResponse> {
  const cookieJar: { name: string; value: string; options?: object }[] = [];

  const getCookie = (name: string) => {
    if ('cookies' in request && typeof (request as NextRequest).cookies?.get === 'function') {
      return (request as NextRequest).cookies.get(name)?.value;
    }
    const header = request.headers.get('cookie') || '';
    const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
  };

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        if ('cookies' in request && typeof (request as NextRequest).cookies?.getAll === 'function') {
          return (request as NextRequest).cookies.getAll();
        }
        const header = request.headers.get('cookie') || '';
        if (!header) return [];
        return header.split(';').map((part) => {
          const idx = part.indexOf('=');
          const name = part.slice(0, idx).trim();
          const value = part.slice(idx + 1).trim();
          return { name, value };
        }).filter((c) => c.name);
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookieJar.push(...cookiesToSet);
      },
      get(name: string) {
        return getCookie(name);
      },
    },
  });

  const { error } = await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  if (error) {
    return NextResponse.json(
      { error: 'No se pudo establecer la sesión segura.' },
      { status: 500 }
    );
  }

  // Respetar opciones de @supabase/ssr (chunked cookies). No forzar httpOnly
  // de forma que rompa el browser client; sí reforzar path/sameSite.
  cookieJar.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      ...options,
    });
  });

  return response;
}
