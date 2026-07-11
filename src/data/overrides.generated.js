// src/data/overrides.generated.js
// ═══════════════════════════════════════════════════════════════════════
//  KV（管理画面で編集した内容）をローカルへ落としたもの
// ═══════════════════════════════════════════════════════════════════════
//  ★ このファイルは `node scripts/apply-kv.mjs` が自動生成する。
//    手で編集しても構わないが、次回の apply-kv 実行で上書きされる。
//  ★ 空でもアプリは完全に動く（静的データだけで動作する）。
//
//  形は data/index.js の buildAtlas() が受け取るオーバーライドと同じ:
//    TESTS/FINDINGS/DISEASES/PATHWAYS/PRESENTATIONS … id で upsert（後勝ち）
//    GROUPS/REF/LAB_INFO … キーで浅くマージ
//    要素に __deleted:true を付けると、その id を静的データから削除できる。
export default {
  __source: 'overrides.generated.js',
  __generatedAt: null,
  TESTS: [],
  FINDINGS: [],
  DISEASES: [],
  PATHWAYS: [],
  PRESENTATIONS: [],
  GROUPS: {},
  REF: {},
  LAB_INFO: {},
};
