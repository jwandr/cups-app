import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

/* ── load fonts as real link tags ── */
;[
  'https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
].forEach(href => {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const l = document.createElement('link')
    l.rel = 'stylesheet'; l.href = href
    document.head.appendChild(l)
  }
})

/* ─────────────────────────────────────────────────────────────────
   GLOBAL STYLES
   ───────────────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:        #0f1117;
      --ink-60:     #3d4257;
      --ink-40:     #7b8099;
      --ink-20:     #b8bccc;
      --ink-10:     #e4e6ef;
      --ink-05:     #f4f5f9;
      --white:      #ffffff;
      --teal:       #00b4a6;
      --teal-light: #e0f7f5;
      --teal-dark:  #007d72;
      --deepskyblue:#00bfff;
      --surface:    #f7f8fc;
      --card:       #ffffff;
      --border:     #eaecf4;
      --r-xs: 8px; --r-sm: 12px; --r-md: 16px;
      --r-lg: 20px; --r-xl: 28px; --r-2xl: 36px;
      --sh-xs: 0 1px 3px rgba(15,17,23,0.06), 0 1px 2px rgba(15,17,23,0.04);
      --sh-sm: 0 2px 8px rgba(15,17,23,0.07), 0 1px 3px rgba(15,17,23,0.05);
      --sh-md: 0 6px 24px rgba(15,17,23,0.10), 0 2px 6px rgba(15,17,23,0.06);
      --sh-lg: 0 16px 48px rgba(15,17,23,0.14), 0 4px 12px rgba(15,17,23,0.08);
      --ease: cubic-bezier(0.4,0,0.2,1);
      --t: 0.2s var(--ease);
      font-family: 'Figtree', sans-serif;
      font-size: 15px;
      color: var(--ink-60);
      background: var(--surface);
      -webkit-font-smoothing: antialiased;
    }

    body { min-height: 100vh; background: var(--surface); }

    .mi {
      font-family: 'Material Symbols Rounded'; font-style: normal;
      font-weight: normal; font-size: 26px; line-height: 1;
      letter-spacing: normal; white-space: nowrap; word-wrap: normal;
      direction: ltr; display: inline-flex; align-items: center;
      user-select: none; -webkit-font-smoothing: antialiased;
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }

    /* ── AUTH ── */
    .auth-wrap {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #dff8f6 0%, #f7f8fc 55%, #eef0fb 100%);
    }
    .auth-card {
      background: var(--white); border-radius: var(--r-2xl);
      padding: 52px 48px; width: 420px; box-shadow: var(--sh-lg); text-align: center;
    }
    .auth-logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 36px; }
    .auth-logo-icon {
      width: 44px; height: 44px; background: var(--teal); border-radius: var(--r-sm);
      display: flex; align-items: center; justify-content: center; color: white;
    }
    .auth-logo-text { font-size: 22px; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; }
    .auth-heading { font-size: 26px; font-weight: 700; color: var(--ink); margin-bottom: 8px; letter-spacing: -0.4px; }
    .auth-sub { font-size: 14px; color: var(--ink-40); margin-bottom: 32px; line-height: 1.65; }
    .field-wrap { position: relative; margin-bottom: 12px; }
    .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ink-20); }
    .auth-input {
      width: 100%; padding: 14px 14px 14px 42px;
      border: 1.5px solid var(--border); border-radius: var(--r-sm);
      font-family: 'Figtree', sans-serif; font-size: 15px; color: var(--ink);
      background: var(--ink-05); outline: none;
      transition: border-color var(--t), box-shadow var(--t), background var(--t);
    }
    .auth-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(0,180,166,0.12); background: var(--white); }
    .btn-primary {
      width: 100%; padding: 14px; background: var(--teal); color: white; border: none;
      border-radius: var(--r-sm); font-family: 'Figtree', sans-serif;
      font-size: 15px; font-weight: 600; cursor: pointer;
      transition: background var(--t), transform var(--t), box-shadow var(--t);
    }
    .btn-primary:hover { background: var(--teal-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,180,166,0.28); }

    /* ── SHELL ── */
    .app-shell { max-width: 1040px; margin: 0 auto; padding: 0 24px 80px; }

    /* ── TOPBAR ── */
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 0 16px; border-bottom: 1px solid var(--border); margin-bottom: 20px;
    }
    .wordmark { display: flex; align-items: center; gap: 10px; }
    .wordmark-icon {
      width: 36px; height: 36px; background: var(--deepskyblue); border-radius: 10px;
      display: flex; align-items: center; justify-content: center; color: white;
    }
    .wordmark-text { font-size: 17px; font-weight: 700; color: var(--ink); letter-spacing: -0.3px; }
    .btn-ghost {
      display: flex; align-items: center; gap: 6px; padding: 8px 14px;
      background: transparent; border: 1.5px solid var(--border); border-radius: var(--r-sm);
      font-family: 'Figtree', sans-serif; font-size: 13px; font-weight: 500;
      color: var(--ink-40); cursor: pointer; transition: all var(--t);
    }
    .btn-ghost:hover { border-color: var(--ink-20); color: var(--ink-60); background: var(--ink-05); }

    /* ── GREETING ── */
    .greeting { margin-bottom: 20px; }
    .greeting-h { font-size: 28px; font-weight: 700; color: var(--ink); letter-spacing: -0.6px; margin-bottom: 4px; }
    .greeting-sub { font-size: 14px; color: var(--ink-40); }

    /* ── SECTION ── */
    .section { margin-bottom: 44px; }
    .section-head {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
    }
    /* #2 fix: left-aligned, sentence case, larger */
    .section-label {
      font-size: 16px; font-weight: 600; letter-spacing: -0.1px;
      color: var(--ink); display: flex; align-items: center; gap: 8px;
    }

    /* ── CUPS ── */
    .cups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
    .cup-card {
      background: var(--card); border-radius: var(--r-xl);
      padding: 22px 18px 18px; border: 1.5px solid var(--border);
      cursor: pointer; transition: transform var(--t), box-shadow var(--t), border-color var(--t);
      position: relative; overflow: visible;
    }
    .cup-card:hover { transform: translateY(-4px); box-shadow: var(--sh-md); border-color: transparent; }
    .cup-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
    .cup-name { font-size: 13px; font-weight: 600; color: var(--ink); line-height: 1.3; flex: 1; padding-right: 6px; }
    .cup-pct { font-size: 13px; font-weight: 700; }
    .cup-vessel { display: flex; justify-content: center; margin-bottom: 12px; }
    .cup-track { height: 5px; background: var(--ink-10); border-radius: 99px; overflow: hidden; }
    .cup-fill { height: 100%; border-radius: 99px; transition: width 0.7s var(--ease); }
    .cup-meta { font-size: 11px; color: var(--ink-40); text-align: center; margin-top: 7px; }
    /* #10: edit button always visible at bottom of card, not hover-only */
    .cup-edit-btn {
      position: absolute; bottom: 5px; right: 10px;
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--white); border: 1.5px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--t); color: var(--ink-40);
      box-shadow: var(--sh-xs);
    }
    .cup-edit-btn:hover { background: var(--ink-05); border-color: var(--ink-20); color: var(--ink); }

    /* ── SUGGESTIONS ── */
    .suggest-stack { display: flex; flex-direction: column; gap: 8px; }
    .suggest-card {
      display: flex; align-items: center; gap: 14px; padding: 16px 18px;
      background: var(--card); border: 1.5px solid var(--border); border-radius: var(--r-lg);
      cursor: pointer; transition: all var(--t);
    }
    .suggest-card:hover { border-color: transparent; box-shadow: var(--sh-sm); transform: translateX(4px); }
    .suggest-pip {
      width: 40px; height: 40px; border-radius: var(--r-sm); flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .suggest-body { flex: 1; min-width: 0; }
    .suggest-act { font-size: 15px; font-weight: 600; color: var(--ink); }
    .suggest-for { font-size: 12px; color: var(--ink-40); margin-top: 1px; }
    .suggest-arrow { color: var(--ink-20); transition: color var(--t), transform var(--t); }
    .suggest-card:hover .suggest-arrow { color: var(--teal); transform: translateX(3px); }

    /* ── ACTIVITIES ── */
    .activity-list { display: flex; flex-direction: column; gap: 6px; }
    .activity-item {
      display: flex; align-items: center; gap: 12px; padding: 8px 10px;
      background: var(--card); border: 1.5px solid var(--border); border-radius: var(--r-md);
      transition: border-color var(--t), box-shadow var(--t);
    }
    .activity-item:hover { border-color: var(--ink-10); box-shadow: var(--sh-xs); }
    .activity-pip { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    /* #2: left-aligned name */
    .activity-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--ink); text-align: left; }
    .activity-chips { flex-wrap: wrap; gap: 4px; }
    .activity-chip { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 99px; white-space: nowrap; margin: 5px; }
    .activity-btns { display: flex; gap: 4px; }
    .icon-btn {
      width: 32px; height: 32px; border: none; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--t); background: transparent; color: var(--ink-40);
    }
    .icon-btn:hover { background: var(--ink-05); color: var(--ink); }
    .icon-btn.run:hover { background: var(--teal-light); color: var(--teal-dark); }
    .icon-btn.del:hover { background: #fde8e8; color: #d03030; }

    /* ── SORT BAR ── */
    .sort-bar { display: flex; gap: 6px; }
    .sort-btn {
      padding: 5px 12px; border: 1.5px solid var(--border); border-radius: 99px;
      background: transparent; font-family: 'Figtree', sans-serif;
      font-size: 12px; font-weight: 500; color: var(--ink-40);
      cursor: pointer; transition: all var(--t);
    }
    .sort-btn:hover { border-color: var(--ink-20); color: var(--ink-60); }
    .sort-btn.active { background: var(--ink); border-color: var(--ink); color: white; }

    /* ── CREATE ACTIVITY ── */
    .create-card {
      background: var(--card); border: 1.5px solid var(--border);
      border-radius: var(--r-xl); padding: 28px;
    }
    .create-form { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 160px; }
    .form-label { font-size: 11px; font-weight: 700; color: var(--ink-40); letter-spacing: 0.8px; text-transform: uppercase; }
    .form-input {
      padding: 11px 14px; border: 1.5px solid var(--border); border-radius: var(--r-sm);
      font-family: 'Figtree', sans-serif; font-size: 14px; color: var(--ink);
      background: var(--ink-05); outline: none;
      transition: border-color var(--t), box-shadow var(--t), background var(--t);
    }
    .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(0,180,166,0.12); background: var(--white); }
    .btn-add {
      padding: 11px 22px; background: var(--teal); color: white; border: none;
      border-radius: var(--r-sm); font-family: 'Figtree', sans-serif;
      font-size: 14px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; gap: 6px;
      transition: all var(--t); white-space: nowrap; align-self: flex-end;
    }
    .btn-add:hover { background: var(--teal-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,180,166,0.28); }
    .btn-add:disabled { background: var(--ink-10); color: var(--ink-40); cursor: not-allowed; transform: none; box-shadow: none; }

    /* ── CHECKBOX LIST (multi-cup selector) ── */
    .cup-checkbox-list { display: flex; flex-direction: column; gap: 6px; }
    .cup-checkbox-item {
      display: flex; align-items: center; gap: 10px; padding: 10px 12px;
      border: 1.5px solid var(--border); border-radius: var(--r-sm);
      cursor: pointer; transition: all var(--t); user-select: none;
    }
    .cup-checkbox-item:hover { border-color: var(--ink-20); background: var(--ink-05); }
    .cup-checkbox-item.selected { border-color: var(--teal); background: var(--teal-light); }
    .cup-checkbox-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .cup-checkbox-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--ink); }
    .cup-checkbox-tick {
      width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--ink-20);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all var(--t);
    }
    .cup-checkbox-item.selected .cup-checkbox-tick { background: var(--teal); border-color: var(--teal); color: white; }

    /* ── MODAL ── */
    .overlay {
      position: fixed; inset: 0; background: rgba(15,17,23,0.5);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999; padding: 20px; animation: fadeIn 0.15s var(--ease);
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    .modal {
      background: var(--white); border-radius: var(--r-2xl);
      padding: 32px; width: 500px; max-width: 100%;
      max-height: 86vh; overflow-y: auto; box-shadow: var(--sh-lg);
      animation: slideUp 0.2s var(--ease);
    }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
    .modal-top {
      display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px;
    }
    .modal-title { font-size: 19px; font-weight: 700; color: var(--ink); letter-spacing: -0.3px; display: flex; align-items: center; gap: 10px; }
    .modal-sub { font-size: 13px; color: var(--ink-40); margin-top: 3px; }
    .btn-close {
      width: 34px; height: 34px; border: none; border-radius: 50%;
      background: var(--ink-05); color: var(--ink-40); flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--t);
    }
    .btn-close:hover { background: var(--ink-10); color: var(--ink); }
    .divider { height: 1px; background: var(--border); margin: 4px 0 16px; }
    .history-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 11px 0; border-bottom: 1px solid var(--border); font-size: 14px;
    }
    .history-row:last-child { border-bottom: none; }
    .history-act { font-weight: 500; color: var(--ink); }
    .history-ts { font-size: 12px; color: var(--ink-40); }
    .modal-form { display: flex; flex-direction: column; gap: 16px; }
    .modal-actions { display: flex; gap: 10px; margin-top: 4px; }
    .btn-outline {
      flex: 1; padding: 12px; border: 1.5px solid var(--border); border-radius: var(--r-sm);
      background: transparent; font-family: 'Figtree', sans-serif;
      font-size: 14px; font-weight: 500; color: var(--ink-60); cursor: pointer; transition: all var(--t);
    }
    .btn-outline:hover { background: var(--ink-05); border-color: var(--ink-20); }
    .btn-fill {
      flex: 2; padding: 12px; background: var(--teal); border: none;
      border-radius: var(--r-sm); font-family: 'Figtree', sans-serif;
      font-size: 14px; font-weight: 600; color: white; cursor: pointer; transition: all var(--t);
    }
    .btn-fill:hover { background: var(--teal-dark); }
    .btn-danger {
      padding: 12px 16px; background: transparent; border: 1.5px solid #fca5a5;
      border-radius: var(--r-sm); font-family: 'Figtree', sans-serif;
      font-size: 14px; font-weight: 500; color: #dc2626; cursor: pointer; transition: all var(--t);
      white-space: nowrap;
    }
    .btn-danger:hover { background: #fde8e8; border-color: #f87171; }

    /* cup editor pickers */
    .color-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
    .color-swatch {
      width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
      border: 3px solid transparent; transition: all var(--t);
    }
    .color-swatch:hover { transform: scale(1.15); }
    .color-swatch.active { border-color: var(--ink); }
    .icon-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
    .icon-option {
      width: 40px; height: 40px; border-radius: var(--r-sm);
      border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--t); color: var(--ink-60);
    }
    .icon-option:hover { border-color: var(--ink-20); background: var(--ink-05); }
    .icon-option.active { border-color: var(--teal); background: var(--teal-light); color: var(--teal-dark); }

    /* ── TOAST ── */
    .toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: var(--ink); color: white; padding: 12px 20px; border-radius: var(--r-lg);
      font-size: 14px; font-weight: 500; box-shadow: var(--sh-lg); z-index: 2000;
      display: flex; align-items: center; gap: 8px;
      animation: toastIn 0.25s var(--ease) forwards;
    }
    @keyframes toastIn {
      from { opacity:0; transform:translateX(-50%) translateY(12px) }
      to   { opacity:1; transform:translateX(-50%) translateY(0) }
    }
    .empty { text-align:center; padding: 28px; color: var(--ink-40); font-size: 14px; }

    @media (max-width: 600px) {
      .cups-grid { grid-template-columns: repeat(2, 1fr); }
      .create-form { flex-direction: column; }
      .modal { padding: 24px 20px; }
    }
  `}</style>
)

/* ─────────────────────────────────────────────────────────────────
   VESSEL SVGs
   ───────────────────────────────────────────────────────────────── */

/* MUG — rim is an ellipse, not a flat rect, so no straight line at top */
function MugSVG({ color, pct }) {
  const bodyTop = 18, bodyH = 62, filled = (pct / 100) * bodyH, y = bodyTop + bodyH - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs>
        <clipPath id={`m${color}`}>
          {/* clip matches body path so fill stays inside the curves */}
          <path d="M12 18 Q12 80 40 80 Q68 80 68 80 L68 18 Q68 18 40 18 Q12 18 12 18 Z"/>
        </clipPath>
      </defs>
      {/* liquid fill */}
      <rect x="12" y={y} width="56" height={filled} fill={color} opacity="0.2" clipPath={`url(#m${color})`}/>
      {filled > 4 && <rect x="12" y={y} width="56" height="3" fill={color} opacity="0.4" clipPath={`url(#m${color})`}/>}
      {/* body — straight sides, rounded bottom */}
      <path d="M12 18 L12 72 Q12 80 40 80 Q68 80 68 72 L68 18" stroke={color} strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      {/* rim ellipse — sits on top of body, no straight line visible */}
      <ellipse cx="40" cy="18" rx="28" ry="5" fill={color} opacity="0.12"/>
      <ellipse cx="40" cy="18" rx="28" ry="5" stroke={color} strokeWidth="2" fill="none"/>
      {/* handle */}
      <path d="M68 32 C82 32 82 64 68 64" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* base shadow */}
      <ellipse cx="40" cy="80" rx="28" ry="4" fill={color} opacity="0.1"/>
    </svg>
  )
}

