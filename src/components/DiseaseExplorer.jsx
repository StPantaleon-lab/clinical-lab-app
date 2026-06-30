// src/components/DiseaseExplorer.jsx
// 疾患リストから選ぶと典型的な検査異常パターンが表示される（逆引きモード）

import { useState, useMemo } from 'react';
import { DISEASES, CATEGORIES } from '../data/diseases.js';
import { REF } from '../data/referenceRanges.js';

const CAT_COLOR = {
  '貧血':        '#dbeafe',
  '出血性疾患':  '#fee2e2',
  '肝・胆・膵疾患': '#fef9c3',
  '腎疾患':      '#e0f2fe',
  '代謝疾患':    '#f0fdf4',
  '内分泌疾患':  '#fdf4ff',
  '自己免疫疾患':'#fff7ed',
  '感染・炎症':  '#fef2f2',
  '心疾患':      '#ffe4e6',
  '血液腫瘍':    '#f5f3ff',
  '腫瘍':        '#fdf2f8',
};

const DIR_STYLE = {
  high:     { bg: '#fee2e2', text: '#991b1b', label: '↑ 高値', border: '#fca5a5' },
  low:      { bg: '#dbeafe', text: '#1e40af', label: '↓ 低値', border: '#93c5fd' },
  positive: { bg: '#fef9c3', text: '#713f12', label: '陽性',   border: '#fde047' },
  any:      { bg: '#f1f5f9', text: '#475569', label: '異常',   border: '#cbd5e1' },
};

// 検査項目数が少ない順にソート（確定しやすい順）
function sortByKeyCount(diseases) {
  return [...diseases].sort((a, b) => a.requiredKeys.length - b.requiredKeys.length);
}

