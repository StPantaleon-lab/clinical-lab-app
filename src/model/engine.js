// src/model/engine.js
// ═══════════════════════════════════════════════════════════════════════
//  ロジック層 ― データを「鑑別の地図」として使えるようにする
// ═══════════════════════════════════════════════════════════════════════
//  役割:
//   1. 逆引きインデックス構築（検査→所見→疾患→パスウェイ の相互参照）
//   2. 数値/所見の評価（evalFinding）
//   3. 算出値（Derived）・組み合わせ解釈（Pattern）の計算
//   4. 入力から「鑑別全体のどこにいるか」を出す（computePosition）
//   5. パスウェイの走査ヘルパー
// ═══════════════════════════════════════════════════════════════════════

import { evalVal } from '../data/referenceRanges.js';
import { LAYER, layerMeta } from './schema.js';

// ─────────────────────────────────────────────────────────────
//  1) インデックス構築
//     data = { TESTS, FINDINGS, DISEASES, PATHWAYS, DERIVED, PATTERNS, PRESENTATIONS }
//     をまとめて相互参照可能な index にする。UIはこの index を使う。
// ─────────────────────────────────────────────────────────────
export function buildIndex(data) {
  const {
    TESTS = [], FINDINGS = [], DISEASES = [],
    PATHWAYS = [], DERIVED = [], PATTERNS = [], PRESENTATIONS = [],
  } = data;

  const testById     = index(TESTS);
  const findingById  = index(FINDINGS);
  const diseaseById  = index(DISEASES);
  const derivedById  = index(DERIVED);
  const presentById  = index(PRESENTATIONS);
  const pathwayById  = index(PATHWAYS);

  // 検査 → その検査が生む所見
  const findingsByTest = groupBy(FINDINGS, f => f.testId);

  // 所見 → その所見を key に持つ疾患（レイヤー・役割つき）
  const diseasesByFinding = {};
  for (const d of DISEASES) {
    for (const kf of (d.keyFindings || [])) {
      (diseasesByFinding[kf.finding] ||= []).push({ disease: d, ref: kf });
    }
  }

  // 疾患 → 系統/群
  const diseasesBySystem = groupBy(DISEASES, d => d.system);
  const diseasesByGroup  = groupBy(DISEASES, d => d.group);

  // 検査/所見/疾患 → 登場するパスウェイのノード（「鑑別のどこで使われるか」の逆引き）
  const pathwayUsesTest    = {};  // testId    -> [{ pathway, node, layer }]
  const pathwayUsesFinding = {};  // findingId -> [{ pathway, branch, node }]
  const diseaseReachedIn   = {};  // diseaseId -> [{ pathway, node }]
  for (const pw of PATHWAYS) {
    walk(pw.root, (node) => {
      if (node.test) (pathwayUsesTest[node.test] ||= []).push({ pathway: pw, node, layer: node.layer });
      for (const b of (node.branches || [])) {
        if (b.finding) (pathwayUsesFinding[b.finding] ||= []).push({ pathway: pw, branch: b, node });
      }
      if (node.kind === 'disease' && node.diseaseId) {
        (diseaseReachedIn[node.diseaseId] ||= []).push({ pathway: pw, node });
      }
    });
  }

  // パターン → 使う検査（逆引き）
  const patternsByTest = {};
  for (const p of PATTERNS) {
    for (const t of (p.uses || [])) (patternsByTest[t] ||= []).push(p);
  }
  // 算出値 → 入力に使う検査（逆引き）
  const derivedByInput = {};
  for (const d of DERIVED) {
    for (const t of (d.inputs || [])) (derivedByInput[t] ||= []).push(d);
  }

  return {
    ...data,
    testById, findingById, diseaseById, derivedById, presentById, pathwayById,
    findingsByTest, diseasesByFinding, diseasesBySystem, diseasesByGroup,
    pathwayUsesTest, pathwayUsesFinding, diseaseReachedIn,
    patternsByTest, derivedByInput,
  };
}

function index(arr) { const m = {}; for (const x of arr) m[x.id] = x; return m; }
function groupBy(arr, fn) {
  const m = {};
  for (const x of arr) { const k = fn(x); if (k == null) continue; (m[k] ||= []).push(x); }
  return m;
}

