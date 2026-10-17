export type Vars = Record<string, string | number>;
export const interpolate = (s: string, vars?: Vars) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
export const lp = (locale: string, path = '') => `/${locale}${path}`;
