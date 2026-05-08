import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const profileCompleted = request.cookies.get('profile-completed')?.value === 'true';
  const userEmail = request.cookies.get('user-email')?.value;
  const userRole = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/get-started', '/explore-interests', '/profile', '/checkout', '/seller'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = ['/auth/login', '/auth/signup'].some(route => pathname.startsWith(route));

  // 1. If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Logged in logic
  if (authToken) {
    // A. Force profile completion if not done
    // If we have a userRole, it implies the profile was completed at some point
    const isProfileTrulyIncomplete = !profileCompleted && !userRole;
    
    if (isProfileTrulyIncomplete && isProtectedRoute && !pathname.startsWith('/get-started')) {
      return NextResponse.redirect(new URL('/get-started', request.url));
    }

    // B. Redirect away from auth routes if already logged in
    if (isAuthRoute) {
      if (!profileCompleted) return NextResponse.redirect(new URL('/get-started', request.url));
      const dest = userRole === 'seller' ? '/seller/dashboard' : `/explore-interests/${encodeURIComponent(userEmail || '')}`;
      return NextResponse.redirect(new URL(dest, request.url));
    }

    // C. Role-based protection
    if (profileCompleted || userRole) {
      if (userRole === 'seller' && pathname.startsWith('/explore-interests')) {
        return NextResponse.redirect(new URL('/seller/dashboard', request.url));
      }
      if (userRole === 'buyer' && pathname.startsWith('/seller')) {
        const dest = `/explore-interests/${encodeURIComponent(userEmail || '')}`;
        return NextResponse.redirect(new URL(dest, request.url));
      }
      if (pathname.startsWith('/get-started')) {
        const dest = userRole === 'seller' ? '/seller/dashboard' : `/explore-interests/${encodeURIComponent(userEmail || '')}`;
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/get-started/:path*', '/explore-interests/:path*', '/profile/:path*', '/checkout/:path*', '/seller/:path*', '/auth/login', '/auth/signup'],
};
