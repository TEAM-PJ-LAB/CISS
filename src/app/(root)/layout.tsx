import type { ReactNode } from 'react';

/** `/` 전용 루트 레이아웃. 서버 모드는 middleware가, 정적 모드는 page의 스크립트가 로케일로 보낸다. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
