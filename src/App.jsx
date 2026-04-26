import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

/* ─────────────────────────────────────────────────────────────────
   GLOBAL STYLES
   ───────────────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:        #0f1117;
      --ink-80:     #1e2130;
      --ink-60:     #3d4257;
      --ink-40:     #7b8099;
      --ink-20:     #b8bccc;
      --ink-10:     #e4e6ef;
      --ink-05:     #f4f5f9;
      --white:      #ffffff;
      --teal:       #00b4a6;
      --teal-light: #e0f7f5;
      --teal-dark:  #007d72;
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
  font-family: 'Material Icons Round';
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;

  display: inline-block;
  white-space: nowrap;
  direction: ltr;

  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

    /* AUTH */
    .auth-wrap {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #dff8f6 0%, #f7f8fc 55%, #eef0fb 100%);
    }
    .auth-card {
      background: var(--white); border-radius: var(--r-2xl);
      padding: 52px 48px; width: 420px; box-shadow: var(--sh-lg); text-align: center;
    }
    .auth-logo {
      display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 36px;
    }
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

    /* SHELL */
    .app-shell { max-width: 1040px; margin: 0 auto; padding: 0 24px 80px; }

    /* TOPBAR */
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 0 16px; border-bottom: 1px solid var(--border); margin-bottom: 36px;
    }
    .wordmark { display: flex; align-items: center; gap: 10px; }
    .wordmark-icon {
      width: 36px; height: 36px; background: var(--teal); border-radius: 10px;
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

    /* GREETING */
    .greeting { margin-bottom: 40px; }
    .greeting-h { font-size: 28px; font-weight: 700; color: var(--ink); letter-spacing: -0.6px; margin-bottom: 4px; }
    .greeting-sub { font-size: 14px; color: var(--ink-40); }

    /* SECTION */
    .section { margin-bottom: 44px; }
    .section-label {
      font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
      color: var(--ink-40); display: flex; align-items: center; gap: 6px; margin-bottom: 14px;
    }

    /* CUPS */
    .cups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
    .cup-card {
      background: var(--card); border-radius: var(--r-xl);
      padding: 22px 18px 18px; border: 1.5px solid var(--border);
      cursor: pointer; transition: transform var(--t), box-shadow var(--t), border-color var(--t);
      position: relative; overflow: hidden;
    }
    .cup-card:hover { transform: translateY(-4px); box-shadow: var(--sh-md); border-color: transparent; }
    .cup-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
    .cup-name { font-size: 13px; font-weight: 600; color: var(--ink); line-height: 1.3; }
    .cup-pct { font-size: 13px; font-weight: 700; }
    .cup-vessel { display: flex; justify-content: center; margin-bottom: 12px; }
    .cup-track { height: 5px; background: var(--ink-10); border-radius: 99px; overflow: hidden; }
    .cup-fill { height: 100%; border-radius: 99px; transition: width 0.7s var(--ease); }
    .cup-meta { font-size: 11px; color: var(--ink-40); text-align: center; margin-top: 7px; }

    /* SUGGESTIONS */
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

    /* ACTIVITIES */
    .activity-list { display: flex; flex-direction: column; gap: 6px; }
    .activity-item {
      display: flex; align-items: center; gap: 12px; padding: 13px 16px;
      background: var(--card); border: 1.5px solid var(--border); border-radius: var(--r-md);
      transition: border-color var(--t), box-shadow var(--t);
    }
    .activity-item:hover { border-color: var(--ink-10); box-shadow: var(--sh-xs); }
    .activity-pip { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .activity-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--ink); }
    .activity-chip { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 99px; white-space: nowrap; }
    .activity-btns { display: flex; gap: 4px; }
    .icon-btn {
      width: 32px; height: 32px; border: none; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--t); background: transparent; color: var(--ink-40);
    }
    .icon-btn:hover { background: var(--ink-05); color: var(--ink); }
    .icon-btn.run:hover { background: var(--teal-light); color: var(--teal-dark); }
    .icon-btn.del:hover { background: #fde8e8; color: #d03030; }

    /* CREATE */
    .create-card {
      background: var(--card); border: 1.5px solid var(--border);
      border-radius: var(--r-xl); padding: 28px;
    }
    .create-form { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; margin-top: 16px; }
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
      transition: all var(--t); white-space: nowrap;
    }
    .btn-add:hover { background: var(--teal-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,180,166,0.28); }
    .btn-add:disabled { background: var(--ink-10); color: var(--ink-40); cursor: not-allowed; transform: none; box-shadow: none; }

    /* MODAL */
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
      max-height: 82vh; overflow-y: auto; box-shadow: var(--sh-lg);
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

    /* TOAST */
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
   VESSEL SVG COMPONENTS  (viewBox 80×96 each, scaled via width/height)
   ───────────────────────────────────────────────────────────────── */

