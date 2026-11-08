/**
 * 정적 배포(GitHub Pages, 1GB 상한)는 알고리즘·저자 상세 페이지의 RSC 페이로드(index.txt)를 싣지 않는다
 * (scripts/export-static.mts). 그 페이지로는 클라이언트 라우팅 대신 일반 페이지 이동을 쓴다.
 */
const STATIC = process.env.NEXT_PUBLIC_STATIC === '1';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const DETAIL = /^\/[a-z]{2}\/(algorithms|authors)\/[^/?#]+\/?([?#].*)?$/;

/** 상세 페이지 경로인가 (정적 모드에서만 일반 이동 대상). */
export const isDetailPath = (path: string, isStatic = STATIC) => isStatic && DETAIL.test(path);

/** `/en/algorithms/x#p` → `${basePath}/en/algorithms/x/#p` (trailingSlash 내보내기 경로). */
export const staticHref = (path: string, base = BASE) => {
  const i = path.search(/[?#]/);
  const [p, rest] = i < 0 ? [path, ''] : [path.slice(0, i), path.slice(i)];
  return `${base}${p.endsWith('/') ? p : `${p}/`}${rest}`;
};

/** 라우터 이동: 상세 페이지는 전체 로드, 나머지는 클라이언트 라우팅. */
export const navigate = (push: (p: string) => void, path: string) => {
  if (isDetailPath(path)) window.location.assign(staticHref(path));
  else push(path);
};