/* TEACUP — cup sits on the saucer (no gap), rim is ellipse only */
function TeacupSVG({ color, pct }) {
  // saucer at y=78, cup bottom at y=72 so it rests on it
  const bodyTop = 32, bodyBottom = 72, bodyH = bodyBottom - bodyTop
  const filled = (pct / 100) * bodyH, y = bodyBottom - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs>
        <clipPath id={`tc${color}`}>
          <path d="M18 32 Q16 72 24 72 L54 72 Q62 72 60 32 Z"/>
        </clipPath>
      </defs>
      {/* steam */}
      <path d="M30 20 Q32 14 30 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
      <path d="M40 18 Q42 12 40 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"/>
      <path d="M50 20 Q52 14 50 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
      {/* liquid */}
      <rect x="18" y={y} width="42" height={filled} fill={color} opacity="0.2" clipPath={`url(#tc${color})`}/>
      {/* cup body — tapers slightly, sits flush on saucer */}
      <path d="M18 32 Q16 72 24 72 L54 72 Q62 72 60 32" stroke={color} strokeWidth="2.5" fill="none"/>
      {/* rim ellipse only — no separate line */}
      <ellipse cx="39" cy="32" rx="21" ry="5" fill={color} opacity="0.1"/>
      <ellipse cx="39" cy="32" rx="21" ry="5" stroke={color} strokeWidth="2" fill="none"/>
      {/* handle */}
      <path d="M60 44 Q72 44 72 56 Q72 68 60 66" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* saucer — cup bottom (y=72) sits right on top of saucer (y=72) */}
      <ellipse cx="39" cy="75" rx="30" ry="5.5" fill={color} opacity="0.12"/>
      <ellipse cx="39" cy="75" rx="30" ry="5.5" stroke={color} strokeWidth="2" fill="none"/>
      {/* saucer inner ring */}
      <ellipse cx="39" cy="74" rx="14" ry="2.5" fill={color} opacity="0.08"/>
    </svg>
  )
}

