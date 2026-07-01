// src/lib/coverage.js

import { DISEASES } from '../data/diseases.js';
import { evalVal, REF } from '../data/referenceRanges.js';

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
// 疾患ごとのスコアを計算（検査値＋症候）
// ────────────────────────────────────────────────
export function scoreDiseases(values, sex, checkedSymptoms = {}) {
  return DISEASES.map((d) => {
    // 検査値スコア
    const items = d.requiredKeys.map(({ key, direction }) => ({
      key, direction,
      status: scoreItem(key, direction, values, sex),
    }));
    const match      = items.filter(i => i.status === "match");
    const missing    = items.filter(i => i.status === "missing");
    const normalOut  = items.filter(i => i.status === "normal_out");
    const opposite   = items.filter(i => i.status === "opposite");
    const total      = items.length;

    // 症候スコア（一致症候数 / 全症候数）
    const matchedSymptoms = d.symptoms.filter(s => checkedSymptoms[s.key]);
    const symptomScore    = d.symptoms.length > 0
      ? matchedSymptoms.length / d.symptoms.length
      : 0;

    // 総合スコア（検査値7割・症候3割）
    const labScore = total === 0 ? 0
      : (match.length * 2 - normalOut.length - opposite.length * 2) / (total * 2);
    const score = labScore * 0.7 + symptomScore * 0.3;

    return { disease: d, items, match, missing, normalOut, opposite, score, total, matchedSymptoms };
  }).sort((a, b) => b.score - a.score);
}

// ────────────────────────────────────────────────
// 判定可能 / 一部 / 不可 の分類
// ────────────────────────────────────────────────
export function analyzeCoverage(values, sex) {
  const entered = new Set(
    Object.keys(values).filter(k => values[k] !== "" && values[k] !== null && values[k] !== undefined)
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
  const entered = new Set(
    Object.keys(values).filter(k => values[k] !== "" && values[k] !== null && values[k] !== undefined)
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
