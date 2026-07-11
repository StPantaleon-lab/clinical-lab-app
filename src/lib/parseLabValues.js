// src/lib/parseLabValues.js
// ═══════════════════════════════════════════════════════════════════════
//  自動読み取り ― テキスト/画像から「検査値」と「所見」を取り出す
// ═══════════════════════════════════════════════════════════════════════
//  3系統の抽出をこの順で試す:
//    1. ルールベース  … REF から辞書を自動生成して正規表現でマッチ。オフラインで動く。
//    2. Groq(テキスト) … Worker経由。OCR崩れや表記ゆれに強い。
//    3. Groq(ビジョン) … 画像を直接読ませる。OCRが失敗したときの保険。
//
//  さらに所見（Finding）も拾う: 「Murphy徴候陽性」「free air」など、
//  FINDINGS の label から検索語を作り、テキスト中の出現を検出する。
//
//  ★ 辞書は静的に持たない。ATLAS を渡せば常に最新の検査・所見に追随する。
// ═══════════════════════════════════════════════════════════════════════

import { groqChat, groqVision, getExamples, hasWorker } from './masterData.js';

// ─────────────────────────────────────────────────────
//  0) 前処理
// ─────────────────────────────────────────────────────
export function normalizeText(raw) {
  return String(raw || '')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/．/g, '.').replace(/，/g, ',').replace(/：/g, ':')
    .replace(/\t+/g, ' ')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
}

// ─────────────────────────────────────────────────────
//  1) ルールベース抽出（REFから辞書を自動生成）
// ─────────────────────────────────────────────────────
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** REF から「表記 → キー」の辞書を作る。長い表記から順に照合する。 */
export function buildAliasMap(REF) {
  const alias = [];
  for (const [key, ref] of Object.entries(REF)) {
    const names = new Set([key, ref.abbr, ref.label].filter(Boolean));
    // 「AST（GOT）」→「AST」「GOT」のように括弧内も分離
    for (const n of [...names]) {
      const m = String(n).match(/^(.+?)[（(](.+?)[)）]$/);
      if (m) { names.add(m[1].trim()); names.add(m[2].trim()); }
    }
    for (const n of names) {
      const name = String(n).trim();
      if (!name) continue;
      // 1文字の別名（P, K, Ca以外の単文字…）は他項目の数値に暴発しやすいので、
      // その1文字がキー自身と一致する場合のみ、かつ英大文字のときだけ許可する。
      if (name.length === 1 && !(name === key && /[A-Z]/.test(name))) continue;
      alias.push({ key, name });
    }
  }
  return alias.sort((a, b) => b.name.length - a.name.length);
}

/**
 * テキストから検査値を抽出する（オフライン）
 * @returns {{values: Object, source: string, matched: string[]}}
 */
export function extractValuesRuleBased(text, REF) {
  const t = normalizeText(text);
  const alias = buildAliasMap(REF);
  const values = {};
  const matched = [];

  for (const { key, name } of alias) {
    if (values[key] != null) continue;
    // 「Hb 12.3」「Hb: 12.3 g/dL」「Hb ... 12.3」に対応。単位や記号を挟んでもよい。
    // 名前の直後に英数字が続く場合（P が PLT の一部など）は誤マッチなので境界を要求する。
    const re = new RegExp(
      `(?:^|[^A-Za-z0-9_\\-])${escape(name)}(?![A-Za-z0-9])\\s*[:：=]?\\s*[^0-9\\-\\n]{0,10}?(-?\\d+(?:\\.\\d+)?)`,
      'im'
    );
    const m = t.match(re);
    if (!m) continue;
    const v = parseFloat(m[1]);
    if (Number.isNaN(v)) continue;
    // 明らかな外れ値（桁違い）を弾く: 基準上限の100倍を超える値は誤マッチとみなす
    const ref = REF[key];
    const hi = ref.max ?? ref.maleMax ?? ref.femaleMax;
    if (hi != null && hi > 0 && v > hi * 100) continue;
    values[key] = v;
    matched.push(`${name}→${key}`);
  }
  return { values, source: 'rule', matched };
}

/**
 * テキストから所見（Finding）を検出する。
 * ラベルの主要語（記号・注釈を除いた部分）が本文に現れたら陽性とみなす。
 */
export function extractFindings(text, FINDINGS) {
  const t = normalizeText(text).toLowerCase();
  const hits = [];
  for (const f of FINDINGS) {
    if (f.direction !== 'present') continue;      // 数値所見は値から評価されるので除外
    // 「US:胆嚢結石（音響陰影）」→ 検索語「胆嚢結石」
    const core = String(f.label)
      .replace(/^[^:：]{1,8}[:：]/, '')
      .replace(/[（(].*?[)）]/g, '')
      .trim();
    if (core.length < 3) continue;
    if (t.includes(core.toLowerCase())) hits.push({ id: f.id, label: f.label, matched: core });
  }
  return hits;
}

