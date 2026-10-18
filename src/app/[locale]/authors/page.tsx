import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthorsView, type AuthorRow } from '@/components/QueryViews';
import { fieldColor } from '@/components/ui';
import type { Field } from '@/data/types';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/authors', t('nav.authors'), t('authors.meta'));
}

const initial = (name: string) => name.normalize('NFD').replace(/\p{M}/gu, '')[0].toUpperCase();

export default async function Authors({ params }: Props) {
  const { r, t, href } = ctx((await params).locale);
  const all = r.ranking();
  const rows: AuthorRow[] = all.map((y) => {
    const main = (Object.entries(y.byField) as [Field, number][]).sort((a, b) => b[1] - a[1])[0][0];
    return {
      s: y.author.slug, l: initial(y.author.name), n: y.author.name,
      node: (
        <tr>
          <td className="num muted">{r.rankOf.get(y.author.slug)}</td>
          <td><Link href={href(`/authors/${y.author.slug}`)} className="pname">{y.author.name}</Link>{y.author.org && <span className="tag">{t('authors.org')}</span>}</td>
          <td className="small"><span className="ftag"><i className="fdot" style={fieldColor(main)} aria-hidden />{t(`field.${main}`)}</span></td>
          <td className="small">
            {y.algorithms.slice(0, 3).map((z, i) => <span key={z.slug}>{i > 0 && ', '}<Link href={href(`/algorithms/${z.slug}`)}>{r.algo.get(z.slug)!.name}</Link></span>)}
            {y.algorithms.length > 3 && <span className="muted"> {t('common.andMore', { n: y.algorithms.length - 3 })}</span>}
          </td>
          <td className="num"><b>{y.score}</b></td>
        </tr>
      ),
    };
  });
  const head = <thead><tr><th className="num w-rank">{t('col.rank')}</th><th>{t('col.name')}</th><th>{t('col.mainField')}</th><th>{t('col.algorithms')}</th><th className="num">{t('col.score')}</th></tr></thead>;
  return (
    <div className="wrap page">
      <h1 className="display">{t('nav.authors')}</h1>
      <p className="lede">{t('authors.lede', { n: all.length })}</p>
      <AuthorsView rows={rows} head={head} />
    </div>
  );
}
