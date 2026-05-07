import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/get-started'];
  
  // If accessing a protected route without a token, redirect to login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login/signup with a token, redirect to home or get-started
  const authRoutes = ['/auth/login', '/auth/signup'];
  if (authRoutes.some(route => pathname.startsWith(route)) && authToken) {
    return NextResponse.redirect(new URL('/get-started', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/get-started/:path*', '/auth/login', '/auth/signup'],
};
