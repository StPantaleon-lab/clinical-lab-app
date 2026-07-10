// src/components/ReferenceTable.jsx
// ═══════════════════════════════════════════════════════════════════════
//  正常範囲 ― 数値検査の基準値（referenceRanges.js を素直に表示）
// ═══════════════════════════════════════════════════════════════════════
import React, { useState } from 'react';

export default function ReferenceTable({ atlas }) {
  const { REF, GROUP_ORDER } = atlas;
  const [q, setQ] = useState('');

  const groups = GROUP_ORDER.map((g) => ({
    group: g,
    items: Object.entries(REF)
      .filter(([, r]) => r.group === g)
      .filter(([key, r]) =>
        !q || key.toLowerCase().includes(q.toLowerCase()) ||
        r.label.includes(q) || (r.abbr || '').toLowerCase().includes(q.toLowerCase())),
  })).filter((g) => g.items.length);

  const range = (r) => {
    if (r.min != null && r.max != null) return `${r.min} – ${r.max}`;
    if (r.maleMin != null) return `♂ ${r.maleMin}–${r.maleMax} ／ ♀ ${r.femaleMin}–${r.femaleMax}`;
    if (r.max != null) return `≤ ${r.max}`;
    if (r.min != null) return `≥ ${r.min}`;
    return '—';
  };

  return (
    <div>
      <p className="h-eyebrow">正常範囲</p>
      <h2 className="h-title">検査基準値</h2>
      <p className="lead">数値検査の基準値。入力モードの正常/異常判定はこの範囲に基づきます。</p>

      <div className="field" style={{ maxWidth: 280, marginBottom: 16 }}>
        <label>検索（名称・略号）</label>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="例 ALT, クレアチニン" />
      </div>

      {groups.map(({ group, items }) => (
        <div key={group} className="card pad" style={{ marginBottom: 14 }}>
          <p className="h-eyebrow">{group}</p>
          <table className="ref">
            <thead>
              <tr><th>検査</th><th>略号</th><th>基準範囲</th><th>単位</th></tr>
            </thead>
            <tbody>
              {items.map(([key, r]) => (
                <tr key={key}>
                  <td>{r.label}</td>
                  <td className="muted">{r.abbr}</td>
                  <td className="num">{range(r)}</td>
                  <td className="muted small">{r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
