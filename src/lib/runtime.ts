/** 빌드 모드 플래그 — 서버·클라이언트 공용 (next.config env로 인라인). */
export const STATIC = process.env.NEXT_PUBLIC_STATIC === '1';
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
/** next/link를 거치지 않는 경로(<a>, <img>, fetch)에 basePath를 붙인다. */
export const withBase = (p: string) => `${BASE_PATH}${p}`;
/** 정적 모드의 Claim 저장소 (GitHub Issues). */
export const ISSUES_REPO = process.env.NEXT_PUBLIC_ISSUES_REPO ?? 'TEAM-PJ-LAB/CISS';
/** 소스 코드 저장소 (AGPL §13: 이용자에게 소스 위치를 알린다). */
export const REPO_URL = 'https://github.com/TEAM-PJ-LAB/CISS';
/** 위키식 편집: 데이터 파일을 GitHub 편집기로 열면 수정 제안(PR)이 된다. 기록은 파일의 커밋 이력. */
export const wikiLinks = (file: string) => ({ edit: `${REPO_URL}/edit/main/${file}`, history: `${REPO_URL}/commits/main/${file}` });

export const badgePath = (kind: 'algorithm' | 'author', slug: string) =>
  STATIC ? `/badge/${kind}/${slug}.svg` : `/api/badge/${kind}/${slug}`;
export const dataPath = (name: string) => `/data/${name}`;
