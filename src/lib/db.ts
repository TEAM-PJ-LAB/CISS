import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';

let db: DatabaseSync | undefined;

/** Node 내장 SQLite (>= 22.13). 번들러 해석을 피하려고 getBuiltinModule로 로드. */
export function getDb(path = process.env.CISS_DB_PATH ?? '.data/ciss.db'): DatabaseSync {
  if (db) return db;
  const { DatabaseSync: Sqlite } = process.getBuiltinModule('node:sqlite');
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  db = new Sqlite(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 3000;
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kind TEXT NOT NULL CHECK (kind IN ('claim', 'dispute')),
      target TEXT NOT NULL,
      name TEXT NOT NULL,
      contact TEXT,
      statement TEXT NOT NULL,
      evidence TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
      resolution TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      updated_at TEXT
    );
    CREATE INDEX IF NOT EXISTS claims_target ON claims (target);
    CREATE INDEX IF NOT EXISTS claims_status ON claims (status);
    CREATE TABLE IF NOT EXISTS scans (
      key TEXT PRIMARY KEY,
      report TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  return db;
}

export function closeDb() {
  db?.close();
  db = undefined;
}
