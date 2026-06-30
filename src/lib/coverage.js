// src/lib/coverage.js

import { DISEASES } from '../data/diseases.js';
import { evalVal, REF } from '../data/referenceRanges.js';

// ────────────────────────────────────────────────
// 1項目ごとに「一致 / 否定 / 未検査」を判定
// ────────────────────────────────────────────────
function scoreItem(key, direction, values, sex) {
  const raw = values[key];
  if (raw === "" || raw === null || raw === undefined) return "missing";
  const ev = evalVal(key, raw, sex);
  if (ev === null) return "missing";
  if (direction === "any") return ev !== null ? "match" : "missing";
  if (ev === direction) return "match";
  if (ev === "normal") return "normal_out"; // 正常値が出てしまっている
  // 反対方向の異常（例：lowを期待してhighが出た）
  return "opposite";
}

// ────────────────────────────────────────────────
// 疾患ごとのスコアを計算
// ────────────────────────────────────────────────
export function scoreDiseases(values, sex) {
  return DISEASES.map((d) => {
    const items = d.requiredKeys.map(({ key, direction }) => ({
      key,
      direction,
      status: scoreItem(key, direction, values, sex),
    }));

    const match      = items.filter(i => i.status === "match");
    const missing    = items.filter(i => i.status === "missing");
    const normalOut  = items.filter(i => i.status === "normal_out");
    const opposite   = items.filter(i => i.status === "opposite");

    const total = items.length;
    const score = total === 0 ? 0
      : (match.length * 2 - normalOut.length * 1 - opposite.length * 2) / (total * 2);

    return { disease: d, items, match, missing, normalOut, opposite, score, total };
  }).sort((a, b) => b.score - a.score);
}

// ────────────────────────────────────────────────
// 判定可能 / 一部 / 不可 の分類（カバレッジ用）
// ────────────────────────────────────────────────
export function analyzeCoverage(values, sex) {
  const entered = new Set(
    Object.keys(values).filter(k => values[k] !== "" && values[k] !== null && values[k] !== undefined)
  );

  const evaluable = [], partial = [], unevaluable = [];

  for (const disease of DISEASES) {
    const keys = disease.requiredKeys.map(r => r.key);
    const present = keys.filter(k => entered.has(k));
    const missing = keys.filter(k => !entered.has(k));

    if (missing.length === 0) evaluable.push(disease);
    else if (present.length > 0) partial.push({ disease, missing, present });
    else unevaluable.push(disease);
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
    const keys = disease.requiredKeys.map(r => r.key);
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
