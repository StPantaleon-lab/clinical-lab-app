// src/lib/coverage.js
// 現在の入力値から「判定可能/部分/判定不可」をカテゴリ分けする

import { DISEASES } from '../data/diseases.js';
import { evalVal } from '../data/referenceRanges.js';

/**
 * 疾患ごとの判定可能性を返す
 * @returns {
 *   evaluable:  Disease[] - 必要な検査値が全部揃っている
 *   partial:    { disease, missing[], present[] }[] - 一部だけある
 *   unevaluable:Disease[] - 必要な検査値が全くない
 * }
 */
export function analyzeCoverage(values, sex) {
  const entered = new Set(
    Object.keys(values).filter(
      (k) => values[k] !== "" && values[k] !== null && values[k] !== undefined
    )
  );

  const evaluable = [];
  const partial = [];
  const unevaluable = [];

  for (const disease of DISEASES) {
    const required = disease.requiredKeys;
    const present = required.filter((k) => entered.has(k));
    const missing = required.filter((k) => !entered.has(k));

    if (missing.length === 0) {
      evaluable.push(disease);
    } else if (present.length > 0) {
      partial.push({ disease, missing, present });
    } else {
      unevaluable.push(disease);
    }
  }

  return { evaluable, partial, unevaluable };
}

/**
 * 疾患を否定するために追加すべき検査値を返す
 * （現在の検査値では陽性判定になっている疾患を追加検査で除外できるかどうか）
 */
export function getRuleOutOpportunities(values, sex, matchedDiseases) {
  return matchedDiseases
    .filter((d) => d.ruleOutKeys && d.ruleOutKeys.length > 0)
    .map((d) => {
      const missing = d.ruleOutKeys.filter((k) => {
        const v = values[k];
        return v === "" || v === null || v === undefined;
      });
      return { disease: d, missingRuleOutKeys: missing };
    })
    .filter((r) => r.missingRuleOutKeys.length > 0);
}

/**
 * 全疾患に対して「追加すれば新たに判定可能になる検査値」のランキングを返す
 * 最も多くの疾患を解禁できる検査値が上位に来る
 */
export function getSuggestedNextTests(values) {
  const entered = new Set(
    Object.keys(values).filter(
      (k) => values[k] !== "" && values[k] !== null && values[k] !== undefined
    )
  );

  const gainMap = {}; // key → 解禁できる疾患ID[]

  for (const disease of DISEASES) {
    const missing = disease.requiredKeys.filter((k) => !entered.has(k));
    const present = disease.requiredKeys.filter((k) => entered.has(k));

    // あと1つで判定可能になるもの
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
