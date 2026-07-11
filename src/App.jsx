// src/App.jsx
// ═══════════════════════════════════════════════════════════════════════
//  アプリの外枠 ― タブ切替・ビュー間ナビ・ログイン・KVオーバーライドの反映
// ═══════════════════════════════════════════════════════════════════════
//  ・タブ順: 検査値入力（最初）→ 鑑別マップ → 検査 → 疾患 → 正常範囲 →（管理）
//  ・起動時にKVのオーバーライドを取得できれば、それを重ねた ATLAS に差し替える。
//    取得できない（未ログイン/未設定）場合は静的データの ATLAS をそのまま使う。
import React, { useState, useCallback, useEffect } from 'react';
import { ATLAS as STATIC_ATLAS, buildAtlas } from './data/index.js';
import { loadOverrides, getAdminPw, getPw, logout } from './lib/masterData.js';
import DifferentialMap from './components/DifferentialMap.jsx';
import TestView from './components/TestView.jsx';
import DiseaseView from './components/DiseaseView.jsx';
import InputMode from './components/InputMode.jsx';
import ReferenceTable from './components/ReferenceTable.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import LoginGate from './components/LoginGate.jsx';

const BASE_TABS = [
  { id: 'input',     label: '⌨ 検査値入力' },
  { id: 'map',       label: '🗺 鑑別マップ' },
  { id: 'tests',     label: '🔎 検査から見る' },
  { id: 'diseases',  label: '🫀 疾患から見る' },
  { id: 'reference', label: '📊 正常範囲' },
];

export default function App() {
  const [tab, setTab] = useState('input');
  const [focus, setFocus] = useState({ nonce: 0 });
  const [atlas, setAtlas] = useState(STATIC_ATLAS);
  const [isAdmin, setIsAdmin] = useState(!!getAdminPw());
  const [loggedIn, setLoggedIn] = useState(!!getAdminPw() || !!getPw());
  const [showLogin, setShowLogin] = useState(false);

  // KVオーバーライドを取得して ATLAS を差し替える
  const syncFromKV = useCallback(async () => {
    const ov = await loadOverrides();
    setAtlas(ov ? buildAtlas(ov) : STATIC_ATLAS);
  }, []);

  useEffect(() => { if (loggedIn) syncFromKV(); }, [loggedIn, syncFromKV]);

  const goTest = useCallback((id) => { setFocus((f) => ({ ...f, tab: 'tests', testId: id, nonce: f.nonce + 1 })); setTab('tests'); }, []);
  const goDisease = useCallback((id) => { setFocus((f) => ({ ...f, tab: 'diseases', diseaseId: id, nonce: f.nonce + 1 })); setTab('diseases'); }, []);
  const goPathway = useCallback((entryId) => { setFocus((f) => ({ ...f, tab: 'map', entryId, nonce: f.nonce + 1 })); setTab('map'); }, []);

  const TABS = isAdmin ? [...BASE_TABS, { id: 'admin', label: '🔧 管理' }] : BASE_TABS;
  const S = atlas.STATS;

  return (
    <div className="app">
      <header className="masthead">
        <div className="container">
          <div className="logo">
            <span className="mark">臨床鑑別アトラス</span>
            <span className="sub">Differential Atlas{S.source === 'kv' ? ' · KV連携中' : ''}</span>
          </div>
          <nav className="tabs">
            {TABS.map((t) => (
              <button key={t.id} className={`tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="authbar">
            {loggedIn ? (
              <button className="tab" onClick={() => {
                logout(); setLoggedIn(false); setIsAdmin(false); setAtlas(STATIC_ATLAS);
                if (tab === 'admin') setTab('input');
              }}>ログアウト</button>
            ) : (
              <button className="tab" onClick={() => setShowLogin(true)}>🔑 ログイン</button>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="container">
          {tab === 'input' && (
            <InputMode key={'input' + focus.nonce} atlas={atlas} onSelectDisease={goDisease} onSelectTest={goTest} />
          )}
          {tab === 'map' && (
            <DifferentialMap key={'map' + focus.nonce} atlas={atlas}
              initialEntryId={focus.tab === 'map' ? focus.entryId : null}
              onSelectDisease={goDisease} onSelectTest={goTest} />
          )}
          {tab === 'tests' && (
            <TestView key={'tests' + focus.nonce} atlas={atlas}
              initialId={focus.tab === 'tests' ? focus.testId : null}
              onSelectDisease={goDisease} onOpenPathway={goPathway} />
          )}
          {tab === 'diseases' && (
            <DiseaseView key={'diseases' + focus.nonce} atlas={atlas}
              initialId={focus.tab === 'diseases' ? focus.diseaseId : null}
              onSelectTest={goTest} onOpenPathway={goPathway} />
          )}
          {tab === 'reference' && <ReferenceTable atlas={atlas} />}
          {tab === 'admin' && isAdmin && <AdminPanel onDataChanged={syncFromKV} />}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <span>臨床鑑別アトラス v2 — 診断ではなく「鑑別全体のどこにいるか」を理解するためのツール</span>
          <span className="muted">
            {S.systems}系統／検査 {S.tests}・所見 {S.findings}・疾患 {S.diseases}・
            鑑別路 {S.pathways}・入口 {S.presentations}・算出 {S.derived}・パターン {S.patterns}
          </span>
        </div>
      </footer>

      {showLogin && (
        <LoginGate onClose={() => setShowLogin(false)}
          onLoggedIn={(r) => { setLoggedIn(true); setIsAdmin(r.admin); if (r.admin) setTab('admin'); }} />
      )}
    </div>
  );
}
