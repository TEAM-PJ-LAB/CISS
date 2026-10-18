'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useI18n } from '@/i18n/client';
import type { MsgKey } from '@/i18n';
import { STATIC } from '@/lib/runtime';
import type { ScanReport } from '@/lib/scan';
import { withQuery } from './QueryViews';

type ReportFinding = ScanReport['findings'][number];

type Enriched = Omit<ScanReport, 'findings'> & {
  cached: boolean;
  findings: (ReportFinding & { name: string; field: string; year: number | null; score: number; authors: { slug: string; name: string }[] })[];
};

const EXAMPLES = ['https://github.com/BorisTheBrave/DeBroglie', 'npm:fflate', 'pypi:networkx', 'https://gitlab.com/inkscape/inkscape'];

export default withQuery(function ScanForm({ q }: { q: URLSearchParams }) {
  const { t, href, locale } = useI18n();
  const initial = q.get('url') ?? '';
  const last = useRef('');
  const [url, setUrl] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Enriched | null>(null);

  const run = useCallback(async (target: string, fresh = false) => {
    const tg = target.trim();
    if (!tg) return;
    last.current = tg;
    setBusy(true); setError(null); setReport(null);
    try {
      if (STATIC) {
        const { scanInBrowser } = await import('@/lib/scan-client');
        setReport(await scanInBrowser(tg, locale));
      } else {
        const res = await fetch(`/api/scan?url=${encodeURIComponent(tg)}${fresh ? '&fresh=1' : ''}`);
        const data = await res.json();
        if (!res.ok) { setError(t(`scan.err.${data.error ?? 'upstream'}` as MsgKey)); return; }
        setReport(data);
      }
      const u = new URL(window.location.href); u.searchParams.set('url', tg); window.history.replaceState(window.history.state, '', u);
    } catch (e) {
      const code = (e as { code?: string }).code;
      setError(t(code ? (`scan.err.${code}` as MsgKey) : 'scan.err.network'));
    } finally { setBusy(false); }
  }, [t, locale]);

  useEffect(() => { if (initial && initial !== last.current) run(initial); }, [initial, run]);

  return (
    <>
      <form className="scan-form" onSubmit={(e) => { e.preventDefault(); run(url); }}>
        <label htmlFor="scan-url" className="label">{t('scan.inputLabel')}</label>
        <div className="row">
          <input id="scan-url" className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/owner/repo" spellCheck={false} autoComplete="off" />
          <button className="btn" disabled={busy || !url.trim()}>{busy ? t('scan.running') : t('scan.run')}</button>
        </div>
        <p className="hint">{t('scan.examples')} {EXAMPLES.map((ex, i) => (
          <span key={ex}>{i > 0 && ', '}<button type="button" className="linkbtn" onClick={() => { setUrl(ex); run(ex); }}>{ex.replace(/^https:\/\//, '')}</button></span>
        ))}</p>
      </form>

      {busy && <p className="scan-busy" role="status"><span className="spinner" aria-hidden />{t('scan.busyNote')}</p>}
      {error && <p className="err empty" role="alert">{error}</p>}

      {report && (
        <section className="sect report-view" aria-labelledby="report-h">
          <header>
            <h2 id="report-h">{t('scan.reportTitle')}</h2>
            <div className="aside"><a href={report.source.web} target="_blank" rel="noopener noreferrer">{report.source.host}:{report.source.path}@{report.source.ref}</a></div>
          </header>
          <dl className="scan-stats">
            {report.source.package && <div><dt>{t('scan.package')}</dt><dd>{report.source.package.kind}:{report.source.package.name}</dd></div>}
            <div><dt>{t('scan.files')}</dt><dd>{report.stats.scanned} / {report.stats.listed}</dd></div>
            <div><dt>{t('scan.found')}</dt><dd>{report.findings.length}</dd></div>
            <div><dt>{t('scan.when')}</dt><dd><time dateTime={report.scannedAt}>{report.scannedAt.slice(0, 16).replace('T', ' ')}</time>{report.cached && <> · <button type="button" className="linkbtn" onClick={() => run(url, true)}>{t('scan.rescan')}</button></>}</dd></div>
          </dl>
          <p className="small muted">{t('scan.disclaimer')}{report.stats.truncated && ` ${t('scan.truncated')}`}</p>
          {report.findings.length === 0 ? <p className="empty">{t('scan.none')}</p> : (
            <ol className="rows report findings">
              {report.findings.map((f) => (
                <li key={f.slug}>
                  <div className="finding-h">
                    <Link href={href(`/algorithms/${f.slug}`)} className="aref"><i className="fdot" style={{ '--fc': `var(--f-${f.field})` } as CSSProperties} aria-hidden /><span className="aname">{f.name}</span></Link>
                    <span className={`pill lvl-${f.level}`}>{t(`scan.level.${f.level}`)} {Math.round(f.confidence * 100)}%</span>
                  </div>
                  <p className="small">
                    {t('scan.originators')}: {f.authors.length ? f.authors.map((a, i) => <span key={a.slug}>{i > 0 && ', '}<Link href={href(`/authors/${a.slug}`)}>{a.name}</Link></span>) : t('author.unknown')}
                    {f.year != null && <span className="muted"> ({f.year < 0 ? t('year.bce', { n: -f.year }) : f.year})</span>}
                  </p>
                  <details>
                    <summary className="small">{t('scan.evidence', { n: f.evidence.length })}</summary>
                    <ul className="evlist">
                      {f.evidence.map((e, i) => (
                        <li key={i}>
                          <span className={`evkind k-${e.kind}`}>{t(`scan.kind.${e.kind}`)}</span>
                          <a href={e.url} target="_blank" rel="noopener noreferrer">{e.path}:{e.line}</a>
                          {e.note && <span className="muted small"> — {e.note}</span>}
                          <code>{e.snippet}</code>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </>
  );
});
