import type { NextConfig } from 'next';

/**
 * CISS_STATIC=1 → GitHub Pages용 정적 내보내기.
 *  - API 라우트(route.server.ts)와 middleware.server.ts는 'server.ts' 확장자가 있는 서버 모드에서만 인식된다.
 *  - 검색·스캔·필터는 클라이언트에서, Claim은 GitHub Issues로, 배지·데이터셋은 사전 생성 파일로 동작.
 */
const STATIC = process.env.CISS_STATIC === '1';
const basePath = STATIC ? (process.env.BASE_PATH ?? '').replace(/\/$/, '') : '';

const security = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_STATIC: STATIC ? '1' : '', NEXT_PUBLIC_BASE_PATH: basePath },
  ...(STATIC
    ? { output: 'export', trailingSlash: true, basePath, pageExtensions: ['tsx', 'ts'], images: { unoptimized: true } }
    : {
      output: 'standalone',
      pageExtensions: ['tsx', 'ts', 'server.ts'],
      async headers() {
        return [
          { source: '/api/:path*', headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          ] },
          { source: '/(.*)', headers: security },
        ];
      },
    }),
};
export default config;
