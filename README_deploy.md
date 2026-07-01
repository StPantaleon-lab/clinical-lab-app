# デプロイ手順

## 構成

```
ブラウザ
  ↓ X-App-Password ヘッダーを添付
Cloudflare Pages（静的React）
  ↓ /api/* → VITE_WORKER_URL
Cloudflare Worker（認証 + Groqプロキシ）
  ↓ 認証OK → APIキーを付け替え
Groq API

※ ローカル起動中はOllama（localhost:11434）を優先使用
```

---

## Step 1: Groq APIキーを取得

1. https://console.groq.com にアクセス
2. サインアップ（無料）
3. API Keys → Create API Key
4. キーをメモしておく

---

## Step 2: Cloudflare Worker をデプロイ

```bash
# Wrangler CLIをインストール
npm install -g wrangler

# Cloudflareにログイン
wrangler login

# Workerをデプロイ
wrangler deploy

# 環境変数を設定（ダッシュボードのUIでも可）
wrangler secret put APP_PASSWORD
# → 合言葉を入力（例: sumodojo2025）

wrangler secret put GROQ_API_KEY
# → GroqのAPIキーを入力

# デプロイされたWorkerのURLをメモ
# 例: https://clinical-lab-proxy.yourname.workers.dev
```

---

## Step 3: Cloudflare Pages にデプロイ

### GitHubと連携する場合（推奨・自動デプロイ）

1. GitHubにリポジトリをpush
2. https://pages.cloudflare.com にアクセス
3. Create a project → Connect to Git → リポジトリを選択
4. Build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Environment variables（Pagesの設定 → Environment variables）に追加:
   ```
   VITE_WORKER_URL = https://clinical-lab-proxy.yourname.workers.dev
   VITE_OLLAMA_MODEL = llama3.2
   ```
6. Deploy

### 手動デプロイの場合

```bash
# ビルド
cp .env.example .env.local
# .env.local の VITE_WORKER_URL を本番WorkerのURLに書き換えてから↓
npm run build

# Cloudflare Pagesにアップロード
wrangler pages deploy dist --project-name=clinical-lab-app
```

---

## Step 4: 動作確認

デプロイ後のURL（例: `https://clinical-lab-app.pages.dev`）にアクセスし、
設定した合言葉でログインできることを確認。

---

## ローカル開発

```bash
# .env.localを作成
cp .env.example .env.local

# Workerをローカル起動（別ターミナル）
wrangler dev
# → http://localhost:8787 で起動

# Ollamaを起動（別ターミナル）
ollama serve

# アプリを起動
npm run dev
# → http://localhost:5173
```

ローカル（localhost）ではログイン画面をスキップします。

---

## Cloudflare Tunnel（後から追加する場合）

ローカルOllamaをWebからも使いたい場合:

```bash
# cloudflaredをインストール
brew install cloudflare/cloudflare/cloudflared  # macOS
# or: curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared

# トンネルを作成（初回のみ）
cloudflared tunnel create clinical-lab-ollama

# 設定ファイル ~/.cloudflared/config.yml を作成:
# tunnel: <tunnel-id>
# credentials-file: /home/you/.cloudflared/<tunnel-id>.json
# ingress:
#   - hostname: ollama.yourdomain.com
#     service: http://localhost:11434
#   - service: http_status:404

# トンネルを起動
cloudflared tunnel run clinical-lab-ollama
```

その後 `VITE_OLLAMA_URL=https://ollama.yourdomain.com` を追加すれば
`parseLabValues.js` のOLLAMA_URLをこのURLに向けられます。

---

## 費用

| サービス | 費用 |
|---------|------|
| Cloudflare Pages | 無料 |
| Cloudflare Workers | 無料（10万req/日まで） |
| Groq API | 無料枠あり（モデルにより異なる） |
| Cloudflare Tunnel | 無料 |
