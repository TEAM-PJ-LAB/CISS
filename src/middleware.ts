import { NextResponse, type NextRequest } from 'next/server';
import { isLocale, LOCALE_COOKIE, negotiate } from './i18n/config';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (isLocale(pathname.split('/')[1])) return NextResponse.next();
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : negotiate(req.headers.get('accept-language'));
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] };