export default function DiseaseExplorer({ onApplyTypical }) {
  const [sortMode, setSortMode] = useState('category'); // 'category' | 'keycount'
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return DISEASES;
    const q = search.toLowerCase();
    return DISEASES.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.note.toLowerCase().includes(q)
    );
  }, [search]);

  const sorted = useMemo(() => {
    if (sortMode === 'keycount') return sortByKeyCount(filtered);
    return filtered;
  }, [filtered, sortMode]);

  // カテゴリ別グループ化
  const byCategory = useMemo(() => {
    const map = {};
    for (const cat of CATEGORIES) {
      const list = sorted.filter(d => d.category === cat);
      if (list.length > 0) map[cat] = list;
    }
    return map;
  }, [sorted]);

  // keycount順はフラットリスト
  const flatList = sortMode === 'keycount' ? sorted : null;

  const sel = selected ? DISEASES.find(d => d.id === selected) : null;

  // 典型値を入力フォームに反映
  const applyTypical = () => {
    if (!sel) return;
    const typical = {};
    for (const { key, direction } of sel.requiredKeys) {
      const ref = REF[key];
      if (!ref) continue;
      // 典型値として正常範囲の外側の代表値を入れる
      if (direction === 'high') {
        const hi = ref.max ?? ref.maleMax ?? ref.femaleMax;
        if (hi !== undefined && hi !== 9999) typical[key] = String((hi * 1.5).toFixed(1));
      } else if (direction === 'low') {
        const lo = ref.min ?? ref.maleMin ?? ref.femaleMin;
        if (lo !== undefined && lo > 0) typical[key] = String((lo * 0.6).toFixed(1));
      }
    }
    onApplyTypical(typical);
  };

  return (
    <div style={{ display: 'flex', gap: 14, minHeight: 500 }}>
      {/* ── 左：疾患リスト ── */}
      <div style={{ width: 280, flexShrink: 0, background: 'white', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* 検索 */}
        <div style={{ padding: '12px 12px 8px' }}>
          <input
            type="text"
            placeholder="疾患名・カテゴリで絞り込み..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
          />
        </div>
        {/* ソート切り替え */}
        <div style={{ display: 'flex', gap: 4, padding: '0 12px 10px' }}>
          {[{ id: 'category', label: '器官系別' }, { id: 'keycount', label: '検査項目数順' }].map(s => (
            <button key={s.id} onClick={() => setSortMode(s.id)} style={{ flex: 1, padding: '4px 0', borderRadius: 6, border: `1.5px solid ${sortMode === s.id ? '#3b82f6' : '#e2e8f0'}`, background: sortMode === s.id ? '#eff6ff' : 'white', color: sortMode === s.id ? '#1d4ed8' : '#64748b', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* リスト */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sortMode === 'category' ? (
            Object.entries(byCategory).map(([cat, diseases]) => (
              <div key={cat}>
                <div style={{ padding: '6px 12px', background: CAT_COLOR[cat] || '#f1f5f9', fontSize: 11, fontWeight: 700, color: '#475569', position: 'sticky', top: 0 }}>
                  {cat}
                </div>
                {diseases.map(d => (
                  <button key={d.id} onClick={() => setSelected(d.id)} style={{ width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none', background: selected === d.id ? '#eff6ff' : 'white', color: selected === d.id ? '#1d4ed8' : '#334155', fontSize: 13, fontWeight: selected === d.id ? 700 : 400, cursor: 'pointer', borderLeft: selected === d.id ? '3px solid #3b82f6' : '3px solid transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{d.name}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 4 }}>{d.requiredKeys.length}項目</span>
                  </button>
                ))}
              </div>
            ))
          ) : (
            flatList.map((d, i) => (
              <button key={d.id} onClick={() => setSelected(d.id)} style={{ width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none', borderBottom: '1px solid #f1f5f9', background: selected === d.id ? '#eff6ff' : 'white', color: selected === d.id ? '#1d4ed8' : '#334155', fontSize: 13, fontWeight: selected === d.id ? 700 : 400, cursor: 'pointer', borderLeft: selected === d.id ? '3px solid #3b82f6' : '3px solid transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 10, color: '#94a3b8', marginRight: 6 }}>#{i+1}</span>
                  {d.name}
                  <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 6, display: 'block' }}>{d.category}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', minWidth: 30, textAlign: 'right' }}>{d.requiredKeys.length}項目</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── 右：疾患詳細 ── */}
      <div style={{ flex: 1 }}>
        {!sel ? (
          <div style={{ background: 'white', borderRadius: 14, padding: '48px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👈</div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>左のリストから疾患を選んでください</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>典型的な検査異常パターンが表示されます</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 14, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            {/* ヘッダー */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 12, background: CAT_COLOR[sel.category] || '#f1f5f9', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                {sel.category}
              </div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{sel.name}</h2>
            </div>

            {/* 典型的な検査異常 */}
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                典型的な検査異常パターン
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: '#94a3b8' }}>
                  （{sel.requiredKeys.length}項目）
                </span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                {sel.requiredKeys.map(({ key, direction }) => {
                  const ref = REF[key];
                  const ds = DIR_STYLE[direction] || DIR_STYLE.any;
                  const lo = ref?.min ?? ref?.maleMin;
                  const hi = ref?.max ?? ref?.maleMax;
                  return (
                    <div key={key} style={{ padding: '10px 12px', borderRadius: 10, background: ds.bg, border: `1.5px solid ${ds.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{ref?.label || key}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: ds.text, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.6)' }}>{ds.label}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {ref?.abbr} {ref?.unit && `(${ref.unit})`}
                      </div>
                      {lo !== undefined && hi !== undefined && (
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                          基準: {lo} – {hi === 9999 ? '—' : hi}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 症候 */}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>随伴症候</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {sel.symptoms.map(s => (
                  <span key={s.key} style={{ padding: '4px 12px', borderRadius: 20, background: '#f1f5f9', color: '#475569', fontSize: 12, border: '1px solid #e2e8f0' }}>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* 臨床メモ */}
            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 10, borderLeft: '3px solid #3b82f6', marginBottom: sel.ruleOutNote ? 10 : 0 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.7 }}>💬 {sel.note}</p>
            </div>
            {sel.ruleOutNote && (
              <div style={{ padding: '10px 14px', background: '#fff7ed', borderRadius: 10, borderLeft: '3px solid #f59e0b' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>🔬 <strong>追加検査:</strong> {sel.ruleOutNote}</p>
              </div>
            )}

            {/* 典型値を入力に反映ボタン */}
            <button
              onClick={applyTypical}
              style={{ marginTop: 16, padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', width: '100%' }}
            >
              📋 この疾患の典型異常値を入力フォームに反映する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