// Mug — classic chunky mug with handle
function MugSVG({ color, pct }) {
  const top = 14, h = 64, filled = (pct / 100) * h, y = top + h - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs><clipPath id={`m${color}`}><rect x="10" y={top} width="50" height={h} rx="3"/></clipPath></defs>
      <rect x="10" y={y} width="50" height={filled} fill={color} opacity="0.2" clipPath={`url(#m${color})`}/>
      {filled > 4 && <rect x="10" y={y} width="50" height="3" fill={color} opacity="0.4" clipPath={`url(#m${color})`}/>}
      <rect x="10" y={top} width="50" height={h} rx="6" stroke={color} strokeWidth="2.5" fill="none"/>
      <rect x="8" y="10" width="54" height="8" rx="4" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="8" y="10" width="54" height="8" rx="4" fill={color} opacity="0.1"/>
      <path d="M60 30 C74 30 74 62 60 62" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <rect x="14" y="78" width="42" height="5" rx="2.5" fill={color} opacity="0.15"/>
    </svg>
  )
}

// Teacup — elegant shallow cup on saucer with steam
function TeacupSVG({ color, pct }) {
  const top = 26, h = 42, filled = (pct / 100) * h, y = top + h - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs>
        <clipPath id={`tc${color}`}>
          <path d="M16 26 Q14 68 20 70 L56 70 Q62 68 60 26 Z"/>
        </clipPath>
      </defs>
      {/* steam */}
      <path d="M28 14 Q30 8 28 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
      <path d="M38 12 Q40 6 38 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"/>
      <path d="M48 14 Q50 8 48 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
      {/* liquid */}
      <rect x="16" y={y} width="44" height={filled} fill={color} opacity="0.2" clipPath={`url(#tc${color})`}/>
      {/* cup */}
      <path d="M16 26 Q14 68 20 70 L56 70 Q62 68 60 26 Z" stroke={color} strokeWidth="2.5" fill="none"/>
      <ellipse cx="38" cy="26" rx="22" ry="5" stroke={color} strokeWidth="2" fill="none"/>
      <ellipse cx="38" cy="26" rx="22" ry="5" fill={color} opacity="0.1"/>
      {/* handle */}
      <path d="M60 38 Q72 38 72 50 Q72 62 60 60" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* saucer */}
      <ellipse cx="38" cy="78" rx="30" ry="6" stroke={color} strokeWidth="2" fill="none"/>
      <ellipse cx="38" cy="78" rx="30" ry="6" fill={color} opacity="0.08"/>
      <ellipse cx="38" cy="76" rx="14" ry="3" fill={color} opacity="0.1"/>
    </svg>
  )
}

// Wine glass — elegant long-stemmed
function WineGlassSVG({ color, pct }) {
  const top = 6, bowlH = 44, filled = (pct / 100) * bowlH, y = top + bowlH - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs>
        <clipPath id={`wg${color}`}>
          <path d="M22 6 L18 50 Q18 56 40 56 Q62 56 58 50 L54 6 Z"/>
        </clipPath>
      </defs>
      <rect x="18" y={y} width="40" height={filled} fill={color} opacity="0.25" clipPath={`url(#wg${color})`}/>
      {pct > 5 && <rect x="18" y={y} width="40" height="3" fill={color} opacity="0.4" clipPath={`url(#wg${color})`}/>}
      {/* bowl */}
      <path d="M22 6 L18 50 Q18 56 40 56 Q62 56 58 50 L54 6 Z" stroke={color} strokeWidth="2.5" fill="none"/>
      <line x1="22" y1="6" x2="54" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* stem */}
      <line x1="40" y1="56" x2="40" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* base */}
      <line x1="22" y1="84" x2="58" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="40" cy="86" rx="18" ry="4" fill={color} opacity="0.12"/>
      {/* shine */}
      <path d="M28 14 Q29 26 28 34" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/>
    </svg>
  )
}

