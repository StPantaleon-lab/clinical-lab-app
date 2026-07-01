/**
 * Cloudflare Worker: 認証 + Groq API プロキシ + KVフォーマット学習
 *
 * 環境変数:
 *   APP_PASSWORD : 合言葉
 *   GROQ_API_KEY : Groq APIキー
 * KV Binding:
 *   LAB_FORMATS  : フォーマット学習データ
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const ALLOWED_ORIGIN_PATTERN = /^https:\/\/.*\.pages\.dev$|^http:\/\/localhost:\d+$/;
const MAX_EXAMPLES = 10; // few-shotに使う最大例数

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGIN_PATTERN.test(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-App-Password",
  };
}

function unauthorized(origin) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // 認証
    const password = request.headers.get("X-App-Password");
    if (!password || password !== env.APP_PASSWORD) {
      return unauthorized(origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const action = body.action || "chat";

    // ── アクション: フォーマット例を保存 ──────────────────
    if (action === "save_example") {
      const { inputSnippet, parsedValues } = body;
      if (!inputSnippet || !parsedValues) {
        return new Response(JSON.stringify({ error: "Missing fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      // 既存の例を取得
      const existing = JSON.parse(await env.LAB_FORMATS.get("examples") || "[]");

      // 同じsnippetが既にあれば更新、なければ追加
      const idx = existing.findIndex(e => e.inputSnippet === inputSnippet);
      if (idx >= 0) {
        existing[idx].parsedValues = parsedValues;
      } else {
        existing.push({ inputSnippet, parsedValues, savedAt: Date.now() });
      }

      // 最新MAX_EXAMPLES件だけ保持
      const trimmed = existing.slice(-MAX_EXAMPLES);
      await env.LAB_FORMATS.put("examples", JSON.stringify(trimmed));

      return new Response(JSON.stringify({ ok: true, count: trimmed.length }), {
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    // ── アクション: 例一覧を取得 ──────────────────────────
    if (action === "get_examples") {
      const examples = JSON.parse(await env.LAB_FORMATS.get("examples") || "[]");
      return new Response(JSON.stringify({ examples }), {
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    // ── アクション: chat（Groqへ転送）────────────────────
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: body.model || "llama-3.3-70b-versatile",
        messages: body.messages,
        temperature: body.temperature ?? 0,
        max_tokens: body.max_tokens ?? 1000,
      }),
    });

    const data = await groqResponse.json();
    return new Response(JSON.stringify(data), {
      status: groqResponse.status,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  },
};
