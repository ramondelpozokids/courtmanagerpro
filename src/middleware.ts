import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  supabaseUrl,
  supabaseAnonKey,
} from '@/infrastructure/supabase/env';

/** Páginas HTML públicas (sin sesión). /demo es landing comercial, no da acceso al dashboard. */
const PUBLIC_PATHS = [
  '/login',
  '/seguridad',
  '/aviso-legal',
  '/politica-privacidad',
  '/proteccion-datos',
  '/politica-cookies',
  '/mapa-sitio',
  '/condiciones-uso',
  '/demo',
];

/** APIs públicas o con auth propia (login, webauthn, diagnóstico, ping). */
const PUBLIC_API_PREFIXES = [
  '/api/auth/login',
  '/api/auth/config',
  '/api/auth/webauthn',
  '/api/ai/ping',
];

function isProductionDeployment(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const hasRealSupabase =
    !!url && !url.includes('your-project') && !url.includes('dummy-project');
  return hasRealSupabase && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true';
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function hasCronBearer(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

async function getSupabaseUser(request: NextRequest, requestHeaders: Headers) {
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, response };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-vercel-skip-toolbar', '1');

  // Registro cerrado en producción: solo cuentas creadas por admin/Supabase
  if (
    isProductionDeployment() &&
    (pathname === '/registro' || pathname.startsWith('/registro/'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ——— Capa 1 también en /api (producción) ———
  if (pathname.startsWith('/api')) {
    if (isPublicApi(pathname)) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    if (isProductionDeployment()) {
      if (hasCronBearer(request)) {
        return NextResponse.next({ request: { headers: requestHeaders } });
      }

      const { user } = await getSupabaseUser(request, requestHeaders);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (isProductionDeployment()) {
    const { user, response } = await getSupabaseUser(request, requestHeaders);

    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  const hasAuth = request.cookies.get('cm_auth')?.value === '1';
  const hasSupabaseSession = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.includes('auth-token')
  );

  if (!hasAuth && !hasSupabaseSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|logo.png|logo_pdf.webp|images|clubs|robots.txt|sitemap.xml).*)',
  ],
};
