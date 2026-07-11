#!/usr/bin/env node
// scripts/seed-kv.mjs
// ═══════════════════════════════════════════════════════════════════════
//  KVを初期化する（空のオーバーライドを書き込む）
// ═══════════════════════════════════════════════════════════════════════
//  KVは「静的データへの差分」だけを持つ設計なので、初期状態は空でよい。
//  このスクリプトは全キーを空配列/空オブジェクトで初期化する。
//  事前に `wrangler login` 済みで、wrangler.toml の kv id を設定しておくこと。
//
//  使い方: node scripts/seed-kv.mjs
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const toml = readFileSync(resolve(__dirname, '../wrangler.toml'), 'utf8');
const binding = toml.match(/binding\s*=\s*"(\w+)"/)?.[1] || 'ATLAS_KV';

const EMPTY = {
  kv_tests: '[]', kv_findings: '[]', kv_diseases: '[]', kv_pathways: '[]', kv_presentations: '[]',
  kv_groups: '{}', kv_ref: '{}', kv_labinfo: '{}', examples: '[]',
};

const TMP = resolve(__dirname, '.seed-tmp');
mkdirSync(TMP, { recursive: true });
console.log(`\n🌱 KV(${binding}) を初期化中...\n`);
let ok = 0;
for (const [key, val] of Object.entries(EMPTY)) {
  const path = resolve(TMP, key);
  writeFileSync(path, val, 'utf8');
  try {
    execSync(`wrangler kv key put --binding=${binding} --remote "${key}" --path="${path}"`, { stdio: 'pipe' });
    console.log(`  ✅ ${key}`); ok++;
  } catch (e) { console.error(`  ❌ ${key}: ${e.message.split('\n')[0]}`); }
}
console.log(`\n✨ 完了: ${ok}/${Object.keys(EMPTY).length} 件`);
