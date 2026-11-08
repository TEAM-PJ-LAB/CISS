import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { isDetailPath, staticHref } from '@/lib/nav';

/** next/link 대체: 정적 배포의 상세 페이지 링크는 프리페치·RSC 요청 없는 일반 <a>로 렌더한다 (lib/nav 참고). */
export default function Link({ href, prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, onNavigate, ...rest }: ComponentProps<typeof NextLink>) {
  if (typeof href === 'string' && isDetailPath(href)) return <a href={staticHref(href)} {...rest} />;
  return <NextLink {...{ href, prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, onNavigate }} {...rest} />;
}