/* WINE GLASS — smooth curved bowl using cubic bezier, no kink at base */
function WineGlassSVG({ color, pct }) {
  const bowlTop = 6, bowlBottom = 56, bowlH = bowlBottom - bowlTop
  const filled = (pct / 100) * bowlH, y = bowlBottom - filled
  // Smooth bowl: wide at top, curves to a narrow point at bottom, no straight lines
  // Using cubic bezier: top-left (22,6) curves in to meet bottom centre (40,56),
  // and top-right (54,6) mirrors it — no kink because we don't use L commands in bowl
  const bowlPath = "M22 6 C22 6 14 30 18 50 C20 54 28 58 40 58 C52 58 60 54 62 50 C66 30 56 6 58 6"
  const clipPath = "M22 6 C22 6 14 30 18 50 C20 54 28 58 40 58 C52 58 60 54 62 50 C66 30 54 6 54 6 Z"
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs><clipPath id={`wg${color}`}><path d={clipPath}/></clipPath></defs>
      <rect x="16" y={y} width="48" height={filled} fill={color} opacity="0.25" clipPath={`url(#wg${color})`}/>
      {pct > 5 && <rect x="16" y={y} width="48" height="3" fill={color} opacity="0.4" clipPath={`url(#wg${color})`}/>}
      <path d={bowlPath} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* rim — just the top line connecting the two sides */}
      <line x1="22" y1="6" x2="56" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* stem */}
      <line x1="40" y1="58" x2="40" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* base */}
      <line x1="22" y1="84" x2="58" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="40" cy="86" rx="18" ry="4" fill={color} opacity="0.1"/>
      {/* shine */}
      <path d="M27 14 Q28 28 27 38" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
    </svg>
  )
}

