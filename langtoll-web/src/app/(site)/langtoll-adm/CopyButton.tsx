'use client';
// Copy-to-clipboard island for the admin. The text is rendered server-side (the same string
// the CSV/text export uses) and only the click lives on the client, so the page stays a
// server component. Falls back to a textarea+execCommand where the async clipboard API is
// unavailable (plain-http dev hosts).
import { useState } from 'react';
import { BRAND } from './brand';

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'fail'>('idle');
  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setState('done');
    } catch {
      setState('fail');
    }
    setTimeout(() => setState('idle'), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      style={{
        padding: '6px 12px',
        fontSize: 13,
        fontWeight: 600,
        border: `1px solid ${BRAND.line}`,
        borderRadius: 8,
        background: state === 'done' ? BRAND.pine : state === 'fail' ? BRAND.danger : BRAND.surface,
        color: state === 'idle' ? BRAND.ink : BRAND.onAccent,
        cursor: 'pointer',
      }}
    >
      {state === 'done' ? 'Copied' : state === 'fail' ? 'Copy failed' : label}
    </button>
  );
}
