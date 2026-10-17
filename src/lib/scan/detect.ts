import { SIGNATURES } from './signatures';

export interface SourceFile { path: string; text: string }
export type EvidenceKind = 'api' | 'dep' | 'decl' | 'mention';
export interface ScanEvidence { path: string; line: number; kind: EvidenceKind; snippet: string; note?: string }
export interface Finding { slug: string; confidence: number; level: 'high' | 'medium' | 'low'; evidence: ScanEvidence[] }

export const WEIGHT: Record<EvidenceKind, number> = { api: 0.8, dep: 0.6, decl: 0.55, mention: 0.2 };
export const THRESHOLD = 0.5;

export const CODE_EXT = new Set(('py pyi js jsx ts tsx mjs cjs java kt kts scala c h cc cpp cxx hpp hh hxx cs go rs rb php swift m mm '
  + 'lua gd glsl vert frag hlsl shader cginc wgsl r jl dart zig ex exs hs ml clj sol').split(' '));

export const extOf = (p: string) => (p.includes('.') ? p.slice(p.lastIndexOf('.') + 1).toLowerCase() : '');
const base = (p: string) => p.slice(p.lastIndexOf('/') + 1);

export const isManifest = (p: string) =>
  /^(package\.json|requirements[\w.-]*\.txt|pyproject\.toml|Pipfile|setup\.(py|cfg)|go\.mod|Cargo\.toml|Gemfile|composer\.json|pom\.xml|build\.gradle(\.kts)?|[\w.-]+\.csproj|project\.godot)$/i.test(base(p));

