import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getT } from '@/i18n';
import { LOCALES } from '@/i18n/config';
import { datasetPayload } from '@/lib/dataset';
import { registry } from '@/lib/registry';

const read = (f: string) => readFileSync(f, 'utf8');

describe('licenses', () => {
  it('ships the full AGPL-3.0 text for the code', () => {
    const t = read('LICENSE');
    expect(t.startsWith('GNU AFFERO GENERAL PUBLIC LICENSE\nVersion 3, 19 November 2007')).toBe(true);
    expect(t).toContain('13. Remote Network Interaction; Use with the GNU General Public License.');
    expect(JSON.parse(read('package.json')).license).toBe('AGPL-3.0-only');
  });

  it('ships CC BY 4.0 for the data, with its scope and the full legal code', () => {
    const t = read('LICENSE-DATA');
    expect(t).toContain('src/data/');
    expect(t).toContain('Creative Commons Attribution 4.0 International Public License');
    expect(t).toContain('Section 3 – License Conditions.');
  });

  it('labels the published dataset and every locale footer', () => {
    const lic = datasetPayload(registry()).license;
    expect(lic.data).toBe('CC-BY-4.0');
    expect(lic.code).toBe('AGPL-3.0-only');
    for (const l of LOCALES) {
      const t = getT(l);
      expect(t('footer.license.code')).toContain('AGPL-3.0');
      expect(t('footer.license.data')).toContain('CC BY 4.0');
      expect(t('dev.policy.license', { url: 'U' })).toContain('U');
    }
  });
});