// ─────────────────────────────────────────────────────
//  2) Groq（テキスト）抽出
// ─────────────────────────────────────────────────────
function buildSystemPrompt(REF, examples) {
  const keys = Object.keys(REF).join(',');
  const shots = examples.slice(-6).map(
    (e) => `入力: ${e.inputSnippet}\n出力: ${JSON.stringify({ values: e.parsedValues })}`
  ).join('\n\n');
  return [
    'あなたは臨床検査結果の抽出器です。入力テキストから検査値だけを取り出し、JSONのみを返します。',
    '出力形式: {"values":{"キー":数値,...}}',
    `使用してよいキー: ${keys}`,
    '読み取れない項目は含めないでください。単位・基準値・コメントは出力しないでください。',
    'コードブロックや説明文は禁止です。JSONのみを返してください。',
    shots ? `\n参考例:\n${shots}` : '',
  ].join('\n');
}

function parseJsonLoose(raw) {
  const clean = String(raw).replace(/```json/gi, '').replace(/```/g, '').trim();
  const s = clean.indexOf('{'), e = clean.lastIndexOf('}');
  return JSON.parse(s >= 0 && e > s ? clean.slice(s, e + 1) : clean);
}

/** REFに存在し数値であるものだけを残す */
function sanitize(values, REF) {
  const out = {};
  for (const [k, v] of Object.entries(values || {})) {
    if (!REF[k]) continue;
    const n = typeof v === 'number' ? v : parseFloat(v);
    if (!Number.isNaN(n)) out[k] = n;
  }
  return out;
}

export async function extractValuesWithAI(text, REF) {
  const examples = await getExamples();
  const data = await groqChat([
    { role: 'system', content: buildSystemPrompt(REF, examples) },
    { role: 'user', content: normalizeText(text).slice(0, 6000) },
  ], { max_tokens: 1200 });
  const content = data.choices?.[0]?.message?.content || '';
  const parsed = parseJsonLoose(content);
  return { values: sanitize(parsed.values, REF), source: 'groq' };
}

// ─────────────────────────────────────────────────────
//  3) Groq（ビジョン）抽出 ― 画像を直接読ませる
// ─────────────────────────────────────────────────────
export async function extractValuesFromImage(base64, mimeType, REF) {
  const keys = Object.keys(REF).join(',');
  const prompt =
    'この画像は臨床検査結果です。すべての検査値を正確に読み取り、JSONのみで返してください。\n' +
    '{"values":{"キー":数値,...}}\n' +
    `使用してよいキー: ${keys}\n` +
    '説明文・コードブロックは禁止。JSONのみ。';
  const { content } = await groqVision(base64, mimeType, prompt);
  const parsed = parseJsonLoose(content);
  return { values: sanitize(parsed.values, REF), source: 'groq-vision' };
}

// ─────────────────────────────────────────────────────
//  4) 統合エントリポイント
// ─────────────────────────────────────────────────────
/**
 * テキストから抽出する。AIが使えるならAI→足りない分をルールベースで補完。
 * @param {string} text
 * @param {object} atlas ATLAS（REF と FINDINGS を使う）
 * @param {{useAI:boolean}} opts
 */
export async function extractFromText(text, atlas, { useAI = true } = {}) {
  const { REF, FINDINGS } = atlas;
  const rule = extractValuesRuleBased(text, REF);
  let values = rule.values, source = 'rule', warning = null;

  if (useAI && hasWorker()) {
    try {
      const ai = await extractValuesWithAI(text, REF);
      // AIを主、ルールベースを補完に使う（AIが取りこぼした項目を足す）
      values = { ...rule.values, ...ai.values };
      source = 'groq+rule';
    } catch (e) {
      warning = `AI抽出に失敗したためルールベースで解析しました（${e.message}）`;
    }
  }
  return { values, findings: extractFindings(text, FINDINGS), source, warning, rawText: normalizeText(text) };
}

/**
 * 画像から抽出する。まずブラウザ内OCR→テキスト解析、失敗ならビジョンにフォールバック。
 * @param {string} base64
 * @param {string} mimeType
 * @param {object} atlas
 * @param {{onOcrProgress?:Function, useAI?:boolean, forceVision?:boolean}} opts
 */
export async function extractFromImage(base64, mimeType, atlas, opts = {}) {
  const { onOcrProgress, useAI = true, forceVision = false } = opts;
  const { REF, FINDINGS } = atlas;

  if (!forceVision) {
    try {
      const { ocrImage } = await import('./ocrImage.js');
      const raw = await ocrImage(base64, mimeType, onOcrProgress);
      const text = normalizeText(raw);
      const res = await extractFromText(text, atlas, { useAI });
      // OCRで十分な項目が取れたならそれを採用
      if (Object.keys(res.values).length >= 3) return { ...res, ocrText: text };
      // 取れ高が乏しい → ビジョンへ
      if (hasWorker()) {
        const v = await extractValuesFromImage(base64, mimeType, REF);
        return { values: { ...res.values, ...v.values }, findings: extractFindings(text, FINDINGS),
                 source: 'groq-vision', ocrText: text, warning: 'OCRの取れ高が少ないため画像を直接読み取りました' };
      }
      return { ...res, ocrText: text, warning: 'OCRで十分に読み取れませんでした' };
    } catch (e) {
      if (!hasWorker()) throw e;
    }
  }
  const v = await extractValuesFromImage(base64, mimeType, REF);
  return { values: v.values, findings: [], source: 'groq-vision', ocrText: '' };
}