/* BOWL — rim is ellipse, hide the flat line by covering with filled ellipse */
function BowlSVG({ color, pct }) {
  const maxH = 34, filled = (pct / 100) * maxH
  return (
    <svg width="80" height="84" viewBox="0 0 80 84" fill="none">
      <defs>
        <clipPath id={`bl${color}`}>
          <path d="M8 36 Q8 72 40 72 Q72 72 72 36 Z"/>
        </clipPath>
      </defs>
      {/* liquid fill */}
      <rect x="8" y={36 + maxH - filled} width="64" height={filled + 10} fill={color} opacity="0.2" clipPath={`url(#bl${color})`}/>
      {/* bowl body */}
      <path d="M8 36 Q8 72 40 72 Q72 72 72 36" stroke={color} strokeWidth="2.5" fill="none"/>
      {/* rim ellipse — fills over the top of the path so no straight line shows */}
      <ellipse cx="40" cy="36" rx="32" ry="7" fill={color} opacity="0.12"/>
      <ellipse cx="40" cy="36" rx="32" ry="7" stroke={color} strokeWidth="2" fill="none"/>
      {/* base ring */}
      <ellipse cx="40" cy="72" rx="13" ry="3" fill={color} opacity="0.18"/>
    </svg>
  )
}

/* HIGHBALL GLASS — straight tall glass (replaces old pint which had wrong icon) */
function HighballSVG({ color, pct }) {
  const top = 8, h = 72, filled = (pct / 100) * h, y = top + h - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs><clipPath id={`hb${color}`}><rect x="18" y={top} width="44" height={h} rx="2"/></clipPath></defs>
      {/* liquid */}
      <rect x="18" y={y} width="44" height={filled} fill={color} opacity="0.22" clipPath={`url(#hb${color})`}/>
      {filled > 4 && <rect x="18" y={y} width="44" height="3" fill={color} opacity="0.4" clipPath={`url(#hb${color})`}/>}
      {/* body — perfectly straight sides */}
      <path d="M18 8 L18 80 L62 80 L62 8" stroke={color} strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      {/* rim ellipse */}
      <ellipse cx="40" cy="8" rx="22" ry="4" fill={color} opacity="0.12"/>
      <ellipse cx="40" cy="8" rx="22" ry="4" stroke={color} strokeWidth="2" fill="none"/>
      {/* base */}
      <rect x="16" y="80" width="48" height="5" rx="2.5" fill={color} opacity="0.18"/>
      {/* subtle reflection line */}
      <line x1="24" y1="16" x2="24" y2="70" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

/* COCKTAIL GLASS — martini/cocktail shape to match local_bar icon */
function CocktailSVG({ color, pct }) {
  const bowlH = 42, filled = (pct / 100) * bowlH
  // V-shape bowl: wide at top (x=12 to x=68), meets at point (x=40,y=56)
  const clipPath = `M12 14 L40 56 L68 14 Z`
  const y = 56 - filled  // fill rises from point up
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs><clipPath id={`ck${color}`}><path d={clipPath}/></clipPath></defs>
      {/* fill — triangle clip */}
      <rect x="12" y={y} width="56" height={filled} fill={color} opacity="0.25" clipPath={`url(#ck${color})`}/>
      {pct > 8 && <rect x="12" y={y} width="56" height="3" fill={color} opacity="0.4" clipPath={`url(#ck${color})`}/>}
      {/* bowl — V shape */}
      <path d="M12 14 L40 56 L68 14" stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
      {/* rim */}
      <line x1="12" y1="14" x2="68" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* stem */}
      <line x1="40" y1="56" x2="40" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* base */}
      <line x1="24" y1="84" x2="56" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="40" cy="86" rx="16" ry="3.5" fill={color} opacity="0.1"/>
      {/* olive garnish at top when >50% */}
      {pct > 50 && <circle cx="52" cy="14" r="4" fill={color} opacity="0.5"/>}
    </svg>
  )
}

