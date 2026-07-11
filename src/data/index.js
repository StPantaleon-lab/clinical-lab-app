// src/data/index.js
// ═══════════════════════════════════════════════════════════════════════
//  全データの集約点 ― コア + 各科モジュール + オーバーライド → ATLAS
// ═══════════════════════════════════════════════════════════════════════
//  データは3層になっている:
//    ① コア（tests.js / findings.js / diseases.js / pathways.js / presentations.js）
//    ② 各科モジュール（systems/*.js）
//    ③ オーバーライド（overrides.generated.js）
//         … 管理画面からKVに書いた内容を `node scripts/apply-kv.mjs` で
//           ローカルへ落としたもの。同じ id があれば ③ が勝つ（上書き）。
//
//  さらに実行時には masterData.js が KV から同形のデータを取得し、
//  buildAtlas() に渡してライブに差し替えられる（ログイン時）。
// ═══════════════════════════════════════════════════════════════════════

import { buildIndex } from '../model/engine.js';

import { TESTS as CORE_TESTS }               from './tests.js';
import { FINDINGS as CORE_FINDINGS }         from './findings.js';
import { DISEASES as CORE_DISEASES, GROUPS as CORE_GROUPS } from './diseases.js';
import { PATHWAYS as CORE_PATHWAYS }         from './pathways.js';
import { PRESENTATIONS as CORE_PRESENTATIONS } from './presentations.js';
import { DERIVED }       from './derived.js';
import { PATTERNS }      from './patterns.js';
import { LAB_INFO as CORE_LAB_INFO } from './labInfo.js';
import { LAB_INFO_EXTRA } from './labInfoExtra.js';
import { REF as CORE_REF, GROUP_ORDER } from './referenceRanges.js';

import {
  SYS_TESTS, SYS_FINDINGS, SYS_DISEASES, SYS_PATHWAYS, SYS_PRESENTATIONS, SYS_GROUPS,
} from './systems/_index.js';

import OVERRIDES from './overrides.generated.js';

// ── 結合ユーティリティ ────────────────────────────────
/** 先勝ち（重複を検出）。コアと各科モジュールの結合に使う。 */
export function mergeById(...arrays) {
  const seen = new Map();
  const dups = [];
  for (const arr of arrays) for (const item of arr) {
    if (seen.has(item.id)) { dups.push(item.id); continue; }
    seen.set(item.id, item);
  }
  const out = [...seen.values()];
  out.duplicateIds = dups;
  return out;
}
/** 後勝ち（上書き）。オーバーライド／KVの適用に使う。 */
export function upsertById(base, patch = []) {
  const m = new Map(base.map((x) => [x.id, x]));
  for (const item of patch) {
    if (item?.__deleted) { m.delete(item.id); continue; }
    m.set(item.id, { ...(m.get(item.id) || {}), ...item });
  }
  return [...m.values()];
}

// ── 静的データ（コア + 各科） ─────────────────────────
export const STATIC = {
  TESTS:         mergeById(CORE_TESTS, SYS_TESTS),
  FINDINGS:      mergeById(CORE_FINDINGS, SYS_FINDINGS),
  DISEASES:      mergeById(CORE_DISEASES, SYS_DISEASES),
  PATHWAYS:      mergeById(CORE_PATHWAYS, SYS_PATHWAYS),
  PRESENTATIONS: mergeById(CORE_PRESENTATIONS, SYS_PRESENTATIONS),
  GROUPS:        { ...CORE_GROUPS, ...SYS_GROUPS },
  REF:           CORE_REF,
  LAB_INFO:      { ...CORE_LAB_INFO, ...LAB_INFO_EXTRA },
};

export const DUPLICATE_IDS = {
  tests: STATIC.TESTS.duplicateIds, findings: STATIC.FINDINGS.duplicateIds,
  diseases: STATIC.DISEASES.duplicateIds, pathways: STATIC.PATHWAYS.duplicateIds,
  presentations: STATIC.PRESENTATIONS.duplicateIds,
};

/**
 * 静的データにオーバーライド（overrides.json もしくは KV から取得した同形データ）を
 * 重ねて ATLAS を作る。UI はこの戻り値だけを使う。
 * @param {object} ov { TESTS, FINDINGS, DISEASES, PATHWAYS, PRESENTATIONS, GROUPS, REF, LAB_INFO }
 */
export function buildAtlas(ov = {}) {
  const TESTS         = upsertById(STATIC.TESTS,         ov.TESTS);
  const FINDINGS      = upsertById(STATIC.FINDINGS,      ov.FINDINGS);
  const DISEASES      = upsertById(STATIC.DISEASES,      ov.DISEASES);
  const PATHWAYS      = upsertById(STATIC.PATHWAYS,      ov.PATHWAYS);
  const PRESENTATIONS = upsertById(STATIC.PRESENTATIONS, ov.PRESENTATIONS);
  const GROUPS   = { ...STATIC.GROUPS,   ...(ov.GROUPS   || {}) };
  const REF      = { ...STATIC.REF,      ...(ov.REF      || {}) };
  const LAB_INFO = { ...STATIC.LAB_INFO, ...(ov.LAB_INFO || {}) };

  const atlas = {
    ...buildIndex({ TESTS, FINDINGS, DISEASES, PATHWAYS, DERIVED, PATTERNS, PRESENTATIONS }),
    GROUPS, LAB_INFO, REF, GROUP_ORDER,
  };
  atlas.SYSTEMS = [...new Set(DISEASES.map((d) => d.system))].sort();
  atlas.STATS = {
    tests: TESTS.length, findings: FINDINGS.length, diseases: DISEASES.length,
    pathways: PATHWAYS.length, presentations: PRESENTATIONS.length,
    derived: DERIVED.length, patterns: PATTERNS.length, systems: atlas.SYSTEMS.length,
    source: ov.__source || 'static',
  };
  return atlas;
}

// 既定のATLAS（オーバーライド適用済み）。KVログイン時は App が差し替える。
export const ATLAS = buildAtlas(OVERRIDES);

export const TESTS = ATLAS.TESTS, FINDINGS = ATLAS.FINDINGS, DISEASES = ATLAS.DISEASES;
export const PATHWAYS = ATLAS.PATHWAYS, PRESENTATIONS = ATLAS.PRESENTATIONS;
export const GROUPS = ATLAS.GROUPS, REF = ATLAS.REF, LAB_INFO = ATLAS.LAB_INFO;
export const SYSTEMS = ATLAS.SYSTEMS;
export const ATLAS_STATS = ATLAS.STATS;
export { DERIVED, PATTERNS, GROUP_ORDER };

// 素データ（KVへの初期投入 scripts/seed-kv.mjs が使う）
export const RAW = { ...STATIC, DERIVED, PATTERNS, GROUP_ORDER };
