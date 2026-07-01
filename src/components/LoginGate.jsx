// src/components/LoginGate.jsx
import { useState } from 'react';

const STORAGE_KEY = "clinical_lab_pw";

export function getStoredPassword() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

export default function LoginGate({ onLogin }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(false);

    const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";

    // Workerが設定されている場合は認証確認リクエストを送る
    if (WORKER_URL) {
      try {
        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-App-Password": input.trim(),
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 1,
          }),
        });
        if (res.status === 401) {
          setError(true);
          setLoading(false);
          return;
        }
        // 200 or その他（Groq側のエラーでも認証は通った）
      } catch {
        // Workerに繋がらなければローカル開発と判断してスルー
      }
    }

    localStorage.setItem(STORAGE_KEY, input.trim());
    setLoading(false);
    onLogin(input.trim());
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    }}>
      <div style={{
        background: "white", borderRadius: 20, padding: "48px 40px",
        width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔬</div>
        <h1 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
          臨床検査値 疾患推定ツール
        </h1>
        <p style={{ margin: "0 0 32px", fontSize: 13, color: "#64748b" }}>
          合言葉を入力してください
        </p>

        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="合言葉"
          autoFocus
          style={{
            width: "100%", padding: "12px 14px",
            border: `2px solid ${error ? "#fca5a5" : "#e2e8f0"}`,
            borderRadius: 10, fontSize: 16, outline: "none",
            background: error ? "#fff5f5" : "white",
            textAlign: "center", letterSpacing: "0.15em",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
            合言葉が違います
          </p>
        )}

        <button
          onClick={attempt}
          disabled={loading || !input.trim()}
          style={{
            width: "100%", padding: "12px",
            background: loading ? "#94a3b8" : "#2563eb",
            color: "white", border: "none", borderRadius: 10,
            fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "確認中..." : "入る"}
        </button>

        <p style={{ margin: "20px 0 0", fontSize: 11, color: "#cbd5e1", lineHeight: 1.6 }}>
          ローカル環境（localhost）では<br />合言葉なしでも利用できます
        </p>
      </div>
    </div>
  );
}
