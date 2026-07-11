// src/lib/ocrImage.js
// Tesseract.jsを使ったブラウザ内OCR
// CDNから動的にロードするため、インストール不要

const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";

let tesseractLoaded = false;

async function loadTesseract() {
  if (tesseractLoaded || window.Tesseract) { tesseractLoaded = true; return; }
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TESSERACT_CDN;
    script.onload = () => { tesseractLoaded = true; resolve(); };
    script.onerror = () => reject(new Error("Tesseract.jsの読み込みに失敗しました"));
    document.head.appendChild(script);
  });
}

/**
 * 画像からテキストを抽出する
 * Tesseract.js v5ではlangPathを指定しなければ
 * https://tessdata.projectnaptha.com/4.0.0 から自動ダウンロードされる
 */
export async function ocrImage(base64, mimeType, onProgress) {
  await loadTesseract();

  const dataUrl = `data:${mimeType};base64,${base64}`;
  const { createWorker } = window.Tesseract;

  // jpn（日本語）+ eng（英語）を指定
  // 初回は各言語データ（jpn: 約13MB、eng: 約10MB）をダウンロード
  const worker = await createWorker(["jpn", "eng"], 1, {
    logger: onProgress
      ? (m) => {
          if (m.status === "recognizing text") {
            onProgress(Math.round(m.progress * 100));
          } else if (m.status === "loading language traineddata") {
            onProgress(0);
          }
        }
      : undefined,
  });

  try {
    // PSM 6: 均一なテキストブロックとして処理（表・リスト向き）
    await worker.setParameters({ tessedit_pageseg_mode: "6" });
    const { data } = await worker.recognize(dataUrl);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

/**
 * OCRテキストを検査値が読み取りやすい形に整形する
 */
export function normalizeOcrText(raw) {
  return raw
    .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/．/g, ".").replace(/，/g, ",")
    .replace(/\t+/g, "\n")
    .replace(/  +/g, " ")
    .split("\n").map(l => l.trim()).filter(Boolean).join("\n");
}
