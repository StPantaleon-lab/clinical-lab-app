// src/App.jsx
import { useState, useCallback } from 'react';
import AutoInput from './components/AutoInput.jsx';
import LabInputPanel from './components/LabInputPanel.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import ReferenceTable from './components/ReferenceTable.jsx';
import DiseaseExplorer from './components/DiseaseExplorer.jsx';
import LabDetail from './components/LabDetail.jsx';
import { evalVal, REF } from './data/referenceRanges.js';
import { DISEASES } from './data/diseases.js';
import { analyzeCoverage } from './lib/coverage.js';

const TABS = [
  { id: 'input',   label: '📋 検査値入力' },
  { id: 'result',  label: '🔍 判定結果' },
  { id: 'explore', label: '🏥 疾患から探す' },
  { id: 'labinfo', label: '📚 検査値詳細' },
  { id: 'ref',     label: '📖 正常範囲' },
];

export default function App() {
  const [tab, setTab] = useState('input');
  const [sex, setSex] = useState('male');
  const [values, setValues] = useState({});
  const [symptoms, setSymptoms] = useState({});
  const [selectedLabKey, setSelectedLabKey] = useState(null);

  const setVal = useCallback((key, val) => setValues(prev => ({ ...prev, [key]: val })), []);
  const toggleSymptom = useCallback((key) => setSymptoms(prev => ({ ...prev, [key]: !prev[key] })), []);
  const clearAll = useCallback(() => { setValues({}); setSymptoms({}); }, []);

  const applyFromAI = useCallback((newVals, detectedSex) => {
    setValues(prev => ({ ...prev, ...newVals }));
    if (detectedSex) setSex(detectedSex);
    setTab('result');
  }, []);

  const applyTypical = useCallback((typical) => {
    setValues(typical);
    setTab('input');
  }, []);

  const showLabDetail = useCallback((key) => {
    setSelectedLabKey(key);
    setTab('labinfo');
  }, []);

  // バッジ計算
  const entered = Object.keys(values).filter(k => values[k] !== '' && values[k] !== null && values[k] !== undefined);
  const ev = {};
  for (const k of Object.keys(REF)) ev[k] = evalVal(k, values[k], sex);
  const matchedCount = DISEASES.filter(d => d.requiredKeys.every(r => entered.includes(r.key)) && d.conditionFn(values, ev, sex)).length;
  const { partial } = analyzeCoverage(values, sex);

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', color: 'white', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0 0' }}>
            <div style={{ background: '#3b82f6', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔬</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>臨床検査値 疾患推定ツール</h1>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>正常範囲に基づく古典的判定 ／ ベストマッチ ／ 疾患逆引き ／ 検査値詳細</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 2, marginTop: 12, flexWrap: 'wrap' }}>
            {TABS.map(t => {
              const badge = t.id === 'result' && matchedCount > 0 ? matchedCount : null;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '8px 8px 0 0', padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', position: 'relative' }}>
                  {t.label}
                  {badge && <span style={{ position: 'absolute', top: 4, right: 4, background: '#dc2626', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px 40px' }}>
        {entered.length > 0 && (
          <div style={{ background: 'white', borderRadius: 10, padding: '9px 14px', marginBottom: 12, fontSize: 13, color: '#64748b', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <span>入力済み: <strong style={{ color: '#0f172a' }}>{entered.length}</strong>項目</span>
            <span>確定陽性: <strong style={{ color: matchedCount > 0 ? '#dc2626' : '#16a34a' }}>{matchedCount}</strong>件</span>
            <span>あと少し: <strong style={{ color: '#d97706' }}>{partial.length}</strong>件</span>
            {tab !== 'result' && matchedCount > 0 && (
              <button onClick={() => setTab('result')} style={{ marginLeft: 'auto', padding: '4px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                🔍 判定結果を見る →
              </button>
            )}
          </div>
        )}

        {tab === 'input' && (
          <>
            <AutoInput onApply={applyFromAI} />
            <LabInputPanel values={values} sex={sex} setSex={setSex} onChange={setVal} onClear={clearAll} onShowLabDetail={showLabDetail} />
          </>
        )}
        {tab === 'result' && (
          <ResultPanel values={values} sex={sex} symptoms={symptoms} toggleSymptom={toggleSymptom} />
        )}
        {tab === 'explore' && (
          <DiseaseExplorer onApplyTypical={applyTypical} onShowLabDetail={showLabDetail} />
        )}
        {tab === 'labinfo' && (
          <LabDetail selectedKey={selectedLabKey} onSelect={setSelectedLabKey} />
        )}
        {tab === 'ref' && <ReferenceTable />}
      </main>
    </div>
  );
}
