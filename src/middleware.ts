import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value
  const pathname = req.nextUrl.pathname;

  if (!token && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (token && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/home",
    "/register",
    "/dashboard/:path*",
    "/",
    "/invitations",
    "/project/:path*",
  ],
}
