# 疾患・検査を1つ足すレシピ

`src/data/systems/<科>.js` を開き、以下の順に足す。**UI とengineは触らない。**
最後に必ず `node validate.mjs` を実行する。

---

## 0. どのファイルに書くか

| 内容 | ファイル |
|------|----------|
| 電解質・血糖・脂質・血液ガス・尿・バイタル | `systems/common.js` |
| 消化器 | `systems/gastro.js`（コアの `data/tests.js` 等にも基礎部分がある） |
| 血液 | `systems/hematology.js` |
| 内分泌 | `systems/endocrine.js` |
| 腎泌尿器 | `systems/urology.js` |
| 小児 | `systems/pediatrics.js` |
| 循環器・呼吸器 | `systems/cardiopulm.js` |
| 神経・膠原病・感染症 | `systems/neuro_rheum_id.js` |
| 新しい科 | `systems/<新科>.js` を作り `systems/_index.js` の `MODULES` に追加 |

---

## 1. 検査（Test）

```js
// 数値検査：refKey は referenceRanges.js のキー（無ければ REF_EXTRA に足す）
numT('TSH', 'TSH', '内分泌', S),

// 所見系検査（画像・身体・病理・生理・遺伝子）
obsT('thyroid_scinti', '甲状腺シンチグラフィー', 'imaging', '内分泌', D,
  ['scinti_diffuse_uptake','scinti_low_uptake'],
  'シンチは「甲状腺が自分で作っているか」を可視化する。'),

// パネル検査：束で読む検査。構成する Test.id を panel に並べる
panelT('thyroid_panel', '甲状腺機能検査', '内分泌', S, ['TSH','FT4','FT3'],
  'TSHとFT4は必ず対で読む。'),
```

`S / D / C` は `LAYER.SCREEN / DIFF / CONFIRM`（= L1最初 / L2鑑別 / L3確定）。

---

## 2. 所見（Finding）

```js
num('TSH_low', 'TSH', 'TSH低値', 'low',  'FT4高値と組めば原発性中毒症。低値と組めば中枢性。', 1),
obs('scinti_low_uptake', 'thyroid_scinti', 'シンチ:摂取率低下',
    '甲状腺は作っていないのに血中ホルモンが高い＝破壊性。', 2),
```

- 命名：数値は `<TestId>_<low|high|normal>`、所見は `<モダリティ略>_<所見>`
- `meaning` は**必ず書く**。ここが学習の核。「何を意味するか（機序）」を書く。
- `direction:'normal'` も積極的な情報になりうる（例：`GGT_normal` → ALPは骨由来）。

---

## 3. 疾患（Disease）

```js
{
  id:'graves', name:'Basedow病', system:'内分泌', group:'grp_thyrotoxicosis',
  oneLiner:'TSH↓＋FT4↑＋TRAb陽性＋眼球突出。シンチ摂取率は増加。',
  keyFindings:[
    kf('TSH_low', S, 'rule_in', true),      // (findingId, layer, role, required)
    kf('scinti_diffuse_uptake', D, 'rule_in', true),
    kf('TRAb_high', C, 'rule_in', true),
  ],
  confirm:'TRAb_high',
  confirmNote:'…確定の考え方（何と何が揃えば決まるか）',
  mechanism:'…病態機序',
  typical:{ TSH:0.01, FT4:3.8 },            // 入力モードのデモ値。キーは REF のキー
}
```

- `layer` は「**この疾患の鑑別過程でその所見をどの段階で使うか**」。L3まで進む必要はない。
- `role:'rule_out'` は「その所見が出ていたらこの疾患は否定的」（入力モードで矛盾判定に使う）。
- `group` は `GROUPS` に表示名を追加する（鑑別で絞り込む単位に揃える）。

---

## 4. 鑑別路（Pathway）と入口（Presentation）

```js
export const PRESENTATIONS = [
  pres('pres_thyroid','甲状腺機能異常','abnormality','内分泌',
    'TSHとFT4を必ず対で読む。','pw_thyroid'),
];

export const PATHWAYS = [{
  id:'pw_thyroid', title:'甲状腺機能異常の鑑別', system:'内分泌', entryId:'pres_thyroid',
  summary:'この鑑別の「考え方」を2〜3文で。何が背骨の分岐かを書く。',
  root: st('TSH異常', {
    layer:S, test:'FT4', ask:'FT4はどちらに動いているか？',
    note:'TSHとFT4が逆方向＝原発性、同方向＝中枢性。',
    branches:[
      br('FT4_high','TSH↓＋FT4↑ → 中毒症', st('甲状腺中毒症', {
        layer:D, test:'thyroid_scinti', ask:'摂取率は増加か低下か？',
        branches:[ br('scinti_diffuse_uptake','摂取率↑', dz('graves','Basedow病','TRAb陽性で確定。')) ],
      })),
    ],
  }),
}];
```

- 枝の `finding` は**実在の Finding.id** にする（実在すると入力モードと連動してハイライトされる）。
- `note` には「なぜここで分岐するのか」を書く。このアプリの価値はここに宿る。

---

## 5. 算出値・組み合わせ解釈を足すとき

- `data/derived.js` … `inputs` に使う Test.id を並べる（逆引きに使われる）
- `data/patterns.js` … `when(ev, v)` の `ev` は各検査の `'low'|'normal'|'high'`、`v` は生値

---

## 6. 検証

```bash
node validate.mjs
```

- dangling reference（存在しないID参照）
- ID重複（コアと科モジュールで同じidを定義した）
- パネル構成要素の実在
- `typical` のキーが REF にあるか
- `meaning` 未記入の所見

すべて ✅ になってからコミットする。