// Bowl — wide shallow bowl
function BowlSVG({ color, pct }) {
  const filled = (pct / 100) * 36
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <defs>
        <clipPath id={`bl${color}`}>
          <path d="M8 34 Q8 68 40 68 Q72 68 72 34 Z"/>
        </clipPath>
      </defs>
      <rect x="8" y={34 + 34 - filled} width="64" height={filled + 8} fill={color} opacity="0.2" clipPath={`url(#bl${color})`}/>
      <path d="M8 34 Q8 68 40 68 Q72 68 72 34 Z" stroke={color} strokeWidth="2.5" fill="none"/>
      <ellipse cx="40" cy="34" rx="32" ry="7" stroke={color} strokeWidth="2" fill="none"/>
      <ellipse cx="40" cy="34" rx="32" ry="7" fill={color} opacity="0.1"/>
      <ellipse cx="40" cy="68" rx="13" ry="3" fill={color} opacity="0.18"/>
    </svg>
  )
}

// Pint glass — straight-sided, slight taper
function PintGlassSVG({ color, pct }) {
  const top = 10, h = 66, filled = (pct / 100) * h, y = top + h - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs><clipPath id={`pg${color}`}><path d="M18 10 L12 76 L64 76 L58 10 Z"/></clipPath></defs>
      <rect x="12" y={y} width="52" height={filled} fill={color} opacity="0.22" clipPath={`url(#pg${color})`}/>
      {pct > 70 && (
        <path d={`M12 ${y} Q36 ${y - 7} 64 ${y}`} fill="white" opacity="0.55" clipPath={`url(#pg${color})`}/>
      )}
      <path d="M18 10 L12 76 L64 76 L58 10 Z" stroke={color} strokeWidth="2.5" fill="none"/>
      <line x1="18" y1="10" x2="58" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="10" y="76" width="56" height="5" rx="2.5" fill={color} opacity="0.18"/>
      {/* level line at 2/3 */}
      <line x1="16" y1="42" x2="60" y2="42" stroke={color} strokeWidth="1" opacity="0.15" strokeDasharray="3 3"/>
    </svg>
  )
}

// Coffee takeaway cup
function CoffeeCupSVG({ color, pct }) {
  const top = 18, h = 58, filled = (pct / 100) * h, y = top + h - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs><clipPath id={`cc${color}`}><path d="M14 18 L18 76 Q18 80 40 80 Q62 80 62 76 L66 18 Z"/></clipPath></defs>
      <rect x="14" y={y} width="52" height={filled} fill={color} opacity="0.2" clipPath={`url(#cc${color})`}/>
      <path d="M14 18 L18 76 Q18 80 40 80 Q62 80 62 76 L66 18 Z" stroke={color} strokeWidth="2.5" fill="none"/>
      {/* lid */}
      <rect x="12" y="12" width="56" height="10" rx="5" fill={color} opacity="0.15"/>
      <rect x="12" y="12" width="56" height="10" rx="5" stroke={color} strokeWidth="2" fill="none"/>
      {/* sip lid */}
      <rect x="30" y="9" width="20" height="7" rx="3.5" fill={color} opacity="0.25"/>
      {/* sleeve */}
      <line x1="18" y1="50" x2="62" y2="50" stroke={color} strokeWidth="1" opacity="0.15" strokeDasharray="4 3"/>
      <line x1="18" y1="58" x2="62" y2="58" stroke={color} strokeWidth="1" opacity="0.15" strokeDasharray="4 3"/>
      {/* base */}
      <rect x="14" y="80" width="52" height="5" rx="2.5" fill={color} opacity="0.18"/>
    </svg>
  )
}

// Champagne flute
function FluteSVG({ color, pct }) {
  const top = 4, bowlH = 52, filled = (pct / 100) * bowlH, y = top + bowlH - filled
  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
      <defs>
        <clipPath id={`fl${color}`}>
          <path d="M30 4 L26 56 Q26 60 40 60 Q54 60 50 56 L46 4 Z"/>
        </clipPath>
      </defs>
      <rect x="26" y={y} width="28" height={filled} fill={color} opacity="0.28" clipPath={`url(#fl${color})`}/>
      {pct > 5 && <rect x="26" y={y} width="28" height="3" fill={color} opacity="0.5" clipPath={`url(#fl${color})`}/>}
      {/* bubbles when >20% */}
      {pct > 20 && <>
        <circle cx="33" cy={y + filled * 0.7} r="1.5" fill={color} opacity="0.5"/>
        <circle cx="40" cy={y + filled * 0.4} r="1" fill={color} opacity="0.4"/>
        <circle cx="47" cy={y + filled * 0.6} r="1.5" fill={color} opacity="0.5"/>
      </>}
      <path d="M30 4 L26 56 Q26 60 40 60 Q54 60 50 56 L46 4 Z" stroke={color} strokeWidth="2.5" fill="none"/>
      <line x1="30" y1="4" x2="46" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="60" x2="40" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="84" x2="56" y2="84" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="40" cy="86" rx="16" ry="3.5" fill={color} opacity="0.12"/>
    </svg>
  )
}

