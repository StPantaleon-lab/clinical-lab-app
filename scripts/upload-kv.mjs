#!/usr/bin/env node
// scripts/upload-kv.mjs
// ═══════════════════════════════════════════════════════════════════════
//  ローカルの overrides.generated.js を本番KVへ書き戻す（逆方向）
// ═══════════════════════════════════════════════════════════════════════
//  通常は管理画面から直接KVを編集するが、ローカルで手編集した
//  overrides.generated.js を本番へ反映したいときに使う。
//  Worker の kv_bulk_patch を叩く（ADMIN_PASSWORD が必要）。
//
//  使い方:
//    node --env-file=.env.local scripts/upload-kv.mjs
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
function loadEnvLocal() {
  try {
    const txt = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
    for (const line of txt.split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}
loadEnvLocal();

const WORKER_URL = process.env.WORKER_URL || process.env.VITE_WORKER_URL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
if (!WORKER_URL || !ADMIN_PASSWORD) {
  console.error('❌ WORKER_URL と ADMIN_PASSWORD が必要です（.env.local に設定してください）');
  process.exit(1);
}

const mod = await import(pathToFileURL(resolve(__dirname, '../src/data/overrides.generated.js')));
const ov = mod.default || {};
const patch = {};
for (const k of ['TESTS', 'FINDINGS', 'DISEASES', 'PATHWAYS', 'PRESENTATIONS', 'GROUPS', 'REF', 'LAB_INFO'])
  if (ov[k]) patch[k] = ov[k];

console.log('\n📤 本番KVへアップロード中...\n');
const res = await fetch(WORKER_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Admin-Password': ADMIN_PASSWORD },
  body: JSON.stringify({ action: 'kv_bulk_patch', patch }),
});
const data = await res.json();
if (!res.ok) { console.error(`❌ 失敗: ${data.error || res.status}`); process.exit(1); }
console.log('✅ 反映しました:', JSON.stringify(data.report, null, 2));
