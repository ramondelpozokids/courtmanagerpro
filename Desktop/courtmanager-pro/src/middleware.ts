import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/players',
  '/inventory',
  '/requests',
  '/trips',
  '/laundry',
  '/medical',
  '/reports',
  '/alerts',
];

const PUBLIC_ROUTES = ['/login', '/register', '/'];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-key';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  // If there is no user and they try to access a protected route
  if (!user && isProtected) {
    const loginUrl = new URL('/', request.url); // Redirect to landing or login. Since our main dashboard runs on '/', redirect there or login
    // If the user wants to stay on landing or login, avoid loop
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)'],
};
