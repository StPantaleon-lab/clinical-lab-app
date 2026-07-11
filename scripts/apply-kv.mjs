#!/usr/bin/env node
// scripts/apply-kv.mjs
// ═══════════════════════════════════════════════════════════════════════
//  本番KVの内容をローカルへ落とし、src/data/overrides.generated.js に反映する
// ═══════════════════════════════════════════════════════════════════════
//  管理画面（KV）で追加・編集した内容を、ローカルのソースにも反映するための
//  「毎回叩くと最新状態がローカルに落ちてくる」スクリプト（自動同期はしない）。
//
//  仕組み:
//    ・WORKER_URL と ADMIN_PASSWORD があれば、Worker の kv_get_overrides を叩く（推奨・簡単）
//    ・無ければ wrangler kv key get で各キーを取得する（wrangler login 済みが前提）
//
//  使い方:
//    WORKER_URL=https://xxx.workers.dev ADMIN_PASSWORD=yyy node scripts/apply-kv.mjs
//    または（.env.local を読ませたい場合）
//    node --env-file=.env.local scripts/apply-kv.mjs
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/overrides.generated.js');

// .env.local を軽くパース（--env-file が使えない古いNode向けの保険）
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

const COLLECTIONS = { TESTS: 'kv_tests', FINDINGS: 'kv_findings', DISEASES: 'kv_diseases',
  PATHWAYS: 'kv_pathways', PRESENTATIONS: 'kv_presentations' };
const MAPS = { GROUPS: 'kv_groups', REF: 'kv_ref', LAB_INFO: 'kv_labinfo' };

async function viaWorker() {
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Password': ADMIN_PASSWORD },
    body: JSON.stringify({ action: 'kv_get_overrides' }),
  });
  if (!res.ok) throw new Error(`Worker HTTP ${res.status}`);
  const { data } = await res.json();
  return data;
}

function viaWrangler() {
  const toml = readFileSync(resolve(__dirname, '../wrangler.toml'), 'utf8');
  const binding = toml.match(/binding\s*=\s*"(\w+)"/)?.[1] || 'ATLAS_KV';
  const get = (key) => {
    try { return JSON.parse(execSync(`wrangler kv key get --binding=${binding} --remote "${key}"`, { encoding: 'utf8' })); }
    catch { return null; }
  };
  const out = { __source: 'kv' };
  for (const [name, key] of Object.entries(COLLECTIONS)) out[name] = get(key) || [];
  for (const [name, key] of Object.entries(MAPS)) out[name] = get(key) || {};
  return out;
}

const emptyPatch = { TESTS: [], FINDINGS: [], DISEASES: [], PATHWAYS: [], PRESENTATIONS: [], GROUPS: {}, REF: {}, LAB_INFO: {} };

(async () => {
  console.log('\n📥 KVからオーバーライドを取得中...\n');
  let data;
  try {
    data = WORKER_URL && ADMIN_PASSWORD ? await viaWorker() : viaWrangler();
  } catch (e) {
    console.error(`❌ 取得に失敗: ${e.message}`);
    console.error('   WORKER_URL と ADMIN_PASSWORD を設定するか、wrangler login 済みか確認してください。');
    process.exit(1);
  }

  const patch = { ...emptyPatch };
  for (const k of Object.keys(emptyPatch)) if (data?.[k]) patch[k] = data[k];

  const counts = Object.entries(patch)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : Object.keys(v).length}`)
    .join(' / ');

  const banner = `// src/data/overrides.generated.js
// ⚠ このファイルは scripts/apply-kv.mjs が自動生成します（手編集は次回上書き）。
// 生成日時: ${new Date().toISOString()}
// 内容: ${counts}
export default ${JSON.stringify({ __source: 'overrides.generated.js', __generatedAt: Date.now(), ...patch }, null, 2)};
`;
  writeFileSync(OUT, banner, 'utf8');
  console.log(`✅ 反映しました → src/data/overrides.generated.js`);
  console.log(`   ${counts}`);
  console.log('\n開発サーバーを再起動すると、KVの内容がローカルにも反映されます。');
})();
