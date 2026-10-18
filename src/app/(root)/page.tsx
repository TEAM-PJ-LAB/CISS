import type { Metadata } from 'next';
import { LOCALE_COOKIE, LOCALES } from '@/i18n/config';
import { BASE_PATH } from '@/lib/runtime';

export const metadata: Metadata = { title: 'CISS', robots: { index: false } };

const js = `(function(){var L=${JSON.stringify(LOCALES)},m=document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=([a-z]{2})/),c=m&&m[1],`
  + `n=(navigator.languages||[navigator.language||'']).map(function(x){return String(x).slice(0,2).toLowerCase()}).filter(function(x){return L.indexOf(x)>=0})[0];`
  + `location.replace(${JSON.stringify(BASE_PATH)}+'/'+(L.indexOf(c)>=0?c:n||'ko')+'/'+location.search+location.hash)})()`;

export default function Root() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: js }} />
      <meta httpEquiv="refresh" content={`2; url=${BASE_PATH}/ko/`} />
      <p style={{ font: '16px system-ui', padding: 24 }}><a href={`${BASE_PATH}/ko/`}>CISS — Code Information Sharing Service</a></p>
    </>
  );
}