// Vessel router
function Vessel({ icon, color, pct }) {
  const c = color || '#00b4a6'
  const p = Math.min(100, Math.max(0, Math.round(pct)))
  switch ((icon || '').toLowerCase()) {
    case 'teacup':           return <TeacupSVG    color={c} pct={p}/>
    case 'glass':
    case 'wineglass':
    case 'wine':             return <WineGlassSVG color={c} pct={p}/>
    case 'bowl':             return <BowlSVG      color={c} pct={p}/>
    case 'pint':             return <PintGlassSVG color={c} pct={p}/>
    case 'coffee':
    case 'takeaway':         return <CoffeeCupSVG color={c} pct={p}/>
    case 'flute':
    case 'champagne':        return <FluteSVG     color={c} pct={p}/>
    case 'mug':
    default:                 return <MugSVG       color={c} pct={p}/>
  }
}

// Material Icon per vessel type
function vesselIcon(icon) {
  switch ((icon || '').toLowerCase()) {
    case 'teacup':   return 'emoji_food_beverage'
    case 'glass':
    case 'wineglass':
    case 'wine':     return 'wine_bar'
    case 'bowl':     return 'soup_kitchen'
    case 'pint':     return 'local_bar'
    case 'coffee':
    case 'takeaway': return 'coffee'
    case 'flute':
    case 'champagne':return 'celebration'
    default:         return 'local_cafe'
  }
}