/** 매니페스트 → 의존성 이름(소문자)과 선언 줄 번호. */
export function parseDeps(path: string, text: string): { name: string; line: number }[] {
  const name = base(path).toLowerCase();
  const lines = text.split('\n');
  const out: { name: string; line: number }[] = [];
  const add = (n: string, i: number) => n && out.push({ name: n.toLowerCase(), line: i + 1 });
  if (name === 'package.json' || name === 'composer.json') {
    try {
      const j = JSON.parse(text) as Record<string, Record<string, string> | undefined>;
      const keys = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies', 'require', 'require-dev']
        .flatMap((k) => Object.keys(j[k] ?? {}));
      for (const k of keys) add(k, Math.max(0, lines.findIndex((l) => l.includes(`"${k}"`))));
    } catch { /* invalid JSON */ }
    return out;
  }
  let section = '';
  lines.forEach((raw, i) => {
    const l = raw.trim();
    if (/^\[.*\]$/.test(l)) { section = l.toLowerCase(); return; }
    let m: RegExpMatchArray | null;
    if (name.startsWith('requirements') || name === 'pipfile') {
      if ((m = l.match(/^([A-Za-z0-9][\w.-]*)\s*(\[|[<>=!~;@ ]|$)/)) && !l.startsWith('-')) add(m[1], i);
    } else if (name === 'pyproject.toml' || name === 'setup.cfg' || name === 'setup.py') {
      if ((m = l.match(/^["']([A-Za-z0-9][\w.-]*)(\[[^\]]*\])?\s*([<>=!~;@ ][^"']*)?["'],?$/))) add(m[1], i);
      else if (section.includes('dependencies') && (m = l.match(/^([A-Za-z0-9][\w.-]*)\s*=/)) && m[1] !== 'python') add(m[1], i);
    } else if (name === 'cargo.toml') {
      if (section.includes('dependencies') && (m = l.match(/^([A-Za-z0-9][\w-]*)\s*=/))) add(m[1], i);
    } else if (name === 'go.mod') {
      if ((m = l.match(/^(?:require\s+)?([\w.-]+\.[\w.\-/]+)\s+v\d/))) add(m[1].replace(/\/v\d+$/, ''), i);
    } else if (name === 'gemfile') {
      if ((m = l.match(/^gem\s+['"]([^'"]+)/))) add(m[1], i);
    } else if (name === 'pom.xml') {
      if ((m = l.match(/<artifactId>([^<]+)<\/artifactId>/))) add(m[1], i);
    } else if (name.startsWith('build.gradle')) {
      if ((m = l.match(/['"][\w.-]+:([\w.-]+):[^'"]+['"]/))) add(m[1], i);
    } else if (name.endsWith('.csproj')) {
      if ((m = l.match(/PackageReference\s+Include="([^"]+)"/))) add(m[1], i);
    }
  });
  return out;
}

const DECL = '\\b(?:def|function|func|fn|class|struct|interface|impl|void|static|public|private|protected|export|const|let|var|int|long|bool|auto|template|local)\\b[^\\n;{}]{0,80}?';

const COMPILED = Object.entries(SIGNATURES).map(([slug, sig]) => {
  const ids = sig.id?.length ? `(?:${sig.id.join('|')})` : null;
  return {
    slug, api: sig.api ?? [], dep: (sig.dep ?? []).map((d) => d.toLowerCase()),
    decl: ids ? new RegExp(`${DECL}\\b${ids}\\s*[(<=:{]`, 'i') : null,
    mention: ids ? new RegExp(`\\b${ids}\\b`, 'i') : null,
  };
});

const clip = (s: string) => (s.trim().length > 140 ? `${s.trim().slice(0, 137)}…` : s.trim());

/** 규칙 기반 탐지. 같은 (파일, 근거 종류)는 한 번만 점수에 반영하고, 가장 강한 근거 4개로 noisy-OR. */
export function detect(files: SourceFile[]): Finding[] {
  const ev = new Map<string, ScanEvidence[]>();
  const push = (slug: string, e: ScanEvidence) => {
    const list = ev.get(slug) ?? [];
    if (!list.some((x) => x.path === e.path && x.kind === e.kind) || list.filter((x) => x.kind === e.kind).length < 5) list.push(e);
    ev.set(slug, list);
  };

  for (const f of files) {
    if (isManifest(f.path)) {
      for (const d of parseDeps(f.path, f.text)) {
        for (const c of COMPILED) if (c.dep.some((x) => d.name === x || d.name.endsWith(`/${x}`) || x.endsWith(`/${d.name}`))) {
          push(c.slug, { path: f.path, line: d.line, kind: 'dep', snippet: clip(f.text.split('\n')[d.line - 1] ?? d.name) });
        }
      }
      continue;
    }
    const ext = extOf(f.path);
    if (!CODE_EXT.has(ext)) continue;
    const lines = f.text.split('\n');
    for (const c of COMPILED) {
      let hitApi = false, hitDecl = false, hitMention = false;
      for (let i = 0; i < lines.length && !(hitApi && hitDecl && hitMention); i++) {
        const l = lines[i];
        if (l.length > 500) continue;
        if (!hitApi) for (const a of c.api) {
          if ((!a.langs || a.langs.includes(ext)) && a.re.test(l)) {
            push(c.slug, { path: f.path, line: i + 1, kind: 'api', snippet: clip(l), ...(a.note && { note: a.note }), ...(a.w && { w: a.w }) } as ScanEvidence);
            hitApi = true; break;
          }
        }
        if (!hitDecl && c.decl?.test(l)) { push(c.slug, { path: f.path, line: i + 1, kind: 'decl', snippet: clip(l) }); hitDecl = true; }
        else if (!hitMention && !hitDecl && c.mention?.test(l)) { push(c.slug, { path: f.path, line: i + 1, kind: 'mention', snippet: clip(l) }); hitMention = true; }
      }
    }
  }

  const findings: Finding[] = [];
  for (const [slug, list] of ev) {
    const seen = new Set<string>();
    const weights = list
      .filter((e) => { const k = `${e.path}|${e.kind}`; if (seen.has(k)) return false; seen.add(k); return true; })
      .map((e) => (e as ScanEvidence & { w?: number }).w ?? WEIGHT[e.kind])
      .sort((a, b) => b - a).slice(0, 4);
    const confidence = Math.round((1 - weights.reduce((p, w) => p * (1 - w), 1)) * 100) / 100;
    if (confidence < THRESHOLD) continue;
    const order: EvidenceKind[] = ['api', 'dep', 'decl', 'mention'];
    findings.push({
      slug, confidence,
      level: confidence >= 0.85 ? 'high' : confidence >= 0.65 ? 'medium' : 'low',
      evidence: list.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind)).slice(0, 8)
        .map(({ path, line, kind, snippet, note }) => ({ path, line, kind, snippet, ...(note && { note }) })),
    });
  }
  return findings.sort((a, b) => b.confidence - a.confidence || a.slug.localeCompare(b.slug));
}
