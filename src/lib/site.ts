import { BASE_PATH } from './runtime';

/** 공개 기준 URL(basePath 포함). 명시값 → 배포 플랫폼 제공 도메인 → 로컬 순. */
const fromPlatform =
  (process.env.RAILWAY_PUBLIC_DOMAIN && `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`)
  || process.env.RENDER_EXTERNAL_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fromPlatform || `http://localhost:3000${BASE_PATH}`).replace(/\/$/, '');
/** metadataBase용 origin (경로 없음). canonical 경로에는 BASE_PATH를 직접 붙인다. */
export const SITE_ORIGIN = new URL(SITE_URL).origin;
