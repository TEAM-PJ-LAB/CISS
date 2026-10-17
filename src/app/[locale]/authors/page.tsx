import type { Metadata } from 'next';
import Link from 'next/link';
import { fieldColor } from '@/components/ui';
import type { Field } from '@/data/types';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ letter?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/authors', t('nav.authors'), t('authors.meta'));
}

const initial = (name: string) => name.normalize('NFD').replace(/\p{M}/gu, '')[0].toUpperCase();

export default async function Authors({ params, searchParams }: Props) {
  const [{ locale }, { letter }] = await Promise.all([params, searchParams]);
  const { r, t, href } = ctx(locale);
  const all = r.ranking();
  const letters = [...new Set(all.map((y) => initial(y.author.name)))].sort();
  const list = letter ? all.filter((y) => initial(y.author.name) === letter).sort((a, b) => a.author.name.localeCompare(b.author.name)) : all;

  return (
    <div className="wrap page">
      <h1 className="display">{t('nav.authors')}</h1>
      <p className="lede">{t('authors.lede', { n: all.length })}</p>
      <nav className="filters alpha" aria-label={t('authors.letter')}>
        <Link href={href('/authors')} aria-current={!letter}>{t('authors.byScore')}</Link>
        {letters.map((l) => <Link key={l} href={href(`/authors?letter=${encodeURIComponent(l)}`)} aria-current={l === letter}>{l}</Link>)}
      </nav>
      <div className="scroll">
        <table className="tbl">
          <thead><tr><th className="num w-rank">{t('col.rank')}</th><th>{t('col.name')}</th><th>{t('col.mainField')}</th><th>{t('col.algorithms')}</th><th className="num">{t('col.score')}</th></tr></thead>
          <tbody>
            {list.map((y) => {
              const main = (Object.entries(y.byField) as [Field, number][]).sort((a, b) => b[1] - a[1])[0][0];
              return (
                <tr key={y.author.slug}>
                  <td className="num muted">{r.rankOf.get(y.author.slug)}</td>
                  <td><Link href={href(`/authors/${y.author.slug}`)} className="pname">{y.author.name}</Link>{y.author.org && <span className="tag">{t('authors.org')}</span>}</td>
                  <td className="small"><span className="ftag"><i className="fdot" style={fieldColor(main)} aria-hidden />{t(`field.${main}`)}</span></td>
                  <td className="small">
                    {y.algorithms.slice(0, 3).map((z, i) => <span key={z.slug}>{i > 0 && ', '}<Link href={href(`/algorithms/${z.slug}`)}>{r.algo.get(z.slug)!.name}</Link></span>)}
                    {y.algorithms.length > 3 && <span className="muted"> {t('common.andMore', { n: y.algorithms.length - 3 })}</span>}
                  </td>
                  <td className="num"><b>{y.score}</b></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
