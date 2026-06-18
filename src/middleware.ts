import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Completely allow free navigation for local mock development / playground testing
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)'],
};
