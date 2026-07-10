// src/data/systems/_kit.js
// ═══════════════════════════════════════════════════════════════════════
//  各科データモジュールの共通ヘルパー
// ═══════════════════════════════════════════════════════════════════════
//  systems/ 配下の各ファイルは「1つの診療科ぶんの Test/Finding/Disease/
//  Pathway/Presentation/GROUPS」を1セットで持ち、_index.js が全部を束ねる。
//  → 科を追加したいときは新ファイルを作って _index.js に import するだけ。
// ═══════════════════════════════════════════════════════════════════════

import { LAYER } from '../../model/schema.js';

export const S = LAYER.SCREEN, D = LAYER.DIFF, C = LAYER.CONFIRM;

// ── 検査 ─────────────────────────────────────────────
/** 数値検査（refKey は既定で id と同じ。referenceRanges.js にキーが要る） */
export const numT = (id, name, system, defaultLayer, extra = {}) =>
  ({ id, name, abbr: extra.abbr || id, modality: extra.modality || 'blood',
     system, defaultLayer, valued: true, refKey: extra.refKey || id, ...extra });

/** 所見系検査（画像・身体・病理・生理・遺伝子など）。findings[] に Finding.id を並べる */
export const obsT = (id, name, modality, system, defaultLayer, findings, overview, extra = {}) =>
  ({ id, name, modality, system, defaultLayer, valued: false, findings, overview, ...extra });

/** パネル検査（構成検査を束ねて読む） */
export const panelT = (id, name, system, defaultLayer, panel, overview, extra = {}) =>
  ({ id, name, modality: extra.modality || 'blood', system, defaultLayer, valued: false, panel, overview, ...extra });

// ── 所見 ─────────────────────────────────────────────
/** 数値所見: num(id, testId, label, 'low'|'high', meaning, layerHint) */
export const num = (id, testId, label, direction, meaning, layerHint) =>
  ({ id, testId, label, direction, meaning, layerHint });

/** キーワード所見（画像・身体・病理…）: obs(id, testId, label, meaning, layerHint) */
export const obs = (id, testId, label, meaning, layerHint) =>
  ({ id, testId, label, direction: 'present', meaning, layerHint });

// ── 疾患 ─────────────────────────────────────────────
/** keyFinding: kf(findingId, layer, role, required) */
export const kf = (finding, layer, role = 'rule_in', required = false) => ({ finding, layer, role, required });

// ── 鑑別路 ───────────────────────────────────────────
export const st = (label, o = {}) => ({ kind: 'state', label, ...o, branches: o.branches || [] });
export const dz = (diseaseId, label, note) => ({ kind: 'disease', label, diseaseId, note });
export const br = (finding, label, to) => ({ finding, label, to });

// ── 入口 ─────────────────────────────────────────────
export const pres = (id, label, kind, system, firstTests, pathwayId = null) =>
  ({ id, label, kind, system, firstTests, pathwayId });
