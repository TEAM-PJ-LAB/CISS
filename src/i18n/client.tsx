'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Locale } from './config';
import { interpolate, lp, type Vars } from './format';
import type { Messages, MsgKey } from './index';

const Ctx = createContext<{ locale: Locale; m: Messages } | null>(null);

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  const value = useMemo(() => ({ locale, m: messages }), [locale, messages]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('I18nProvider missing');
  const { locale, m } = ctx;
  return {
    locale,
    t: (key: MsgKey, vars?: Vars) => interpolate(m[key] ?? key, vars),
    href: (path: string) => lp(locale, path),
  };
}