/* COFFEE TAKEAWAY */
function CoffeeCupSVG({ color, pct }) {
  const top = 18, h = 58, filled = (pct / 100) * h, y = top + h - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs><clipPath id={`cc${color}`}><path d="M14 18 L18 76 Q18 80 40 80 Q62 80 62 76 L66 18 Z"/></clipPath></defs>
      <rect x="14" y={y} width="52" height={filled} fill={color} opacity="0.2" clipPath={`url(#cc${color})`}/>
      <path d="M14 18 L18 76 Q18 80 40 80 Q62 80 62 76 L66 18 Z" stroke={color} strokeWidth="2.5" fill="none"/>
      <rect x="12" y="12" width="56" height="10" rx="5" fill={color} opacity="0.15"/>
      <rect x="12" y="12" width="56" height="10" rx="5" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="30" y="9" width="20" height="7" rx="3.5" fill={color} opacity="0.25"/>
      <line x1="18" y1="50" x2="62" y2="50" stroke={color} strokeWidth="1" opacity="0.15" strokeDasharray="4 3"/>
      <rect x="14" y="80" width="52" height="5" rx="2.5" fill={color} opacity="0.18"/>
    </svg>
  )
}

/* CHAMPAGNE FLUTE — smooth narrow shape, bubbles */
function FluteSVG({ color, pct }) {
  const top = 4, bowlH = 52, filled = (pct / 100) * bowlH, y = top + bowlH - filled
  // Smooth flute: slightly wider at top, tapers to narrow base using curves
  const flutePath = "M30 4 C28 20 26 40 28 56 Q28 60 40 60 Q52 60 52 56 C54 40 52 20 50 4"
  const fluteClip = "M30 4 C28 20 26 40 28 56 Q28 60 40 60 Q52 60 52 56 C54 40 52 20 50 4 Z"
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs><clipPath id={`fl${color}`}><path d={fluteClip}/></clipPath></defs>
      <rect x="26" y={y} width="28" height={filled} fill={color} opacity="0.28" clipPath={`url(#fl${color})`}/>
      {pct > 5 && <rect x="26" y={y} width="28" height="3" fill={color} opacity="0.5" clipPath={`url(#fl${color})`}/>}
      {pct > 20 && <>
        <circle cx="35" cy={y + filled * 0.7} r="1.5" fill={color} opacity="0.5"/>
        <circle cx="40" cy={y + filled * 0.4} r="1" fill={color} opacity="0.4"/>
        <circle cx="45" cy={y + filled * 0.6} r="1.5" fill={color} opacity="0.5"/>
      </>}
      <path d={flutePath} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="30" y1="4" x2="50" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="60" x2="40" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="26" y1="84" x2="54" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="40" cy="86" rx="14" ry="3.5" fill={color} opacity="0.1"/>
    </svg>
  )
}

/* Vessel router */
function Vessel({ icon, color, pct }) {
  const c = color || '#00b4a6'
  const p = Math.min(100, Math.max(0, Math.round(pct)))
  switch ((icon || '').toLowerCase()) {
    case 'teacup':                        return <TeacupSVG   color={c} pct={p}/>
    case 'wine':                          return <WineGlassSVG color={c} pct={p}/>
    case 'glass':                         return <HighballSVG color={c} pct={p}/>
    case 'bowl':                          return <BowlSVG     color={c} pct={p}/>
    case 'pint':                          return <CocktailSVG color={c} pct={p}/>
    case 'coffee': case 'takeaway':       return <CoffeeCupSVG color={c} pct={p}/>
    case 'flute': case 'champagne':       return <FluteSVG    color={c} pct={p}/>
    default:                              return <MugSVG      color={c} pct={p}/>
  }
}

/* Material Symbol name per vessel — #6/#7 fixes: glass→liquor, pint→local_bar (cocktail) */
function vesselIcon(icon) {
  switch ((icon || '').toLowerCase()) {
    case 'teacup':                  return 'emoji_food_beverage'
    case 'wine':                    return 'wine_bar'
    case 'glass':                   return 'local_drink'      // highball glass icon
    case 'bowl':                    return 'soup_kitchen'
    case 'pint':                    return 'local_bar'        // cocktail glass icon
    case 'coffee': case 'takeaway': return 'coffee'
    case 'flute': case 'champagne': return 'celebration'
    default:                        return 'local_cafe'
  }
}

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────────────────────────── */
const CUP_COLORS = [
  '#ef476f','#f7931e','#ffd166','#06d6a0','#00b4a6',
  '#118ab2','#7b68ee','#c77dff','#ff6b9d','#40916c'
]
const CUP_ICONS = ['mug','teacup','glass','wine','bowl','pint','coffee','flute']
const CUP_ICON_LABELS = {
  mug:'Mug', teacup:'Teacup', glass:'Highball', wine:'Wine glass',
  bowl:'Bowl', pint:'Cocktail', coffee:'Coffee', flute:'Flute'
}

/* ─────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────── */
function rgba(hex, a) {
  if (!hex || hex.length < 7) return `rgba(0,180,166,${a})`
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}
function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning ☀️' : h < 17 ? 'Good afternoon ☕️' : 'Good evening 🍷'
}
function fmtDate(s) {
  return new Date(s).toLocaleString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}

/* ─────────────────────────────────────────────────────────────────
   CUP MODAL (Add / Edit)
   ───────────────────────────────────────────────────────────────── */
