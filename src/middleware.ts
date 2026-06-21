import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  supabaseUrl,
  supabaseAnonKey,
} from '@/infrastructure/supabase/env';

const PUBLIC_PATHS = [
  '/login',
  '/registro',
  '/demo',
  '/seguridad',
  '/aviso-legal',
  '/politica-privacidad',
  '/proteccion-datos',
  '/politica-cookies',
  '/mapa-sitio',
  '/condiciones-uso',
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-vercel-skip-toolbar', '1');
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-vercel-skip-toolbar', '1');

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  if (isProductionDeployment()) {
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

    const { data: { user } } = await supabase.auth.getUser();

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

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|logo.png|images|clubs|robots.txt|sitemap.xml).*)'],
};
