/** 공개 기준 URL. 명시값 → 배포 플랫폼 제공 도메인 → 로컬 순. (배지·canonical·OpenAPI servers) */
const fromPlatform =
  (process.env.RAILWAY_PUBLIC_DOMAIN && `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`)
  || process.env.RENDER_EXTERNAL_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fromPlatform || 'http://localhost:3000').replace(/\/$/, '');
