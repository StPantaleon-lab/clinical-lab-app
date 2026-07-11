// src/data/systems/_index.js
// ═══════════════════════════════════════════════════════════════════════
//  各科モジュールの集約 ― ここに import を1行足せば科が増える
// ═══════════════════════════════════════════════════════════════════════
//  ★ Sonnetへ: 新しい科を足す手順
//    1. systems/<科名>.js を作り、_kit.js のヘルパーで
//       TESTS / FINDINGS / DISEASES / PATHWAYS / PRESENTATIONS / GROUPS を export
//    2. このファイルの MODULES に import して追加
//    3. `node validate.mjs` で参照整合性と ID 重複を確認
//  それだけで全ビュー（マップ・検査・疾患・入力・正常範囲）に反映される。
// ═══════════════════════════════════════════════════════════════════════

import * as common      from './common.js';
import * as gastro      from './gastro.js';
import * as hematology  from './hematology.js';
import * as endocrine   from './endocrine.js';
import * as urology     from './urology.js';
import * as pediatrics  from './pediatrics.js';
import * as cardiopulm  from './cardiopulm.js';
import * as neuro       from './neuro_rheum_id.js';

// 読み込み順 = 優先順位（先勝ち）。ユーザ指定の拡張優先度に合わせてある。
const MODULES = [common, gastro, hematology, endocrine, urology, pediatrics, cardiopulm, neuro];

const collect = (key) => MODULES.flatMap((m) => m[key] || []);

export const SYS_TESTS         = collect('TESTS');
export const SYS_FINDINGS      = collect('FINDINGS');
export const SYS_DISEASES      = collect('DISEASES');
export const SYS_PATHWAYS      = collect('PATHWAYS');
export const SYS_PRESENTATIONS = collect('PRESENTATIONS');
export const SYS_GROUPS        = Object.assign({}, ...MODULES.map((m) => m.GROUPS || {}));
