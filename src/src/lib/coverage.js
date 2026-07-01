// src/lib/coverage.js

import { DISEASES } from '../data/diseases.js';
import { evalVal, REF } from '../data/referenceRanges.js';

// ────────────────────────────────────────────────
// UPCR自動計算（随時尿蛋白 / 尿クレアチニン）
// UPro(mg/dL) / UCre(mg/dL) = UPCR(g/gCr)
// ────────────────────────────────────────────────
export function calcDerivedValues(values) {
  const derived = { ...values };

  // UPCR自動計算
  const upro = parseFloat(values.UPro);
  const ucre = parseFloat(values.UCre);
  if (!isNaN(upro) && !isNaN(ucre) && ucre > 0 && !values.UPCR) {
    derived.UPCR = String((upro / ucre).toFixed(2));
  }

  // BMI自動計算
  const h = parseFloat(values.Height);
  const w = parseFloat(values.Weight);
  if (!isNaN(h) && !isNaN(w) && h > 0 && !values.BMI) {
    derived.BMI = String((w / ((h / 100) ** 2)).toFixed(1));
  }

  // Hct → RBC換算補助（Ht表記対応は parseLabValues.js 側で対処）

  return derived;
}

// ────────────────────────────────────────────────
// 検査値1項目のスコア判定
// ────────────────────────────────────────────────
function scoreItem(key, direction, values, sex) {
  const raw = values[key];
  if (raw === "" || raw === null || raw === undefined) return "missing";
  const ev = evalVal(key, raw, sex);
  if (ev === null) return "missing";
  if (direction === "any") return "match";
  if (ev === direction) return "match";
  if (ev === "normal") return "normal_out";
  return "opposite";
}

// ────────────────────────────────────────────────
// 改善版スコアリング
// 「検査済み項目での一致率」を重視し、未検査が多い病気が有利にならないようにする
// ────────────────────────────────────────────────
export function scoreDiseases(values, sex, checkedSymptoms = {}) {
  const derived = calcDerivedValues(values);

  return DISEASES.map((d) => {
    const items = d.requiredKeys.map(({ key, direction }) => ({
      key, direction,
      status: scoreItem(key, direction, derived, sex),
    }));

    const match     = items.filter(i => i.status === "match");
    const missing   = items.filter(i => i.status === "missing");
    const normalOut = items.filter(i => i.status === "normal_out");
    const opposite  = items.filter(i => i.status === "opposite");
    const total     = items.length;
    const checked   = items.filter(i => i.status !== "missing");

    // ── 改善版スコア計算 ──────────────────────────────
    // 検査済み項目がない場合はスコア0
    if (checked.length === 0) {
      return { disease: d, items, match, missing, normalOut, opposite, score: 0, total, matchedSymptoms: [] };
    }

    // 検査済み項目での純粋な一致率（-1〜1）
    const matchRate = checked.length === 0 ? 0
      : (match.length * 2 - normalOut.length - opposite.length * 2) / (checked.length * 2);

    // 検査カバレッジボーナス（検査済み項目数が多いほど信頼性が上がるが緩やかに）
    const coverageBonus = total === 0 ? 0 : Math.sqrt(checked.length / total);

    // 除外ペナルティ（逆方向の異常や正常が出た場合は強く減点）
    const exclusionPenalty = (normalOut.length + opposite.length * 2) / Math.max(checked.length, 1);

    // 検査値スコア（一致率 × カバレッジ × 除外ペナルティ）
    const labScore = matchRate * coverageBonus * (1 - exclusionPenalty * 0.5);

    // 症候スコア
    const matchedSymptoms = d.symptoms.filter(s => checkedSymptoms[s.key]);
    const symptomScore = d.symptoms.length > 0
      ? matchedSymptoms.length / d.symptoms.length
      : 0;

    // 総合スコア（検査値7割・症候3割）
    const score = Math.max(0, labScore * 0.7 + symptomScore * 0.3);

    return { disease: d, items, match, missing, normalOut, opposite, score, total, matchedSymptoms };
  }).sort((a, b) => b.score - a.score);
}

// ────────────────────────────────────────────────
// 判定可能 / 一部 / 不可 の分類
// ────────────────────────────────────────────────
export function analyzeCoverage(values, sex) {
  const derived = calcDerivedValues(values);
  const entered = new Set(
    Object.keys(derived).filter(k => derived[k] !== "" && derived[k] !== null && derived[k] !== undefined)
  );
  const evaluable = [], partial = [], unevaluable = [];

  for (const disease of DISEASES) {
    const keys    = disease.requiredKeys.map(r => r.key);
    const present = keys.filter(k => entered.has(k));
    const missing = keys.filter(k => !entered.has(k));

    if (missing.length === 0)       evaluable.push(disease);
    else if (present.length > 0)    partial.push({ disease, missing, present });
    else                            unevaluable.push(disease);
  }
  return { evaluable, partial, unevaluable };
}

// ────────────────────────────────────────────────
// 陽性疾患の否定に必要な追加検査
// ────────────────────────────────────────────────
export function getRuleOutOpportunities(values, matchedDiseases) {
  return matchedDiseases
    .filter(d => d.ruleOutKeys && d.ruleOutKeys.length > 0)
    .map(d => ({
      disease: d,
      missingRuleOutKeys: d.ruleOutKeys.filter(k => {
        const v = values[k];
        return v === "" || v === null || v === undefined;
      }),
    }))
    .filter(r => r.missingRuleOutKeys.length > 0);
}

// ────────────────────────────────────────────────
// あと1項目で判定可能になる検査のランキング
// ────────────────────────────────────────────────
export function getSuggestedNextTests(values) {
  const derived = calcDerivedValues(values);
  const entered = new Set(
    Object.keys(derived).filter(k => derived[k] !== "" && derived[k] !== null && derived[k] !== undefined)
  );
  const gainMap = {};
  for (const disease of DISEASES) {
    const keys    = disease.requiredKeys.map(r => r.key);
    const missing = keys.filter(k => !entered.has(k));
    const present = keys.filter(k => entered.has(k));
    if (missing.length === 1 && present.length > 0) {
      const k = missing[0];
      if (!gainMap[k]) gainMap[k] = [];
      gainMap[k].push(disease.name);
    }
  }
  return Object.entries(gainMap)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([key, diseases]) => ({ key, diseases }));
}
