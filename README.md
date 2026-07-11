# 臨床鑑別アトラス（Clinical Differential Atlas）v2

検査と疾患の関係を **「鑑別の地図」** として歩くための医学教育アプリ。
病名を当てるためではなく、**「ある検査／異常が出たとき、鑑別作業全体のどこに来たのか」
「次に何をすると何が絞れるのか」** を理解することを目的にしている。

旧「臨床検査値 疾患推定ツール」の資産（正常範囲・機序解説）を引き継ぎつつ、
データモデルを **フラットなスコアリング → 鑑別パスウェイ・グラフ** に作り替えたもの。

---

## すぐ動かす

```bash
npm install
npm run dev      # http://localhost:5173
```

ビルド：`npm run build` ／ データ検証：`node validate.mjs`

依存は React と Vite のみ。**ログイン不要・Worker不要で全ビューが動く**（静的データで完結）。
KV連携・自動読み取り・管理機能を使うときだけ Worker とログインが必要（下記）。

---

## この設計の3つの柱

### 1. 「全ての医療で行われる検査」を1つの器で扱う
血液・尿だけでなく、**CT・MRI・シンチグラフィー・内視鏡・生検・聴診・打診・
心電図・呼吸機能・負荷試験・遺伝子検査**を、すべて `Test`（検査）として同型に扱う。
画像そのものは扱わず、**名前のついた所見をキーワード（`Finding`）として**持つ
（例：`ct_free_air`＝遊離ガス、`scinti_low_uptake`＝シンチ摂取率低下、`crystal_urate`＝尿酸塩結晶）。

### 2. 3つのレイヤーが全ビューを貫く
**L1 最初によくする検査（teal）→ L2 鑑別のために追加する検査（amber）→ L3 確定診断に必要な検査（violet）**

L1〜L2で確定するものは、そのレイヤーのまま「確定」を担う（すべてがL3まで進む必要はない）。

### 3. 算出値と組み合わせ解釈を一級市民として持つ
- **Derived（算出値）**：eGFR・AST/ALT比・アニオンギャップ・FENa・TSAT・FIB-4・HOMA-IR・補正Na など
- **Pattern（組み合わせ解釈）**：ALP+γGTP、LD+AST、TSH+FT4、Cort+ACTH、Ca+PTH、Fe+TIBC+フェリチン など
- **Panel（パネル検査）**：鉄動態・溶血マーカー・甲状腺機能・血液ガスなど「束で読む」検査

内分泌の「上位ホルモンと対で読む」という作法が、そのままデータ構造になっている。

---

## 5つのビュー

| タブ | 何ができるか |
|------|------|
| 🗺 **鑑別マップ** | 主訴/検査異常を入口に、分岐ツリーを**レイヤー色の階段**で歩く（主役ビュー） |
| 🔎 **検査から見る** | 検査の機序・生む所見・組み合わせ／算出・パネル構成・**どのパスウェイで使うか** |
| 🫀 **疾患から見る** | 疾患の病態と、到達までの所見の連鎖（最初→鑑別→確定）と到達経路 |
| ⌨ **検査値入力** | 値/所見を入れると成立パターン・算出値・支持/矛盾疾患・**次の一手**を表示 |
| 📊 **正常範囲** | 数値検査の基準値一覧 |

各ビューには検索と診療科の絞り込みがある（データ規模が大きいため）。

---

## 復活・追加した機能（v2.1）

### 検査値入力タブ（最初のタブ）
- **分野 × レイヤーの3列レイアウト**：分野（血球系・肝機能…）で区切り、その中を
  L1最初 / L2鑑別 / L3確定 の3列に配置。「まず何を出し、次に何を足すか」が入力画面で分かる。
- **高値(赤)・低値(青)・正常(緑)の色分け**と、**一般的な単位**・基準範囲の表示。
- **ⓘ 検査の概要**：機序と「高値/低値で考える疾患」を開ける（全数値検査に収録）。
- **⚡ 自動読み取り（オートフィル）**：検査結果のテキスト貼り付け／画像から値と所見を抽出し、
  **プレビューして「入力欄に適用」**。3系統（ルールベース→Groqテキスト→Groqビジョン）で
  段階的に試す。ルールベースはオフラインで動くので、Worker未設定でも最低限は使える。

### 管理機能（管理者ログイン時）
- **フォーム編集**：疾患・検査・所見・入口・鑑別路を1件ずつ追加/更新/削除（KVへ）。
- **一括貼り付け**：Claudeに渡すフォーマットを内蔵。返ってきたJSONを貼るだけで反映。
- **エクスポート**：現在のKVオーバーライドを貼り戻せるJSONとして出力。
- KVは「静的データへの差分（追加・上書き・削除）」だけを持つので、**KVが空でも静的データで動く**。

---

## KV連携のセットアップ（任意）

自動読み取り・管理機能を使う場合のみ必要。

```bash
# 1. KV名前空間を作成し、出力された id を wrangler.toml の [[kv_namespaces]] に貼る
wrangler kv namespace create ATLAS_KV

# 2. Worker をデプロイ
wrangler deploy

# 3. Cloudflare Dashboard で環境変数を設定
#    APP_PASSWORD / ADMIN_PASSWORD / GROQ_API_KEY

# 4. KVを初期化（空のオーバーライド）
npm run kv:seed

# 5. フロントに Worker URL を教える
cp .env.local.example .env.local   # VITE_WORKER_URL を記入
```

