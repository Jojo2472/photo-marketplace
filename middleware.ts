// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: session } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Unprotected routes
  const publicPaths = ['/', '/login', '/register', '/verify-email'];
  const isPublic = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (isPublic) {
    return res;
  }

  // Block all /dashboard routes if not logged in
  if (pathname.startsWith('/dashboard')) {
    if (!session?.session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname); // optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }

    // Extra rule: only sellers can access /dashboard/upload
    if (pathname.startsWith('/dashboard/upload')) {
      const role = session.session.user.user_metadata?.role;
      if (role !== 'seller') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return res;
}

// Only match dashboard paths
export const config = {
  matcher: ['/dashboard/:path*'],
};


