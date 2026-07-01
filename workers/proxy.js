/**
 * Cloudflare Worker: 認証 + Groq API プロキシ
 *
 * 環境変数（Cloudflare Dashboard > Workers > Settings > Variables）:
 *   APP_PASSWORD : 合言葉（例: "sumodojo2025"）
 *   GROQ_API_KEY : Groq APIキー
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const ALLOWED_ORIGIN_PATTERN = /^https:\/\/.*\.pages\.dev$|^http:\/\/localhost:\d+$/;

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGIN_PATTERN.test(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-App-Password",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    // プリフライト
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // ── 認証チェック ──────────────────────────────────
    const password = request.headers.get("X-App-Password");
    if (!password || password !== env.APP_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    // ── リクエストボディを取得 ────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    // ── Groq API へ転送 ───────────────────────────────
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
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(origin),
      },
    });
  },
};
