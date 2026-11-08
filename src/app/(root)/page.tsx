import type { Metadata } from 'next';
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from '@/i18n/config';
import { BASE_PATH } from '@/lib/runtime';

export const metadata: Metadata = { title: 'CISS', robots: { index: false } };

const js = `(function(){var L=${JSON.stringify(LOCALES)},m=document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=([a-z]{2})/),c=m&&m[1];`
    + `location.replace(${JSON.stringify(BASE_PATH)}+'/'+(L.indexOf(c)>=0?c:${JSON.stringify(DEFAULT_LOCALE)})+'/'+location.search+location.hash)})()`;

export default function Root() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: js }} />
      <meta httpEquiv="refresh" content={`2; url=${BASE_PATH}/${DEFAULT_LOCALE}/`} />
      <p style={{ font: '16px system-ui', padding: 24 }}><a href={`${BASE_PATH}/${DEFAULT_LOCALE}/`}>CISS — Code Information Sharing Service</a></p>
    </>
  );
}
