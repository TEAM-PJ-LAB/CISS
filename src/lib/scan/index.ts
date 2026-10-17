import { CODE_EXT, detect, extOf, isManifest, type Finding, type ScanEvidence, type SourceFile } from './detect';
import { parseTarget, provider, resolvePackage, ScanError, type Fetch, type Host, type RepoFile, type Tokens } from './sources';

export { ScanError } from './sources';

export interface ScanReport {
  input: string;
  engine: string;
  source: { host: Host; path: string; ref: string; web: string; package?: { kind: 'npm' | 'pypi'; name: string } };
  stats: { listed: number; scanned: number; bytes: number; skipped: number; truncated: boolean };
  findings: (Omit<Finding, 'evidence'> & { evidence: (ScanEvidence & { url: string })[] })[];
  scannedAt: string;
}

const SKIP = /(^|\/)(node_modules|vendor|vendors|dist|build|out|target|bin|obj|\.git|\.github|__pycache__|\.?venv|env|site-packages|Pods|Library|Temp|coverage|docs?|examples?|third[_-]?party|external|deps)(\/|$)/i;
const MINIFIED = /\.min\.(js|css)$|\.bundle\.js$|(^|\/)(package-lock|yarn\.lock|pnpm-lock)/i;
const TEST = /(^|\/)(tests?|__tests__|spec|testdata|fixtures)(\/|$)|[._-](test|spec)\.\w+$/i;

export const ENGINE = 'ciss-scan/1 (rule-based)';

/** 매니페스트 → 소스(테스트 제외 우선) → 얕은 경로 → 작은 파일 순으로 상한까지 선택. */
export function selectFiles(files: RepoFile[], max: number, maxBytes: number) {
  const ok = files.filter((f) => !SKIP.test(f.path) && !MINIFIED.test(f.path) && (f.size == null || f.size <= maxBytes)
    && (isManifest(f.path) || CODE_EXT.has(extOf(f.path))));
  const depth = (p: string) => p.split('/').length;
  ok.sort((a, b) => Number(isManifest(b.path)) - Number(isManifest(a.path)) || Number(TEST.test(a.path)) - Number(TEST.test(b.path))
    || depth(a.path) - depth(b.path) || (a.size ?? 0) - (b.size ?? 0) || a.path.localeCompare(b.path));
  return { picked: ok.slice(0, max), skipped: files.length - Math.min(ok.length, max) };
}

async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i]); }
  }));
  return out;
}

export async function scan(input: string, opts: { fetch?: Fetch; tokens?: Tokens; maxFiles?: number; maxBytes?: number } = {}): Promise<ScanReport> {
  const f = opts.fetch ?? fetch;
  const maxFiles = opts.maxFiles ?? 150;
  const maxBytes = opts.maxBytes ?? 300_000;
  const target = parseTarget(input);
  const repo = target.kind === 'repo' ? target.repo : await resolvePackage(f, target.kind, target.name);
  const p = provider(f, repo, opts.tokens);
  const ref = await p.ref();
  const { files, truncated } = await p.list(ref);
  const { picked, skipped } = selectFiles(files, maxFiles, maxBytes);

  let bytes = 0;
  const texts = (await pool(picked, 8, async (file): Promise<SourceFile | null> => {
    try {
      const res = await f(p.raw(ref, file.path), { headers: { 'User-Agent': 'CISS-RepoScan', ...p.rawHeaders }, signal: AbortSignal.timeout(10_000) });
      if (!res.ok) return null;
      const buf = await res.arrayBuffer();
      if (buf.byteLength > maxBytes) return null;
      const text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
      if (text.includes('\u0000')) return null;
      bytes += buf.byteLength;
      return { path: file.path, text };
    } catch { return null; }
  })).filter((x): x is SourceFile => x !== null);

  if (!texts.length && picked.length) throw new ScanError('upstream', 'Could not download any source file from the repository host.');

  return {
    input,
    engine: ENGINE,
    source: { host: repo.host, path: repo.path, ref, web: p.web, ...(target.kind !== 'repo' && { package: { kind: target.kind, name: target.name } }) },
    stats: { listed: files.length, scanned: texts.length, bytes, skipped: skipped + (picked.length - texts.length), truncated },
    findings: detect(texts).map((x) => ({ ...x, evidence: x.evidence.map((e) => ({ ...e, url: p.line(ref, e.path, e.line) })) })),
    scannedAt: new Date().toISOString(),
  };
}
