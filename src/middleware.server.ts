import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from './i18n/config';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (isLocale(pathname.split('/')[1])) return NextResponse.next();
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  // 직접 고른 언어가 없으면 브라우저 언어와 상관없이 기본 언어(영어)로 연다.
  const locale = isLocale(cookie) ? cookie : DEFAULT_LOCALE;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] };
