import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ['id-id', 'en-us'];
const defaultLocale = 'id-id';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files, favicon, and images)
    '/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
