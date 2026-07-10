// src/data/index.js
// ═══════════════════════════════════════════════════════════════════════
//  全データの集約点 ― コア + 各科モジュール → buildIndex() → ATLAS
// ═══════════════════════════════════════════════════════════════════════
//  UIコンポーネントはこの ATLAS（逆引き済みインデックス）だけを使う。
//
//  データは2層になっている:
//    ① コア（tests.js / findings.js / diseases.js / pathways.js / presentations.js）
//       … 消化器・血液の基礎部分。最初に読み込まれる。
//    ② 各科モジュール（systems/*.js）
//       … 科ごとに独立したファイル。追加はここに1ファイル足すだけ。
//
//  同一 id が両方に現れた場合は「先に読まれた方（コア）」が勝つ。
//  重複は validate.mjs が検出して報告する。
// ═══════════════════════════════════════════════════════════════════════

import { buildIndex } from '../model/engine.js';

import { TESTS as CORE_TESTS }               from './tests.js';
import { FINDINGS as CORE_FINDINGS }         from './findings.js';
import { DISEASES as CORE_DISEASES, GROUPS as CORE_GROUPS } from './diseases.js';
import { PATHWAYS as CORE_PATHWAYS }         from './pathways.js';
import { PRESENTATIONS as CORE_PRESENTATIONS } from './presentations.js';
import { DERIVED }       from './derived.js';
import { PATTERNS }      from './patterns.js';
import { LAB_INFO }      from './labInfo.js';
import { REF, GROUP_ORDER } from './referenceRanges.js';

import {
  SYS_TESTS, SYS_FINDINGS, SYS_DISEASES, SYS_PATHWAYS, SYS_PRESENTATIONS, SYS_GROUPS,
  mergeById,
} from './systems/_index.js';

// ── コア + 各科モジュールを結合 ─────────────────────────
export const TESTS         = mergeById(CORE_TESTS, SYS_TESTS);
export const FINDINGS      = mergeById(CORE_FINDINGS, SYS_FINDINGS);
export const DISEASES      = mergeById(CORE_DISEASES, SYS_DISEASES);
export const PATHWAYS      = mergeById(CORE_PATHWAYS, SYS_PATHWAYS);
export const PRESENTATIONS = mergeById(CORE_PRESENTATIONS, SYS_PRESENTATIONS);
export const GROUPS        = { ...CORE_GROUPS, ...SYS_GROUPS };

// 重複ID（validate.mjs が参照する）
export const DUPLICATE_IDS = {
  tests: TESTS.duplicateIds, findings: FINDINGS.duplicateIds,
  diseases: DISEASES.duplicateIds, pathways: PATHWAYS.duplicateIds,
  presentations: PRESENTATIONS.duplicateIds,
};

// 素データ
export const RAW = {
  TESTS, FINDINGS, DISEASES, PATHWAYS, PRESENTATIONS, DERIVED, PATTERNS,
  GROUPS, LAB_INFO, REF, GROUP_ORDER,
};

// 逆引きインデックス済みのアトラス（UIが使う唯一のオブジェクト）
export const ATLAS = {
  ...buildIndex({ TESTS, FINDINGS, DISEASES, PATHWAYS, DERIVED, PATTERNS, PRESENTATIONS }),
  GROUPS, LAB_INFO, REF, GROUP_ORDER,
};

// 診療系統の一覧（UIの絞り込みに使う）
export const SYSTEMS = [...new Set(DISEASES.map((d) => d.system))].sort();

// データ規模のサマリ（フッタ等に表示）
export const ATLAS_STATS = {
  tests: TESTS.length,
  findings: FINDINGS.length,
  diseases: DISEASES.length,
  pathways: PATHWAYS.length,
  presentations: PRESENTATIONS.length,
  derived: DERIVED.length,
  patterns: PATTERNS.length,
  systems: SYSTEMS.length,
};
