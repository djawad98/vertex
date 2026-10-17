'use client';
import { useEffect, useState } from 'react';

// Visitor's choice lives in localStorage ('light' | 'dark'); no entry means follow the system.
type Choice = 'system' | 'light' | 'dark';
const KEY = 'theme';
const sys = () => matchMedia('(prefers-color-scheme: light)');

// Runs inline in <head> before first paint, so the page never flashes the wrong theme.
export const themeScript = `(function(){try{var c=localStorage.getItem('${KEY}')}catch(e){}var t=c==='light'||c==='dark'?c:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t;var m=document.querySelectorAll('meta[name=theme-color]');for(var i=0;i<m.length;i++)m[i].setAttribute('content',t==='light'?'#f6f8fa':'#0f141b');})()`;

function apply(choice: Choice) {
  const t = choice === 'system' ? (sys().matches ? 'light' : 'dark') : choice;
  document.documentElement.dataset.theme = t;
  document.querySelectorAll('meta[name=theme-color]').forEach((m) => m.setAttribute('content', t === 'light' ? '#f6f8fa' : '#0f141b'));
  dispatchEvent(new Event('themechange'));
}

const icons: Record<Choice, React.ReactNode> = {
  system: <><rect x="2" y="3" width="12" height="8.5" rx="1.5" /><path d="M5.5 14h5M8 11.5V14" /></>,
  light: <><circle cx="8" cy="8" r="3" /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" /></>,
  dark: <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" />,
};
const labels: Record<Choice, string> = { system: 'System', light: 'Light', dark: 'Dark' };

export default function ThemeSwitch() {
  const [choice, setChoice] = useState<Choice>('system');

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch {}
    if (saved === 'light' || saved === 'dark') setChoice(saved);
  }, []);

  // While on "system", follow OS changes live.
  useEffect(() => {
    if (choice !== 'system') return;
    const m = sys();
    const on = () => apply('system');
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [choice]);

  const pick = (c: Choice) => {
    setChoice(c);
    try { c === 'system' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, c); } catch {}
    apply(c);
  };

  return (
    <div className="theme-switch" role="radiogroup" aria-label="Color theme">
      {(Object.keys(labels) as Choice[]).map((c) => (
        <button key={c} type="button" role="radio" aria-checked={choice === c} onClick={() => pick(c)}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[c]}</svg>
          {labels[c]}
        </button>
      ))}
    </div>
  );
}
