import { writeFileSync } from 'node:fs';
import { contentCatalog } from '../src/i18n/catalog';

const cat = contentCatalog();
const out = process.argv[2] ?? 'catalog.ko.json';
writeFileSync(out, JSON.stringify(cat, null, 1));
console.log(`${Object.keys(cat).length} keys -> ${out}`);
