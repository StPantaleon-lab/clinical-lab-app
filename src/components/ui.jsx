// src/components/ui.jsx
// 共有プレゼンテーション部品（レイヤーバッジ・凡例・チップなど）
import React from 'react';
import { LAYER_META, MODALITY } from '../model/schema.js';

// レイヤーバッジ（凡例色の核）
export function LayerBadge({ layer, showLabel = false }) {
  const m = LAYER_META[layer] || LAYER_META[2];
  return (
    <span className={`lb lb--${m.id}`} title={m.label}>
      <span className="dot" />
      {showLabel ? m.label : `L${m.id}・${m.short}`}
    </span>
  );
}

// レイヤー凡例バー
export function LayerLegend() {
  return (
    <div className="legend">
      {[1, 2, 3].map((n) => {
        const m = LAYER_META[n];
        return (
          <span className="rung" key={n}>
            <span className="swatch" style={{ background: m.color }} />
            <b>L{n}</b> {m.label}
          </span>
        );
      })}
    </div>
  );
}

// モダリティアイコン＋名称
export function ModalityTag({ id }) {
  const m = Object.values(MODALITY).find((x) => x.id === id);
  if (!m) return null;
  return <span className="chip"><span className="modal-ic">{m.icon}</span>{m.label}</span>;
}

// 所見チップ（状態: on / contra / 通常）
export function FindingChip({ label, state, onClick, title }) {
  const cls = state === 'met' ? 'chip on' : state === 'contra' ? 'chip contra' : 'chip';
  return (
    <span className={`${cls}${onClick ? ' clickable' : ''}`} onClick={onClick} title={title}>
      {label}
    </span>
  );
}

export function BackLink({ onClick, children }) {
  return <button className="backlink" onClick={onClick}>← {children}</button>;
}

// 機序ボックス
export function Mechanism({ children, label = '機序' }) {
  if (!children) return null;
  return <div className="mech"><b>{label}：</b>{children}</div>;
}

// ─────────────────────────────────────────────────────────────
//  検索・絞り込み（データ規模が大きくなったv2で追加）
// ─────────────────────────────────────────────────────────────

/** 全角/半角・大小文字を無視した部分一致 */
export function matches(text, q) {
  if (!q) return true;
  const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, '');
  return norm(text).includes(norm(q));
}

/** 検索ボックス＋診療科タブ。listビューの共通ヘッダ。 */
export function FilterBar({ query, setQuery, placeholder, systems, system, setSystem, count }) {
  return (
    <div className="filterbar">
      <input
        className="searchbox"
        type="search"
        value={query}
        placeholder={placeholder || '名前・略号で検索'}
        onChange={(e) => setQuery(e.target.value)}
      />
      {systems && systems.length > 1 && (
        <div className="row-wrap" style={{ gap: 6 }}>
          <button className={`togglebtn${system === 'all' ? ' on' : ''}`} onClick={() => setSystem('all')}>
            すべて
          </button>
          {systems.map((s) => (
            <button key={s} className={`togglebtn${system === s ? ' on' : ''}`} onClick={() => setSystem(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      {count != null && <span className="small muted" style={{ marginLeft: 'auto' }}>{count} 件</span>}
    </div>
  );
}

/** 空状態 */
export function Empty({ children }) {
  return <p className="small muted" style={{ padding: '18px 2px' }}>{children}</p>;
}
