// Source-level guard for the bug that broke the buy button in builds 46 and 47
// (2026-10-01): PressableScale and Button call `onPress` WITH the touch event, so
// `onPress={buy}` on a `buy(pkg = current)` passed the event as the package and
// tried to purchase it. Components do not render under this jest setup (node,
// lib only), so the check is on the source: any function declared with a
// parameter in a screen or component must not be handed to onPress bare.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

describe('press handlers', () => {
  const root = join(__dirname, '..');
  const files = [...walk(join(root, 'app')), ...walk(join(root, 'components'))];

  it('never passes a parameterised function bare to onPress', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      // function foo(a…) / async function foo(a…) / const foo = (a…) =>, params non-empty
      const withParams = new Set<string>();
      for (const m of src.matchAll(/(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(\s*([^)]*?)\s*\)/g)) {
        if (m[2]!.trim()) withParams.add(m[1]!);
      }
      for (const m of src.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(\s*([^)]*?)\s*\)\s*=>/g)) {
        if (m[2]!.trim()) withParams.add(m[1]!);
      }
      for (const m of src.matchAll(/onPress=\{([A-Za-z_$][\w$]*)\}/g)) {
        if (withParams.has(m[1]!)) offenders.push(`${file.slice(root.length + 1)}: onPress={${m[1]}} (takes a parameter)`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('covers the paywall', () => {
    expect(files.some((f) => f.endsWith('components/paywall/PlusOffer.tsx'))).toBe(true);
  });
});
