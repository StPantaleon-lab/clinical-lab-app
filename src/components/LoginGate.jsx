// src/components/LoginGate.jsx
// ═══════════════════════════════════════════════════════════════════════
//  ログイン ― 一般ユーザー（合言葉）／管理者（管理合言葉）
// ═══════════════════════════════════════════════════════════════════════
//  ログインは「KV連携・自動読み取り・管理」を使うときだけ必要。
//  ログインしなくても、静的データでアプリの全ビューは動く。
import React, { useState } from 'react';
import { login, hasWorker } from '../lib/masterData.js';

export default function LoginGate({ onClose, onLoggedIn }) {
  const [role, setRole] = useState('admin');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setErr(''); setBusy(true);
    try {
      const r = await login(pw, role);
      onLoggedIn?.(r);
      onClose?.();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__body card pad" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>ログイン</h3>
          <button className="togglebtn" onClick={onClose}>閉じる</button>
        </div>

        {!hasWorker() ? (
          <p className="small warn" style={{ marginTop: 10 }}>
            Worker URL（VITE_WORKER_URL）が未設定です。KV連携・自動読み取り・管理機能を使うには、
            <code>.env.local</code> に Worker のURLを設定してください。静的データだけなら未ログインで利用できます。
          </p>
        ) : (
          <>
            <div className="row-wrap" style={{ margin: '12px 0' }}>
              <button className={`togglebtn${role === 'user' ? ' on' : ''}`} onClick={() => setRole('user')}>一般ユーザー</button>
              <button className={`togglebtn${role === 'admin' ? ' on' : ''}`} onClick={() => setRole('admin')}>管理者</button>
            </div>
            <div className="field">
              <label>{role === 'admin' ? '管理者の合言葉' : '合言葉'}</label>
              <input type="password" value={pw} autoFocus
                     onChange={(e) => setPw(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && submit()} />
            </div>
            {err && <p className="small err">{err}</p>}
            <div className="row-wrap" style={{ marginTop: 12 }}>
              <button className="btn-primary" onClick={submit} disabled={busy || !pw}>
                {busy ? '確認中…' : 'ログイン'}
              </button>
            </div>
            <p className="small muted" style={{ marginTop: 10 }}>
              管理者でログインすると、疾患・検査・所見の追加/編集ができます。
            </p>
          </>
        )}
      </div>
    </div>
  );
}