function CupModal({ cup, onClose, onSave, onDelete, userId }) {
  const isNew = !cup?.id
  const [name, setName] = useState(cup?.name || '')
  const [color, setColor] = useState(cup?.color || CUP_COLORS[0])
  const [icon, setIcon] = useState(cup?.icon || 'mug')
  const [maxLevel, setMaxLevel] = useState(cup?.max_level ?? 10)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const save = async () => {
    if (!name.trim()) return
    setSaving(true)
    if (isNew) {
      await supabase.from('cups').insert({
        user_id: userId, name: name.trim(), color, icon,
        max_level: Number(maxLevel), current_level: 0, display_order: 999
      })
    } else {
      await supabase.from('cups').update({
        name: name.trim(), color, icon, max_level: Number(maxLevel)
      }).eq('id', cup.id)
    }
    setSaving(false)
    onSave()
  }

  const doDelete = async () => {
    await supabase.from('activity_cups').delete().eq('cup_id', cup.id)
    await supabase.from('cups').delete().eq('id', cup.id)
    onDelete()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top">
          <div>
            <div className="modal-title">{isNew ? 'Add a cup' : 'Edit cup'}</div>
            <div className="modal-sub">{isNew ? 'What fills you up?' : 'Update your cup settings'}</div>
          </div>
          <button className="btn-close" onClick={onClose}><span className="mi" style={{fontSize:18}}>close</span></button>
        </div>
        <div className="modal-form">
          <div style={{display:'flex', justifyContent:'center', marginBottom:4}}>
            <Vessel icon={icon} color={color} pct={60}/>
          </div>
          <div className="form-group">
            <label className="form-label">Cup name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Connection, Creativity, Rest…"
              onKeyDown={e => e.key === 'Enter' && save()}/>
          </div>
          <div className="form-group">
            <label className="form-label">Max level</label>
            <input className="form-input" type="number" min="1" max="100" value={maxLevel}
              onChange={e => setMaxLevel(e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Colour</label>
            <div className="color-grid">
              {CUP_COLORS.map(c => (
                <div key={c} className={`color-swatch${color === c ? ' active' : ''}`}
                  style={{background: c}} onClick={() => setColor(c)}/>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Vessel type</label>
            <div className="icon-grid">
              {CUP_ICONS.map(ic => (
                <div key={ic} className={`icon-option${icon === ic ? ' active' : ''}`}
                  onClick={() => setIcon(ic)} title={CUP_ICON_LABELS[ic]}>
                  <span className="mi" style={{fontSize:20}}>{vesselIcon(ic)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            {!isNew && !confirmDelete && (
              <button className="btn-danger" onClick={() => setConfirmDelete(true)}>Delete cup</button>
            )}
            {!isNew && confirmDelete && (
              <button className="btn-danger" onClick={doDelete}>Confirm delete</button>
            )}
            <button className="btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn-fill" onClick={save} disabled={saving || !name.trim()}>
              {saving ? 'Saving…' : isNew ? 'Add cup' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   APP
   ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [cups, setCups] = useState([])
  const [activities, setActivities] = useState([])
  const [activityLinks, setActivityLinks] = useState([])
  const [logCounts, setLogCounts] = useState({}) // activityId -> count, for sort

  const [selectedCup, setSelectedCup] = useState(null)
  const [cupHistory, setCupHistory] = useState([])

  const [cupModalOpen, setCupModalOpen] = useState(false)
  const [editingCup, setEditingCup] = useState(null)

  const [newActivity, setNewActivity] = useState('')
  const [selectedCupId, setSelectedCupId] = useState('')

  const [editingActivity, setEditingActivity] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCupIds, setEditCupIds] = useState([])

  // #9: sort state
  const [activitySort, setActivitySort] = useState('az') // 'az' | 'freq' | 'random'

  const [toast, setToast] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => l.subscription.unsubscribe()
  }, [])

  useEffect(() => { if (session?.user?.id) reload() }, [session])

  const reload = async () => {
    const uid = session.user.id
    const [cr, ar, lr, lgr] = await Promise.all([
      supabase.from('cups').select('*').eq('user_id', uid).order('display_order'),
      supabase.from('activities').select('*').eq('user_id', uid),
      supabase.from('activity_cups').select('*'),
      supabase.from('logs').select('activity_id').eq('user_id', uid),
    ])
    setCups(cr.data || [])
    setActivities((ar.data || []).sort((a,b) => a.name.localeCompare(b.name)))
    setActivityLinks(lr.data || [])
    // count logs per activity
    const counts = {}
    ;(lgr.data || []).forEach(l => { counts[l.activity_id] = (counts[l.activity_id] || 0) + 1 })
    setLogCounts(counts)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }
  const signIn = async () => { await supabase.auth.signInWithOtp({ email }); showToast('Magic link sent — check your email') }
  const signOut = async () => { await supabase.auth.signOut(); setSession(null) }

  const createActivity = async () => {
    const name = newActivity.trim()
    if (!name || !selectedCupId) return
    const { data: a, error } = await supabase.from('activities')
      .insert({ user_id: session.user.id, name })
      .select().single()
    if (error || !a) { showToast('Error adding activity'); return }
    await supabase.from('activity_cups').insert({ activity_id: a.id, cup_id: selectedCupId, value: 1 })
    setNewActivity(''); setSelectedCupId('')
    await reload(); showToast('Activity added')
  }

  const runActivity = async (activityId) => {
    await supabase.from('logs').insert({ user_id: session.user.id, activity_id: activityId })
    const { data: links } = await supabase.from('activity_cups').select('*').eq('activity_id', activityId)
    for (const link of links || []) {
      const { data: cup } = await supabase.from('cups').select('*').eq('id', link.cup_id).single()
      const nv = Math.min(cup.current_level + (link.value || 1), cup.max_level)
      await supabase.from('cups').update({ current_level: nv }).eq('id', cup.id)
    }
    await reload(); showToast('Logged! Your cup is filling up ✓')
  }

  const openCup = async (cup) => {
    setSelectedCup(cup)
    const { data: links } = await supabase.from('activity_cups').select('activity_id').eq('cup_id', cup.id)
    const ids = (links || []).map(l => l.activity_id)
    if (!ids.length) { setCupHistory([]); return }
    const { data: logs } = await supabase.from('logs')
      .select('id, created_at, activity_id, activities(name)')
      .in('activity_id', ids)
      .order('created_at', { ascending: false })
    setCupHistory(logs || [])
  }

  const startEdit = async (a) => {
    setEditingActivity(a); setEditName(a.name)
    const { data } = await supabase.from('activity_cups').select('*').eq('activity_id', a.id)
    setEditCupIds((data || []).map(r => r.cup_id))
  }

  const toggleEditCup = (cupId) => {
    setEditCupIds(prev => prev.includes(cupId) ? prev.filter(id => id !== cupId) : [...prev, cupId])
  }

  const saveEdit = async () => {
    if (!editName.trim()) return
    await supabase.from('activities').update({ name: editName.trim() }).eq('id', editingActivity.id)
    await supabase.from('activity_cups').delete().eq('activity_id', editingActivity.id)
    if (editCupIds.length) {
      await supabase.from('activity_cups').insert(
        editCupIds.map(cid => ({ activity_id: editingActivity.id, cup_id: cid, value: 1 }))
      )
    }
    setEditingActivity(null); await reload(); showToast('Activity updated')
  }

  // #1: delete is now inside edit modal only
  const deleteActivity = async (id) => {
    await supabase.from('activity_cups').delete().eq('activity_id', id)
    await supabase.from('activities').delete().eq('id', id)
    setEditingActivity(null); await reload(); showToast('Activity deleted')
  }

  const getSuggestions = () => {
    if (!cups.length || !activities.length || !activityLinks.length) return []
    const ranked = [...cups].sort((a,b) => (a.current_level/a.max_level) - (b.current_level/b.max_level))
    const out = []
    for (const cup of ranked) {
      const ids = activityLinks.filter(l => l.cup_id === cup.id).map(l => l.activity_id)
      const match = activities.find(a => ids.includes(a.id))
      if (match) out.push({ cup, activity: match })
      if (out.length === 3) break
    }
    return out
  }

  const getCupsForActivity = (actId) => {
    const ids = activityLinks.filter(l => l.activity_id === actId).map(l => l.cup_id)
    return cups.filter(c => ids.includes(c.id))
  }

  // #9: sorted activities
  const sortedActivities = () => {
    const arr = [...activities]
    if (activitySort === 'az') return arr.sort((a,b) => a.name.localeCompare(b.name))
    if (activitySort === 'freq') return arr.sort((a,b) => (logCounts[b.id] || 0) - (logCounts[a.id] || 0))
    if (activitySort === 'random') return arr.sort(() => Math.random() - 0.5)
    return arr
  }

  /* ── AUTH SCREEN ── */
  if (!session) return (
    <>
      <GlobalStyle/>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon"><span className="mi">local_cafe</span></div>
            <span className="auth-logo-text">Fill Your Cup</span>
          </div>
          <div className="auth-heading">Welcome back</div>
          <p className="auth-sub">Track the activities that replenish you.<br/>We'll help keep your cups full.</p>
          <div className="field-wrap">
            <span className="mi field-icon">mail</span>
            <input className="auth-input" type="email" placeholder="your@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && signIn()}/>
          </div>
          <button className="btn-primary" onClick={signIn}>Send magic link</button>
        </div>
      </div>
    </>
  )

  const suggestions = getSuggestions()
  const displayedActivities = sortedActivities()

  return (
    <>
      <GlobalStyle/>
      <div className="app-shell">

        {/* TOPBAR */}
        <nav className="topbar">
          <div className="wordmark">
            <div className="wordmark-icon"><span className="mi" style={{fontSize:24}}>specific_gravity</span></div>
            <span className="wordmark-text">Fill Your Cup</span>
          </div>
          <button className="btn-ghost" onClick={signOut}>
            <span className="mi" style={{fontSize:16}}>logout</span>Sign out
          </button>
        </nav>

        {/* GREETING */}
        <div className="greeting">
          <div className="greeting-h">{greeting()}</div>
          <div className="greeting-sub">
            {cups.length > 0
              ? `You have ${cups.length} cup${cups.length !== 1 ? 's' : ''} to tend to today.`
              : 'Add your first cup to get started.'}
          </div>
        </div>

        {/* ── CUPS ── */}
        <div className="section">
          <div className="section-head">
            <div className="section-label">
              <span className="mi" style={{fontSize:18}}>water_full</span>Your cups
            </div>
            <button className="btn-ghost" style={{padding:'6px 12px', fontSize:12}}
              onClick={() => { setEditingCup(null); setCupModalOpen(true) }}>
              <span className="mi" style={{fontSize:14}}>add</span>Add cup
            </button>
          </div>

          <div className="cups-grid">
            {cups.map(cup => {
              const pct = Math.round((cup.current_level / cup.max_level) * 100)
              return (
                <div key={cup.id} className="cup-card" onClick={() => openCup(cup)}>
                  <div className="cup-card-top">
                    <div className="cup-name">{cup.name}</div>
                    <div className="cup-pct" style={{color: cup.color}}>{pct}%</div>
                  </div>
                  <div className="cup-vessel">
                    <Vessel icon={cup.icon} color={cup.color} pct={pct}/>
                  </div>
                  <div className="cup-track">
                    <div className="cup-fill" style={{width:`${pct}%`, background: cup.color}}/>
                  </div>
                  <div className="cup-meta">{cup.current_level} / {cup.max_level}</div>
                  {/* #10: edit button always visible, bottom-right of card */}
                  <button
                    className="cup-edit-btn"
                    onClick={e => { e.stopPropagation(); setEditingCup(cup); setCupModalOpen(true) }}
                    title="Edit cup"
                  >
                    <span className="mi" style={{fontSize:14}}>edit</span>
                  </button>
                </div>
              )
            })}
            {/* #8: only show add card when no cups yet */}
            {cups.length === 0 && (
              <div
                style={{
                  background:'transparent', borderRadius:'var(--r-xl)',
                  padding:'22px 18px', border:'1.5px dashed var(--border)',
                  cursor:'pointer', display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  gap:8, minHeight:200, color:'var(--ink-40)',
                  transition:'all var(--t)'
                }}
                onClick={() => { setEditingCup(null); setCupModalOpen(true) }}
              >
                <span className="mi" style={{fontSize:32}}>add_circle</span>
                <span style={{fontSize:12, fontWeight:600}}>Add a cup</span>
              </div>
            )}
          </div>
        </div>

        {/* ── SUGGESTIONS ── */}
        {suggestions.length > 0 && (
          <div className="section">
            <div className="section-head">
              <div className="section-label">
                <span className="mi" style={{fontSize:18}}>auto_awesome</span>Recommended for you
              </div>
            </div>
            <div className="suggest-stack">
              {suggestions.map((s, i) => (
                <div key={i} className="suggest-card" onClick={() => runActivity(s.activity.id)}>
                  <div className="suggest-pip" style={{background: rgba(s.cup.color, 0.12), color: s.cup.color}}>
                    <span className="mi" style={{fontSize:20}}>{vesselIcon(s.cup.icon)}</span>
                  </div>
                  <div className="suggest-body">
                    <div className="suggest-act">{s.activity.name}</div>
                    <div className="suggest-for">
                      Fills your {s.cup.name} · {Math.round((s.cup.current_level/s.cup.max_level)*100)}% full
                    </div>
                  </div>
                  <span className="mi suggest-arrow">add_circle</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ACTIVITIES ── */}
        <div className="section">
          <div className="section-head">
            {/* #2: left-aligned label */}
            <div className="section-label">
              <span className="mi" style={{fontSize:18}}>format_list_bulleted</span>Activities
            </div>
            {/* #9: sort buttons */}
            <div className="sort-bar">
              <button className={`sort-btn${activitySort === 'az' ? ' active' : ''}`}
                onClick={() => setActivitySort('az')}>A–Z</button>
              <button className={`sort-btn${activitySort === 'freq' ? ' active' : ''}`}
                onClick={() => setActivitySort('freq')}>Most frequent</button>
              <button className={`sort-btn${activitySort === 'random' ? ' active' : ''}`}
                onClick={() => setActivitySort('random')}>Shuffle</button>
            </div>
          </div>

          {displayedActivities.length === 0
            ? (
              <div className="empty">
                <span className="mi" style={{fontSize:32, display:'block', marginBottom:8, color:'var(--ink-20)'}}>add_circle</span>
                No activities yet — add one below
              </div>
            )
            : (
              <div className="activity-list">
                {displayedActivities.map(a => {
                  const linkedCups = getCupsForActivity(a.id)
                  const pipColor = linkedCups[0]?.color || 'var(--ink-20)'
                  return (
                    <div key={a.id} className="activity-item">
                      
                      {/* #2: explicitly left-aligned */}
                      <div className="activity-name">{a.name}</div>
                      <div className="activity-chips">
                        {linkedCups.map(cup => (
                          <div key={cup.id} className="activity-chip"
                            style={{background: rgba(cup.color, 0.10), color: cup.color}}>
                            {cup.name}
                          </div>
                        ))}
                      </div>
                      {/* #1: only run + edit, no delete button here */}
                      <div className="activity-btns">
                        <button className="icon-btn run" onClick={() => runActivity(a.id)} title="Log this">
                          <span className="mi" style={{fontSize:24}}>add_circle</span>
                        </button>
                        <button className="icon-btn" onClick={() => startEdit(a)} title="Edit">
                          <span className="mi" style={{fontSize:17}}>edit</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </div>

        {/* ── CREATE ACTIVITY ── */}
        <div className="section">
          <div className="create-card">
            <div className="section-head" style={{marginBottom:0}}>
              <div className="section-label">
                <span className="mi" style={{fontSize:18}}>add_notes</span>Add an activity
              </div>
            </div>
            <div className="create-form">
              <div className="form-group" style={{flex:2}}>
                <label className="form-label">Activity name</label>
                <input className="form-input" value={newActivity}
                  onChange={e => setNewActivity(e.target.value)}
                  placeholder="e.g. Morning run, Call a friend, Read…"
                  onKeyDown={e => { if (e.key === 'Enter') createActivity() }}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fills which cup? (Add more in edit)</label>
                <select className="form-input" value={selectedCupId}
                  onChange={e => setSelectedCupId(e.target.value)}>
                  <option value="">Select a cup…</option>
                  {cups.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="button" className="btn-add" onClick={createActivity}
                disabled={!newActivity.trim() || !selectedCupId}>
                <span className="mi" style={{fontSize:18}}>add</span>Add
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── CUP HISTORY MODAL ── */}
      {selectedCup && (
        <div className="overlay" onClick={() => setSelectedCup(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <div className="modal-title">
                  <span style={{
                    display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width:30, height:30, borderRadius:8,
                    background: rgba(selectedCup.color, 0.12), color: selectedCup.color,
                  }}>
                    <span className="mi" style={{fontSize:16}}>{vesselIcon(selectedCup.icon)}</span>
                  </span>
                  {selectedCup.name}
                </div>
                <div className="modal-sub">
                  {Math.round((selectedCup.current_level / selectedCup.max_level) * 100)}% full
                  · {selectedCup.current_level} / {selectedCup.max_level}
                </div>
              </div>
              <button className="btn-close" onClick={() => setSelectedCup(null)}>
                <span className="mi" style={{fontSize:18}}>close</span>
              </button>
            </div>
            <div style={{height:6, background:'var(--ink-10)', borderRadius:99, marginBottom:24, overflow:'hidden'}}>
              <div style={{
                height:'100%', borderRadius:99, background: selectedCup.color,
                width:`${Math.round((selectedCup.current_level/selectedCup.max_level)*100)}%`,
                transition:'width 0.6s var(--ease)'
              }}/>
            </div>
            <div style={{display:'flex', justifyContent:'center', marginBottom:20}}>
              <Vessel icon={selectedCup.icon} color={selectedCup.color}
                pct={Math.round((selectedCup.current_level/selectedCup.max_level)*100)}/>
            </div>
            <div className="divider"/>
            <div style={{fontSize:13, fontWeight:600, color:'var(--ink-60)', marginBottom:8}}>Activity history</div>
            {cupHistory.length === 0
              ? <div className="empty" style={{padding:'16px 0'}}>Nothing logged yet — go fill this cup!</div>
              : cupHistory.map(h => (
                <div key={h.id} className="history-row">
                  <span className="history-act">{h.activities?.name}</span>
                  <span className="history-ts">{fmtDate(h.created_at)}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* ── CUP ADD / EDIT MODAL ── */}
      {cupModalOpen && (
        <CupModal
          cup={editingCup}
          userId={session.user.id}
          onClose={() => { setCupModalOpen(false); setEditingCup(null) }}
          onSave={async () => { setCupModalOpen(false); setEditingCup(null); await reload(); showToast(editingCup ? 'Cup updated' : 'Cup added!') }}
          onDelete={async () => { setCupModalOpen(false); setEditingCup(null); await reload(); showToast('Cup deleted') }}
        />
      )}

      {/* ── EDIT ACTIVITY MODAL ── */}
      {editingActivity && (
        <div className="overlay" onClick={() => setEditingActivity(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <div className="modal-title">Edit activity</div>
                <div className="modal-sub">Update name or which cups it fills</div>
              </div>
              <button className="btn-close" onClick={() => setEditingActivity(null)}>
                <span className="mi" style={{fontSize:18}}>close</span>
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Activity name</label>
                <input className="form-input" value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fills which cups?</label>
                <div className="cup-checkbox-list">
                  {cups.map(cup => {
                    const selected = editCupIds.includes(cup.id)
                    return (
                      <div key={cup.id}
                        className={`cup-checkbox-item${selected ? ' selected' : ''}`}
                        onClick={() => toggleEditCup(cup.id)}>
                        <div className="cup-checkbox-dot" style={{background: cup.color}}/>
                        <span className="cup-checkbox-name">{cup.name}</span>
                        <div className="cup-checkbox-tick">
                          {selected && <span className="mi" style={{fontSize:14}}>check</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* #1: delete button lives here in the edit modal */}
              <div className="modal-actions">
                <button className="btn-danger" onClick={() => deleteActivity(editingActivity.id)}>
                  Delete
                </button>
                <button className="btn-outline" onClick={() => setEditingActivity(null)}>Cancel</button>
                <button className="btn-fill" onClick={saveEdit} disabled={!editName.trim()}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="toast">
          <span className="mi" style={{fontSize:16, color:'var(--teal)'}}>check_circle</span>
          {toast}
        </div>
      )}
    </>
  )
}