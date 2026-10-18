import type { Metadata } from 'next';
import CopyField from '@/components/CopyField';
import { Section } from '@/components/ui';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';
import { STATIC, withBase } from '@/lib/runtime';
import { SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/developers', t('nav.developers'), t('dev.meta'));
}

const ENDPOINTS = [
  ['GET', '/api/algorithms?field=sorting', 'dev.ep.algorithms'],
  ['GET', '/api/algorithms/quicksort', 'dev.ep.algorithm'],
  ['GET', '/api/authors', 'dev.ep.authors'],
  ['GET', '/api/authors/hoare', 'dev.ep.author'],
  ['GET', '/api/graph', 'dev.ep.graph'],
  ['GET', '/api/search?q=dijkstra&locale=en', 'dev.ep.search'],
  ['GET', '/api/dataset', 'dev.ep.dataset'],
  ['GET', '/api/dataset?format=csv&table=derivations', 'dev.ep.csv'],
  ['GET', '/api/scan?url=npm:fflate', 'dev.ep.scan'],
  ['GET', '/api/claims?target=algorithm:quicksort', 'dev.ep.claims'],
  ['POST', '/api/claims', 'dev.ep.claimPost'],
  ['GET', '/api/badge/algorithm/quicksort', 'dev.ep.badge'],
  ['GET', '/api/openapi', 'dev.ep.openapi'],
] as const;

const FILES = [
  ['/data/algorithms.json', 'dev.sf.algorithms'],
  ['/data/algorithms/quicksort.json', 'dev.ep.algorithm'],
  ['/data/authors.json', 'dev.ep.authors'],
  ['/data/authors/hoare.json', 'dev.ep.author'],
  ['/data/graph.json', 'dev.ep.graph'],
  ['/data/search-en.json', 'dev.sf.search'],
  ['/data/dataset.json', 'dev.ep.dataset'],
  ['/data/csv/derivations.csv', 'dev.sf.csv'],
  ['/badge/algorithm/quicksort.svg', 'dev.sf.badge'],
] as const;

export default async function Developers({ params }: Props) {
  const { t } = ctx((await params).locale);
  return (
    <div className="wrap page narrow">
      <h1 className="display">{t('nav.developers')}</h1>
      <p className="lede">{t('dev.lede')}</p>

      {STATIC ? <>
        <p className="small muted">{t('dev.static')}</p>
        <Section title={t('dev.files')}>
          <table className="tbl api">
            <tbody>
              {FILES.map(([path, k]) => (
                <tr key={path}>
                  <td className="nowrap"><span className="method m-get">GET</span></td>
                  <td><a href={withBase(path)} target="_blank" rel="noopener noreferrer"><code>{path}</code></a><p className="small muted">{t(k)}</p></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
        <Section title={t('dev.example')}>
          <div className="stack">
            <CopyField label="curl" value={`curl -s ${SITE_URL}/data/algorithms/transformer.json | jq '.parents[].from'`} />
            <CopyField label="JavaScript" value={`const res = await fetch('${SITE_URL}/data/algorithms.json');\nconst { algorithms } = await res.json();\nconsole.log(algorithms.filter((a) => a.field === 'graphics').map((a) => a.name));`} />
          </div>
        </Section>
      </> : <>
        <Section title={t('dev.endpoints')} aside={<a href="/api/openapi">OpenAPI 3.1</a>}>
        <table className="tbl api">
          <tbody>
            {ENDPOINTS.map(([m, path, k]) => (
              <tr key={path + m}>
                <td className="nowrap"><span className={`method m-${m.toLowerCase()}`}>{m}</span></td>
                <td>{m === 'GET' ? <a href={path} target="_blank" rel="noopener noreferrer"><code>{path}</code></a> : <code>{path}</code>}<p className="small muted">{t(k)}</p></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

        <Section title={t('dev.example')}>
        <div className="stack">
          <CopyField label="curl" value={`curl -s ${SITE_URL}/api/algorithms/transformer | jq '.parents[].from'`} />
          <CopyField label="JavaScript" value={`const res = await fetch('${SITE_URL}/api/scan?url=https://github.com/owner/repo');\nconst { findings } = await res.json();\nfor (const f of findings) console.log(f.name, f.confidence, f.authors.map((a) => a.name));`} />
          <CopyField label={t('dev.claimExample')} value={`curl -X POST ${SITE_URL}/api/claims -H 'Content-Type: application/json' -d '{"kind":"dispute","target":"derivation:quicksort>introsort","name":"octocat","statement":"…","evidence":["https://doi.org/…"]}'`} />
        </div>
      </Section>

      </>}

      <Section title={t('dev.badges')}>
        <p className="empty">{t('dev.badgesBody')}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <p><img src={withBase(STATIC ? '/badge/algorithm/dijkstra.svg' : '/api/badge/algorithm/dijkstra')} alt="CISS credited: Dijkstra's Algorithm" height={20} /> {' '}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBase(STATIC ? '/badge/author/hoare.svg' : '/api/badge/author/hoare')} alt="CISS credit: C. A. R. Hoare" height={20} /></p>
      </Section>

      <Section title={t('dev.policy')}>
        <ul className="bullets">
          <li>{t('dev.policy.cors')}</li>
          {STATIC ? <li>{t('dev.policy.static')}</li> : <>
            <li>{t('dev.policy.rate')}</li>
            <li>{t('dev.policy.privacy')}</li>
            <li>{t('dev.policy.env')}</li>
          </>}
        </ul>
      </Section>
    </div>
  );
}
