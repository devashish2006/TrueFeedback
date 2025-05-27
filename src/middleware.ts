import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*', '/ask', '/organisationDashboard', '/organisationDetails', '/fastForward', '/MyPolls'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  console.log('Token:', token);
  console.log('Path:', url.pathname);

  // If a token exists and the user tries to access sign-in/sign-up/verify pages, redirect to dashboard.
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If there's no token and the user is trying to access any protected route, redirect to sign-in.
  if (
    !token &&
    (
      url.pathname.startsWith('/dashboard') ||
      url.pathname.startsWith('/ask') ||
      url.pathname.startsWith('/organisationDashboard') ||
      url.pathname.startsWith('/organisationDetails') ||
      url.pathname.startsWith('/MyPolls') ||
      url.pathname.startsWith('/fastForward')  

    )
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