### KVで編集した内容をローカルへ落とす（毎回叩く同期）

管理画面（KV）で編集した内容は、そのままでは手元のソースに反映されない。
次のコマンドを叩くと、最新のKVオーバーライドが `src/data/overrides.generated.js` に書き出され、
開発サーバー再起動でローカルにも反映される（自動同期はしない設計）。

```bash
node --env-file=.env.local scripts/apply-kv.mjs   # KV → ローカル
node --env-file=.env.local scripts/upload-kv.mjs  # ローカル → KV（逆方向・任意）
```

（`--env-file` が使えない古いNodeでも、スクリプトが `.env.local` を自前で読む。）

---

## ディレクトリ構成

```
src/
  model/
    schema.js      … 型定義・レイヤー・モダリティ（枠組みの中核。まず読む）
    engine.js      … 逆引きインデックス・所見評価・現在位置計算・算出/パターン
  data/
    ── コア（消化器・血液の基礎部分）
    tests.js / findings.js / diseases.js / pathways.js / presentations.js
    ── 横断
    derived.js     … 算出値（eGFR, AG, FENa, TSAT …）
    patterns.js    … 組み合わせ解釈（ALP+γGTP, TSH+FT4, Ca+PTH …）
    referenceRanges.js / labInfo.js … 基準値・機序解説
    ── 各科モジュール（★ 拡張はここに1ファイル足すだけ）
    systems/
      _kit.js      … 共通ヘルパー（numT / obsT / panelT / num / obs / kf / st / dz / br）
      _index.js    … 全モジュールの集約とID重複検出
      common.js    … 電解質・血糖・脂質・血液ガス・尿・バイタル（全科共通）
      gastro.js / hematology.js / endocrine.js / urology.js /
      pediatrics.js / cardiopulm.js / neuro_rheum_id.js
    labInfoExtra.js … v2で足した数値検査の概要（⌨タブの ⓘ）
    overrides.generated.js … KVで編集した差分をローカルへ落としたもの（apply-kvが生成）
    index.js       … コア+systems+overrides → buildAtlas() → ATLAS
  lib/
    masterData.js  … KV読み書き・ログイン・エクスポート
    parseLabValues.js … 自動読み取り（ルールベース/Groqテキスト/Groqビジョン）
    ocrImage.js    … Tesseract.jsによるブラウザ内OCR（CDN読込・インストール不要）
  components/      … 各ビュー（AutoInput/AdminPanel/LoginGate を含む）
workers/
  proxy.js         … Cloudflare Worker（認証・Groqプロキシ・KV CRUD）
scripts/
  seed-kv.mjs / apply-kv.mjs / upload-kv.mjs … KVの初期化・同期
wrangler.toml / .env.local.example … Worker設定・環境変数のひな型
docs/
  SCHEMA.md        … データモデル解説（拡張の設計図）
  ADD_DISEASE.md   … 疾患を1つ足すレシピ
validate.mjs       … 参照整合性・ID重複・パネル参照のチェック
```

---

## 現在の収録範囲

**10診療系統／検査 198・所見 416・疾患 141・鑑別路 24・入口 27・算出 14・パターン 31**

| 系統 | 主な鑑別マップ |
|------|------|
| 消化器 | 肝逸脱酵素上昇・黄疸・胆汁うっ滞（ALP↑）・急性腹症・血便/下痢 |
| 血液 | 貧血・汎血球減少・白血球増加・出血傾向・リンパ節腫脹・血小板減少 |
| 内分泌 | 甲状腺機能異常・高Ca血症・低Na血症・二次性高血圧・高血糖 |
| 腎泌尿器 | 腎機能低下（AKI/CKD）・蛋白尿/血尿 |
| 小児 | 発熱＋発疹・乳児の嘔吐 |
| 循環器・呼吸器 | 胸痛・呼吸困難 |
| 神経・膠原病・感染症 | 脳卒中・関節痛 |

---

## 拡張のしかた（Sonnet向け）

1. **疾患・検査を足す** → 該当する `src/data/systems/<科>.js` に追記
2. **新しい科を足す** → `systems/<新科>.js` を作り、`systems/_index.js` の `MODULES` に足す
3. **必ず `node validate.mjs`** で参照整合性・ID重複を確認

詳細は `docs/SCHEMA.md`（モデルの考え方）と `docs/ADD_DISEASE.md`（手順）。

---

## 旧アプリ機能の再統合ポイント（今回は意図的に外した）

単体で動く軽い教材にするため、旧アプリの以下は同梱していない。将来つなぐ場合の窓口だけ記す。

- **KV/Worker マスターデータ**：`data/index.js` の `RAW`/`ATLAS` を、KVから読んだ
  データで差し替えられるようにしてある（`buildIndex()` に同形の配列を渡すだけ）。
- **AI自動入力（OCR/Groq/Gemini）**：入力モードの `values`/`findingsOn` を埋める
  外部ソースとして後付け可能。
- **admin編集**：`data/*.js` がそのまま編集対象スキーマ。KV化する際は同じ形を保つ。

いずれも `schema.js` の型（SCHEMA_VERSION=2）に合わせれば接続できる。
