// src/App.jsx
// ═══════════════════════════════════════════════════════════════════════
//  アプリの外枠 ― タブ切替と、ビュー間の相互ナビゲーション
// ═══════════════════════════════════════════════════════════════════════
//  ・鑑別マップ / 検査から見る / 疾患から見る / 検査値入力 / 正常範囲
//  ・どのビューからでも「検査を見る」「疾患を見る」「そのマップを開く」で
//    別ビューへ飛べる（focus を渡して初期表示する）。
import React, { useState, useCallback } from 'react';
import { ATLAS, ATLAS_STATS } from './data/index.js';
import DifferentialMap from './components/DifferentialMap.jsx';
import TestView from './components/TestView.jsx';
import DiseaseView from './components/DiseaseView.jsx';
import InputMode from './components/InputMode.jsx';
import ReferenceTable from './components/ReferenceTable.jsx';

const TABS = [
  { id: 'map',       label: '🗺 鑑別マップ' },
  { id: 'tests',     label: '🔎 検査から見る' },
  { id: 'diseases',  label: '🫀 疾患から見る' },
  { id: 'input',     label: '⌨ 検査値入力' },
  { id: 'reference', label: '📊 正常範囲' },
];

export default function App() {
  const [tab, setTab] = useState('map');
  // 各ビューへ初期表示IDを渡すための focus。切替のたびに key を変えて確実に反映。
  const [focus, setFocus] = useState({ nonce: 0 });

  const goTest = useCallback((id) => {
    setFocus((f) => ({ ...f, tab: 'tests', testId: id, nonce: f.nonce + 1 }));
    setTab('tests');
  }, []);
  const goDisease = useCallback((id) => {
    setFocus((f) => ({ ...f, tab: 'diseases', diseaseId: id, nonce: f.nonce + 1 }));
    setTab('diseases');
  }, []);
  const goPathway = useCallback((entryId) => {
    setFocus((f) => ({ ...f, tab: 'map', entryId, nonce: f.nonce + 1 }));
    setTab('map');
  }, []);

  const onTab = (id) => setTab(id);

  return (
    <div className="app">
      <header className="masthead">
        <div className="container">
          <div className="logo">
            <span className="mark">臨床鑑別アトラス</span>
            <span className="sub">Differential Atlas</span>
          </div>
          <nav className="tabs">
            {TABS.map((t) => (
              <button key={t.id} className={`tab${tab === t.id ? ' active' : ''}`} onClick={() => onTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          {tab === 'map' && (
            <DifferentialMap
              key={'map' + focus.nonce}
              atlas={ATLAS}
              initialEntryId={focus.tab === 'map' ? focus.entryId : null}
              onSelectDisease={goDisease}
              onSelectTest={goTest}
            />
          )}
          {tab === 'tests' && (
            <TestView
              key={'tests' + focus.nonce}
              atlas={ATLAS}
              initialId={focus.tab === 'tests' ? focus.testId : null}
              onSelectDisease={goDisease}
              onOpenPathway={goPathway}
            />
          )}
          {tab === 'diseases' && (
            <DiseaseView
              key={'diseases' + focus.nonce}
              atlas={ATLAS}
              initialId={focus.tab === 'diseases' ? focus.diseaseId : null}
              onSelectTest={goTest}
              onOpenPathway={goPathway}
            />
          )}
          {tab === 'input' && (
            <InputMode atlas={ATLAS} onSelectDisease={goDisease} onSelectTest={goTest} />
          )}
          {tab === 'reference' && <ReferenceTable atlas={ATLAS} />}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <span>臨床鑑別アトラス v2 — 診断ではなく「鑑別全体のどこにいるか」を理解するためのツール</span>
          <span className="muted">
            {ATLAS_STATS.systems}系統／検査 {ATLAS_STATS.tests}・所見 {ATLAS_STATS.findings}・疾患 {ATLAS_STATS.diseases}・
            鑑別路 {ATLAS_STATS.pathways}・入口 {ATLAS_STATS.presentations}・算出 {ATLAS_STATS.derived}・パターン {ATLAS_STATS.patterns}
          </span>
        </div>
      </footer>
    </div>
  );
}
