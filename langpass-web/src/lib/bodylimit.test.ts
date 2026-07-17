import { describe, it, expect } from 'vitest';
import { clampChatHistory } from './bodylimit';

const msg = (role: string, content: string) => ({ role, content });

describe('clampChatHistory — the per-turn token cost guard', () => {
  it('keeps a normal conversation untouched', () => {
    const history = [msg('user', 'hi'), msg('assistant', 'hello!'), msg('user', 'my knee hurts')];
    expect(clampChatHistory(history)).toEqual(history);
  });

  it('TRUNCATES an oversized latest message instead of forwarding it whole (tampered-client abuse)', () => {
    // A single ~250KB message passes the 256KB byte cap and used to ride to OpenAI intact
    // because the latest message is always kept.
    const bomb = 'x'.repeat(250_000);
    const out = clampChatHistory([msg('user', bomb)]);
    expect(out).toHaveLength(1);
    const content = (out[0] as { content: string }).content;
    expect(content.length).toBeLessThan(7_000);
    expect(content.endsWith('…[truncated]')).toBe(true);
  });

  it('truncates oversized messages mid-history too', () => {
    const out = clampChatHistory([msg('user', 'y'.repeat(50_000)), msg('user', 'latest')]);
    expect((out[0] as { content: string }).content.length).toBeLessThan(7_000);
    expect((out[1] as { content: string }).content).toBe('latest');
  });

  it('bounds total history chars, always keeping the latest turn', () => {
    const history = Array.from({ length: 30 }, (_, i) => msg('user', `m${i} ` + 'z'.repeat(2_000)));
    const out = clampChatHistory(history);
    expect(out.length).toBeLessThan(30);
    expect((out[out.length - 1] as { content: string }).content).toContain('m29');
  });

  it('caps message count at 40', () => {
    const history = Array.from({ length: 80 }, (_, i) => msg('user', `m${i}`));
    expect(clampChatHistory(history)).toHaveLength(40);
  });

  it('never starts the kept window on an orphan tool message (OpenAI 400 guard)', () => {
    const history = [
      msg('tool', 'orphan result'),
      msg('assistant', 'ok'),
      msg('user', 'next'),
    ];
    const out = clampChatHistory(history);
    expect((out[0] as { role: string }).role).not.toBe('tool');
  });

  it('non-string content passes through untouched', () => {
    const weird = { role: 'user', content: [{ type: 'text', text: 'part' }] } as { role: string };
    expect(clampChatHistory([weird])[0]).toEqual(weird);
  });
});
