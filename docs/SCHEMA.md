# データモデル解説（Sonnet向け・拡張の設計図）

このアプリは **診断エンジンではなく「鑑別の地図」** です。目的は病名当てではなく、
「ある検査／異常が出たとき、鑑別作業全体のどこに来たか」「次に何をすると何が絞れるか」
を理解させること。データを足すときは常にこの目的に沿わせてください。

---

## 全体像：3つの中核抽象

| 抽象 | ファイル | 役割 |
|------|----------|------|
| **Test（検査）** | `src/data/tests.js` | 診断的行為。血液・尿に限らず画像・生検・身体所見・機能検査も同じ器で扱う |
| **Finding（所見）** | `src/data/findings.js` | 検査が生む観測の最小単位。数値異常も画像所見も同じ構造 |
| **Pathway（鑑別路）** | `src/data/pathways.js` | 「主訴/異常 → 検査 → 所見 → 疾患群 → 確定」の分岐ツリー |

補助:
- **Disease** (`diseases.js`) … 疾患。所見を**レイヤー付き**で参照する
- **Presentation** (`presentations.js`) … 鑑別の入口（主訴・検査異常）
- **Derived** (`derived.js`) … 算出値（eGFR, AG, FENa, TSAT, FIB-4 …）
- **Pattern** (`patterns.js`) … 組み合わせ解釈（ALP+γGTP, TSH+FT4, Ca+PTH …）
- **Panel** (`Test.panel`) … 束で読む検査（鉄動態・溶血マーカー・甲状腺機能・血液ガス）

### ファイル配置（v2で各科モジュール化）
コア（`data/tests.js` 等）に消化器・血液の基礎があり、
その上に `data/systems/*.js` が科ごとに積み重なる。`data/index.js` が両者を
`mergeById()` で結合する（同一idはコア優先、重複は `validate.mjs` が報告）。
科を足すときは `systems/<新科>.js` を作り `systems/_index.js` に import するだけ。

すべての型定義は `src/model/schema.js` の JSDoc にあります。**まずそこを読む**こと。

---

## レイヤー（このアプリの背骨）

検査・所見・疾患参照にはすべて「レイヤー」が付きます。

- **L1（最初）** … 最初によくする検査。広く浅く、方向づけ。`teal`
- **L2（鑑別）** … 疾患群の中を区別するために追加する検査。`amber`
- **L3（確定）** … 決定的な検査（生検・特異抗体・特定の画像/遺伝子）。`violet`

**重要**：L1〜L2で確定するものは、そのレイヤーのまま「確定」を担ってよい。
すべてがL3まで進む必要はない（`confirm` が L1/L2 の検査でも構わない）。

`LAYER.SCREEN / DIFF / CONFIRM`（= 1/2/3）を使う。色は全ビューで自動適用される。

---

## データの流れ

```
tests.js ─┐
findings.js─┤
diseases.js ┤
pathways.js ┼─→ data/index.js ─ buildIndex() ─→ ATLAS ─→ 全UIコンポーネント
presentations.js┤       （engine.js が逆引きインデックスを構築）
derived.js  ┤
patterns.js ┘
```

- **編集するのは `src/data/*.js` だけ**。UIやengineは触らなくてよい。
- `data/index.js` の import に配列が入っていれば、`buildIndex()` が
  検査⇄所見⇄疾患⇄パスウェイの相互参照を自動生成し、全ビューに反映される。

---

## 命名規則（厳守）

- **Test.id**：短い英字。数値検査は略号（`ALT`, `MCV`）。行為系は `abdo_ct`, `egd` など。
- **Finding.id**：
  - 数値 → `<TestId>_<low|high|normal>`（例 `ALT_high`, `MCV_low`）
  - 所見 → `<モダリティ略>_<所見>`（例 `us_gallstone`, `ct_free_air`, `path_hcc`）
- **Disease.id**：英語スネークケース（`iron_deficiency`）。
- **group**：`grp_<...>`。鑑別で絞り込む単位に揃える（例 `grp_microcytic`＝小球性貧血）。
  表示名は `diseases.js` の `GROUPS` に追加する。

---

## 「組み合わせで読む」ための3つの装置

内分泌に典型的なように、単独の検査値では原発性か中枢性かすら決まらないことが多い。
そこで v2 では次の3つを別建ての一級市民として持つ。

| 装置 | 何を表すか | 例 |
|------|-----------|-----|
| **Panel** (`Test.panel`) | セットで出して束で読む検査 | 鉄動態 = Fe / TIBC / フェリチン |
| **Derived** (`derived.js`) | 値から計算して初めて意味を持つ指標 | アニオンギャップ、FENa、TSAT |
| **Pattern** (`patterns.js`) | 複数検査の**関係**が意味を持つ読み方 | TSH↓+FT4↑ = 原発性中毒症 |

Pattern の `when(ev, v)` は `ev`（各検査の low/normal/high）と `v`（生値）を受け取る。
「TSHとFT4を対で読む」「CaとPTHを対で読む」という臨床の作法が、そのまま `when` の条件式になる。

---

## 数値検査と referenceRanges.js

- 数値検査は `refKey` で `referenceRanges.js` の `REF` を再利用する
  （正常範囲・単位・性差を共有）。新しい数値検査は **まず REF にキーを足す**。
- `evalVal(key, value, sex)` が `'low'|'normal'|'high'` を返し、
  Finding の `direction` と突き合わせて「その所見が出ているか」を判定する。
- 所見系（画像・身体・病理）は `valued:false`、`direction:'present'`。
  入力モードでは**トグル**で扱われる。

---

## 各ビューがデータをどう使うか（追加時の副作用）

- **鑑別マップ**：`pathways.js` のツリーをレイヤー色の階段で描く。
  → 分岐の `finding` が実在すると、入力モードと連動してハイライトされる。
- **検査から見る**：`tests.js` + `labInfo.js`（機序）+ 逆引きで「どのパスウェイで使うか」。
- **疾患から見る**：`diseases.js` の `keyFindings` をレイヤー別に並べ、到達パスを示す。
- **検査値入力**：`computePosition()` が支持/部分/矛盾を判定し、`suggestNextTests()` が
  レイヤーの若い順に「次の一手」を出す。`typical` はデモ値に使われる。

---

## 拡張の優先順位（ユーザー指定）

消化器 → 血液 → 内分泌 → 泌尿器 → 小児 → 他科。
可能なら「学部レベルで習う疾患と、それに必要な検査は全て入れる」。

現状は10系統・疾患141・検査198まで到達。未収載の主な領域は
**産婦人科・眼科・耳鼻科・皮膚科・整形外科・精神科・救急（中毒）**。
`systems/<科>.js` を新規作成して `_index.js` に足せば、UIは何も変えずに拡張される。

具体的な追加手順は `ADD_DISEASE.md` を参照。追加後は必ず
`node ../validate.mjs`（または下記）で参照整合性を確認すること。
