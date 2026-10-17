import { ALGORITHMS } from '@/data/algorithms';
import { DERIVATIONS } from '@/data/derivations';

const HANGUL = /[가-힣]/;

/** 번역 대상 콘텐츠 키 → 한국어 원문. 키 규칙: a.<slug>.summary | a.<slug>.local | a.<slug>.o<i>.(title|venue|note) | e.<edgeId> */
export function contentCatalog(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of ALGORITHMS) {
    out[`a.${a.slug}.summary`] = a.summary;
    if (a.ko) out[`a.${a.slug}.local`] = a.ko;
    a.origins.forEach((o, i) => {
      for (const k of ['title', 'venue', 'note'] as const) {
        const v = o[k];
        if (v && HANGUL.test(v)) out[`a.${a.slug}.o${i}.${k}`] = v;
      }
    });
  }
  for (const e of DERIVATIONS) e.evidence.forEach((ev, i) => { out[`e.${e.id}${i ? `.${i}` : ''}`] = ev.text; });
  return out;
}
