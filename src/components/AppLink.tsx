import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { isDetailPath, staticHref } from '@/lib/nav';

const ROUTER_ONLY = ['prefetch', 'replace', 'scroll', 'shallow', 'passHref', 'legacyBehavior', 'locale', 'onNavigate'] as const;

/**
 * next/link 대체: 정적 배포의 상세 페이지 링크는 프리페치·RSC 요청 없는 일반 <a>로 렌더한다 (lib/nav 참고).
 * 넘겨받지 않은 prop은 그대로 두어 RSC 페이로드에 "$undefined"가 쌓이지 않게 한다.
 */
export default function Link(props: ComponentProps<typeof NextLink>) {
  const { href } = props;
  if (typeof href === 'string' && isDetailPath(href)) {
    const rest: Record<string, unknown> = { ...props };
    for (const k of ['href', ...ROUTER_ONLY]) delete rest[k];
    return <a href={staticHref(href)} {...rest} />;
  }
  return <NextLink {...props} />;
}