// パスウェイのツリーを深さ優先で走査
export function walk(node, visit, depth = 0, path = []) {
  if (!node) return;
  visit(node, depth, path);
  for (const b of (node.branches || [])) {
    walk(b.to, visit, depth + 1, [...path, { branch: b, from: node }]);
  }
}


// ─────────────────────────────────────────────────────────────
//  2) 所見の評価
//     数値検査 → evalVal で low/normal/high
//     所見の direction と観測が一致すれば「その所見が出ている」
// ─────────────────────────────────────────────────────────────
// values: { testId/refKey: value }, findingsOn: Set<findingId>（keyword所見のトグル）
export function isFindingPresent(finding, values, sex, findingsOn, testById) {
  if (!finding) return false;
  // keyword所見（画像・身体・病理）は明示トグル
  if (finding.direction === 'present' || finding.direction === 'absent' || !finding.direction) {
    const on = findingsOn?.has(finding.id);
    return finding.direction === 'absent' ? !on : !!on;
  }
  // 数値/定性所見: 対応する検査値を評価
  const test = testById?.[finding.testId];
  const valueKey = test?.refKey || finding.testId;
  const raw = values?.[valueKey];
  if (raw === '' || raw == null) {
    // 定性のpositive/negativeは findingsOn でも可
    if (findingsOn?.has(finding.id)) return true;
    return false;
  }
  const ev = evalVal(valueKey, raw, sex);
  if (ev == null) {
    if (findingsOn?.has(finding.id)) return true;
    return false;
  }
  if (finding.direction === 'any') return true;
  return ev === finding.direction;
}


// ─────────────────────────────────────────────────────────────
//  3) 算出値・パターン
// ─────────────────────────────────────────────────────────────
export function computeDerived(DERIVED, values, sex) {
  const out = {};
  const ctx = { sex };
  for (const d of DERIVED) {
    try {
      const val = d.compute(values, ctx);
      if (val != null && !Number.isNaN(val)) {
        out[d.id] = {
          value: val,
          text: d.interpret ? d.interpret(val) : null,
          def: d,
        };
      }
    } catch { /* 入力不足はスキップ */ }
  }
  return out;
}

// パターン評価: 入力から成立している組み合わせ解釈を返す
export function evalPatterns(PATTERNS, values, sex, testById) {
  const ev = {};
  // 各検査値の low/normal/high を先に計算
  for (const key of Object.keys(values || {})) {
    const test = testById?.[key];
    const refKey = test?.refKey || key;
    const e = evalVal(refKey, values[key], sex);
    if (e) ev[key] = e;
    // refKey が別名の場合も引けるように両方入れる
    if (refKey !== key && e) ev[refKey] = e;
  }
  const hits = [];
  for (const p of PATTERNS) {
    try {
      if (p.when(ev, values || {})) hits.push(p);
    } catch { /* skip */ }
  }
  return { ev, hits };
}


