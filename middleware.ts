import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export function middleware(req: NextRequest) {
  const isAuthed = req.cookies.get('demo_auth')?.value === '1';
  const { pathname, searchParams } = req.nextUrl;
  const protectedRoots = ['/dashboard','/devices','/equipment','/sim','/assets','/connections','/explore','/administration','/tenants','/alerting','/reports','/settings'];
  const isProtected = protectedRoots.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (isProtected && !isAuthed) {
    const url = req.nextUrl.clone(); url.pathname = '/login';
    url.searchParams.set('next', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''));
    return NextResponse.redirect(url);
  }
  if ((pathname === '/login' || /^\/t\/[^/]+\/login$/.test(pathname)) && isAuthed) {
    const url = req.nextUrl.clone(); url.pathname = '/dashboard'; return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*','/devices/:path*','/equipment/:path*','/sim/:path*','/assets/:path*','/connections/:path*','/explore/:path*','/administration/:path*','/tenants/:path*','/alerting/:path*','/reports/:path*','/settings/:path*','/login','/t/:path*/login'] };
