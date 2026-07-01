// src/components/LabInputPanel.jsx
import { REF, GROUP_ORDER, evalVal } from '../data/referenceRanges.js';
import { LAB_INFO } from '../data/labInfo.js';

const EV_STYLE = {
  low:    { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', badge: '↓低値' },
  high:   { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', badge: '↑高値' },
  normal: { bg: '#f0fdf4', text: '#166534', border: '#86efac', badge: '正常' },
};

function LabInput({ refKey, values, sex, onChange, onShowDetail }) {
  const ref = REF[refKey];
  const info = LAB_INFO[refKey];
  if (!ref) return null;
  const val = values[refKey] ?? '';
  const ev = val !== '' ? evalVal(refKey, val, sex) : null;
  const st = ev ? EV_STYLE[ev] : null;
  const lo = ref.min ?? (sex === 'female' ? ref.femaleMin : ref.maleMin);
  const hi = ref.max ?? (sex === 'female' ? ref.femaleMax : ref.maleMax);

  return (
    <div style={{ border: `2px solid ${st ? st.border : '#e2e8f0'}`, borderRadius: 10, padding: '9px 11px', background: st ? st.bg : 'white', transition: 'border-color 0.15s, background 0.15s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>
            {ref.label}
            <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 4 }}>({ref.abbr})</span>
          </span>
          {info && (
            <button
              onClick={() => onShowDetail?.(refKey)}
              style={{ marginLeft: 6, fontSize: 9, padding: '1px 5px', borderRadius: 4, border: '1px solid #c4b5fd', background: '#f5f3ff', color: '#7c3aed', cursor: 'pointer', fontWeight: 700 }}
              title="詳細を見る"
            >
              詳細
            </button>
          )}
        </div>
        {ev && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.7)', color: st.text }}>{st.badge}</span>
        )}
      </div>
      {/* 簡易説明 */}
      {info && (
        <p style={{ margin: '0 0 5px 0', fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>{info.brief}</p>
      )}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <input
          type="number" step="any" value={val} onChange={e => onChange(refKey, e.target.value)}
          placeholder="—"
          style={{ flex: 1, padding: '5px 7px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, outline: 'none', background: 'white', minWidth: 0 }}
        />
        <span style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>{ref.unit}</span>
      </div>
      {lo !== undefined && hi !== undefined && (
        <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 3 }}>基準: {lo} – {hi === 9999 ? '—' : hi}</div>
      )}
    </div>
  );
}

export default function LabInputPanel({ values, sex, setSex, onChange, onClear, onShowLabDetail }) {
  const groups = GROUP_ORDER.map(g => ({
    group: g,
    keys: Object.entries(REF).filter(([, r]) => r.group === g).map(([k]) => k),
  })).filter(g => g.keys.length > 0);

  const entered = Object.keys(values).filter(k => values[k] !== '' && values[k] !== null && values[k] !== undefined);
  const abnormal = entered.filter(k => { const ev = evalVal(k, values[k], sex); return ev === 'low' || ev === 'high'; });

  return (
    <div>
      {/* 性別 & ステータス */}
      <div style={{ background: 'white', borderRadius: 12, padding: '12px 16px', marginBottom: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>性別</span>
          {['male', 'female'].map(s => (
            <button key={s} onClick={() => setSex(s)} style={{ padding: '4px 14px', borderRadius: 20, border: `2px solid ${sex === s ? '#3b82f6' : '#e2e8f0'}`, background: sex === s ? '#eff6ff' : 'white', color: sex === s ? '#1d4ed8' : '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              {s === 'male' ? '♂ 男性' : '♀ 女性'}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          入力済み <strong style={{ color: '#0f172a' }}>{entered.length}</strong> 件　|　異常値 <strong style={{ color: abnormal.length > 0 ? '#dc2626' : '#16a34a' }}>{abnormal.length}</strong> 件
        </div>
        {entered.length > 0 && (
          <button onClick={onClear} style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fff5f5', color: '#dc2626', fontSize: 11, cursor: 'pointer' }}>全クリア</button>
        )}
      </div>

      {groups.map(({ group, keys }) => (
        <details key={group} open style={{ marginBottom: 10 }}>
          <summary style={{ background: 'white', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#374151', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', userSelect: 'none' }}>
            <span>{group} <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>{keys.length}項目</span></span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>▼</span>
          </summary>
          <div style={{ background: 'white', borderRadius: '0 0 10px 10px', padding: '12px 12px 14px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8, marginTop: 2 }}>
            {keys.map(k => (
              <LabInput key={k} refKey={k} values={values} sex={sex} onChange={onChange} onShowDetail={onShowLabDetail} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