/* ─── helpers ─── */
function rgba(hex, a) {
  if (!hex || hex.length < 7) return `rgba(0,180,166,${a})`
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function fmtDate(s) {
  return new Date(s).toLocaleString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
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
  const [selectedCup, setSelectedCup] = useState(null)
  const [cupHistory, setCupHistory] = useState([])
  const [newActivity, setNewActivity] = useState('')
  const [selectedCupId, setSelectedCupId] = useState('')
  const [editingActivity, setEditingActivity] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCupId, setEditCupId] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => l.subscription.unsubscribe()
  }, [])

  useEffect(() => { if (session?.user?.id) reload() }, [session])

  const reload = async () => {
    const uid = session.user.id
    const [cr, ar, lr] = await Promise.all([
      supabase.from('cups').select('*').eq('user_id', uid).order('display_order'),
      supabase.from('activities').select('*').eq('user_id', uid),
      supabase.from('activity_cups').select('*'),
    ])
    setCups(cr.data || [])
    setActivities((ar.data || []).filter(a => !a.deleted).sort((a,b) => a.name.localeCompare(b.name)))
    setActivityLinks(lr.data || [])
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const signIn = async () => { await supabase.auth.signInWithOtp({ email }); showToast('Magic link sent — check your email') }
  const signOut = async () => { await supabase.auth.signOut(); setSession(null) }

  const createActivity = async () => {
    if (!newActivity.trim() || !selectedCupId) return
    const { data: a } = await supabase.from('activities')
      .insert({ user_id: session.user.id, name: newActivity, deleted: false })
      .select().single()
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
    const { data } = await supabase.from('activity_cups').select('*').eq('activity_id', a.id).maybeSingle()
    setEditCupId(data?.cup_id || '')
  }

  const saveEdit = async () => {
    await supabase.from('activities').update({ name: editName }).eq('id', editingActivity.id)
    await supabase.from('activity_cups').delete().eq('activity_id', editingActivity.id)
    if (editCupId) await supabase.from('activity_cups').insert({ activity_id: editingActivity.id, cup_id: editCupId, value: 1 })
    setEditingActivity(null); await reload(); showToast('Activity updated')
  }

  const deleteActivity = async (id) => { await supabase.from('activities').update({ deleted: true }).eq('id', id); await reload() }

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

  const getCupForActivity = (actId) => {
    const link = activityLinks.find(l => l.activity_id === actId)
    return link ? cups.find(c => c.id === link.cup_id) : null
  }

  /* ── AUTH ── */
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

  return (
    <>
      <GlobalStyle/>
      <div className="app-shell">

        <nav className="topbar">
          <div className="wordmark">
            <div className="wordmark-icon"><span className="mi" style={{fontSize:18}}>local_cafe</span></div>
            <span className="wordmark-text">Fill Your Cup</span>
          </div>
          <button className="btn-ghost" onClick={signOut}>
            <span className="mi" style={{fontSize:16}}>logout</span>Sign out
          </button>
        </nav>

        <div className="greeting">
          <div className="greeting-h">{greeting()} 👋</div>
          <div className="greeting-sub">
            {cups.length > 0
              ? `You have ${cups.length} cup${cups.length !== 1 ? 's' : ''} to tend to today.`
              : 'Add your cups and activities to get started.'}
          </div>
        </div>

        {/* CUPS */}
        {cups.length > 0 && (
          <div className="section">
            <div className="section-label">
              <span className="mi">water_full</span>Your cups
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
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="section">
            <div className="section-label">
              <span className="mi">auto_awesome</span>Recommended for you
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
                  <span className="mi suggest-arrow">arrow_forward</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        <div className="section">
          <div className="section-label">
            <span className="mi" style={{fontSize:13}}>format_list_bulleted</span>All activities
          </div>
          {activities.length === 0
            ? <div className="empty"><span className="mi" style={{fontSize:32, display:'block', marginBottom:8, color:'var(--ink-20)'}}>add_circle</span>No activities yet — add one below</div>
            : (
              <div className="activity-list">
                {activities.map(a => {
                  const cup = getCupForActivity(a.id)
                  return (
                    <div key={a.id} className="activity-item">
                      <div className="activity-pip" style={{background: cup?.color || 'var(--ink-20)'}}/>
                      <div className="activity-name">{a.name}</div>
                      {cup && (
                        <div className="activity-chip" style={{background: rgba(cup.color, 0.10), color: cup.color}}>
                          {cup.name}
                        </div>
                      )}
                      <div className="activity-btns">
                        <button className="icon-btn run" onClick={() => runActivity(a.id)} title="Log this">
                          <span className="mi" style={{fontSize:18}}>play_circle</span>
                        </button>
                        <button className="icon-btn" onClick={() => startEdit(a)} title="Edit">
                          <span className="mi" style={{fontSize:17}}>edit</span>
                        </button>
                        <button className="icon-btn del" onClick={() => deleteActivity(a.id)} title="Delete">
                          <span className="mi" style={{fontSize:17}}>delete</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
        </div>

        {/* CREATE */}
        <div className="section">
          <div className="create-card">
            <div className="section-label" style={{marginBottom:0}}>
              <span className="mi" style={{fontSize:13}}>add_circle</span>Add an activity
            </div>
            <div className="create-form">
              <div className="form-group" style={{flex:2}}>
                <label className="form-label">Activity name</label>
                <input className="form-input" value={newActivity}
                  onChange={e => setNewActivity(e.target.value)}
                  placeholder="e.g. Morning run, Call a friend, Read…"
                  onKeyDown={e => e.key === 'Enter' && createActivity()}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fills which cup?</label>
                <select className="form-input" value={selectedCupId} onChange={e => setSelectedCupId(e.target.value)}>
                  <option value="">Select a cup…</option>
                  {cups.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button className="btn-add" onClick={createActivity} disabled={!newActivity.trim() || !selectedCupId}>
                <span className="mi" style={{fontSize:18}}>add</span>Add
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* CUP HISTORY MODAL */}
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
            <div style={{fontSize:11, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:'var(--ink-40)', marginBottom:4}}>
              Activity history
            </div>
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

      {/* EDIT MODAL */}
      {editingActivity && (
        <div className="overlay" onClick={() => setEditingActivity(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <div className="modal-title">Edit activity</div>
                <div className="modal-sub">Update name or which cup it fills</div>
              </div>
              <button className="btn-close" onClick={() => setEditingActivity(null)}>
                <span className="mi" style={{fontSize:18}}>close</span>
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Activity name</label>
                <input className="form-input" value={editName} onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}/>
              </div>
              <div className="form-group">
                <label className="form-label">Fills which cup?</label>
                <select className="form-input" value={editCupId} onChange={e => setEditCupId(e.target.value)}>
                  <option value="">No cup</option>
                  {cups.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn-outline" onClick={() => setEditingActivity(null)}>Cancel</button>
                <button className="btn-fill" onClick={saveEdit}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          <span className="mi" style={{fontSize:16, color:'var(--teal)'}}>check_circle</span>
          {toast}
        </div>
      )}
    </>
  )
}