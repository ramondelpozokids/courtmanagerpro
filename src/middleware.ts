import { NextResponse, type NextRequest } from 'next/server';

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

function nextWithSkipToolbar(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-vercel-skip-toolbar', '1');
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isPublic) {
    return nextWithSkipToolbar(request);
  }

  const hasAuth = request.cookies.get('cm_auth')?.value === '1';
  const hasSupabaseSession = request.cookies.get('sb-access-token')?.value
    || request.cookies.getAll().some((c) => c.name.startsWith('sb-') && c.name.includes('auth-token'));

  if (!hasAuth && !hasSupabaseSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return nextWithSkipToolbar(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|logo.png|images|clubs|robots.txt|sitemap.xml).*)'],
};