// ─────────────────────────────────────────────────────────────
//  4) 現在位置の計算（入力モード）
//     入力された値/所見から、鑑別マップ上で「どこまで絞れているか」を出す。
//     ・各疾患について keyFindings のうち何がそろっているか（レイヤー別）
//     ・次に行うと絞り込みが進む検査（レイヤーの若い順に提案）
// ─────────────────────────────────────────────────────────────
export function computePosition(index, values, sex, findingsOn) {
  const { DISEASES, FINDINGS, findingById, testById } = index;
  const present = new Set(); // 出ている所見id
  for (const f of FINDINGS) {
    if (isFindingPresent(f, values, sex, findingsOn, testById)) present.add(f.id);
  }

  const diseaseStatus = DISEASES.map(d => {
    const refs = d.keyFindings || [];
    const byLayer = { 1: [], 2: [], 3: [] };
    let met = 0, contra = 0, testable = 0;
    for (const r of refs) {
      const f = findingById[r.finding];
      const layer = r.layer || 2;
      const on = present.has(r.finding);
      // 反証: rule_out 役割の所見が出ている / required所見が「反対方向で観測」
      const observed = f ? findingObserved(f, values, sex, findingsOn, testById) : null;
      if (observed === 'measured') testable++;
      if (on) { met++; (byLayer[layer] ||= []).push({ ref: r, finding: f, state: 'met' }); }
      else if (observed === 'contra') { contra++; (byLayer[layer] ||= []).push({ ref: r, finding: f, state: 'contra' }); }
      else (byLayer[layer] ||= []).push({ ref: r, finding: f, state: observed === 'measured' ? 'off' : 'unknown' });
    }
    const requiredRefs = refs.filter(r => r.required);
    const requiredMet  = requiredRefs.filter(r => present.has(r.finding)).length;
    const status =
      contra > 0 ? 'contradicted'
      : (requiredRefs.length > 0 && requiredMet === requiredRefs.length) ? 'supported'
      : met > 0 ? 'partial'
      : 'untouched';
    return { disease: d, byLayer, met, contra, requiredMet, requiredTotal: requiredRefs.length, status };
  });

  // 次の一手: まだ測っていない所見のうち、絞り込みに寄与する検査をレイヤー順で提案
  const nextTests = suggestNextTests(index, values, present, diseaseStatus);

  const supported    = diseaseStatus.filter(s => s.status === 'supported');
  const partial      = diseaseStatus.filter(s => s.status === 'partial');
  const contradicted = diseaseStatus.filter(s => s.status === 'contradicted');

  return { present, diseaseStatus, supported, partial, contradicted, nextTests };
}

// 数値検査が測定済みで、期待方向と逆かどうか
function findingObserved(finding, values, sex, findingsOn, testById) {
  const test = testById?.[finding.testId];
  const valueKey = test?.refKey || finding.testId;
  const raw = values?.[valueKey];
  if (finding.direction === 'present' || finding.direction === 'absent' || !finding.direction) {
    return findingsOn?.has(finding.id) ? 'measured' : 'unmeasured';
  }
  if (raw === '' || raw == null) return findingsOn?.has(finding.id) ? 'measured' : 'unmeasured';
  const ev = evalVal(valueKey, raw, sex);
  if (ev == null) return 'unmeasured';
  if (finding.direction === 'any') return 'measured';
  if (ev === finding.direction) return 'measured';
  if (ev === 'normal') return 'measured'; // 測ったが方向でない
  return 'contra'; // 反対の異常
}

// 絞り込みに寄与する未測定検査をランキング
function suggestNextTests(index, values, present, diseaseStatus) {
  const { DISEASES, findingById, testById } = index;
  const entered = new Set(Object.keys(values || {}).filter(k => values[k] !== '' && values[k] != null));
  const gain = {}; // testId -> { layer, forDiseases:Set, findings:Set }
  const relevant = new Set(
    diseaseStatus.filter(s => s.status === 'partial' || s.status === 'supported')
      .map(s => s.disease.id)
  );
  for (const d of DISEASES) {
    const boost = relevant.has(d.id) ? 2 : 1; // 既に絡んでいる疾患の検査を優先
    for (const r of (d.keyFindings || [])) {
      if (present.has(r.finding)) continue;
      const f = findingById[r.finding];
      if (!f) continue;
      const test = testById[f.testId];
      const valueKey = test?.refKey || f.testId;
      if (entered.has(valueKey)) continue; // もう測っている
      const g = (gain[f.testId] ||= { testId: f.testId, layer: r.layer || 2, score: 0, forDiseases: new Set(), findings: new Set() });
      g.layer = Math.min(g.layer, r.layer || 2);
      g.score += boost;
      g.forDiseases.add(d.name);
      g.findings.add(f.id);
    }
  }
  return Object.values(gain)
    .map(g => ({ ...g, forDiseases: [...g.forDiseases], findings: [...g.findings] }))
    // レイヤーが若い（=最初にやる）ものを上に、その中でスコア降順
    .sort((a, b) => (a.layer - b.layer) || (b.score - a.score))
    .slice(0, 12);
}


// ─────────────────────────────────────────────────────────────
//  5) 表示ヘルパー
// ─────────────────────────────────────────────────────────────
export function testLayer(test, override) {
  return layerMeta(override || test?.defaultLayer || LAYER.DIFF);
}
