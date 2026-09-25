// Which courses the picker offers, by the phone's language.
import { learnableLanguages, availableLanguages, soonLanguages } from '@/content';

describe('learnableLanguages', () => {
  test('a German phone is offered German — last, so it is never the preselected first entry', () => {
    const langs = learnableLanguages('de');
    expect(langs).toContain('de');
    expect(langs[langs.length - 1]).toBe('de');
    expect(langs[0]).not.toBe('de');
    expect(langs).toHaveLength(availableLanguages().length);
  });

  test('every non-English phone gets English first (the preselected course) and its own language last', () => {
    for (const ui of ['de', 'pt', 'es', 'fr', 'it'] as const) {
      const langs = learnableLanguages(ui);
      expect(langs[0]).toBe('en');
      expect(langs[langs.length - 1]).toBe(ui);
    }
  });

  test('an English phone gets German first', () => {
    expect(learnableLanguages('en')[0]).toBe('de');
  });

  test('an English phone is not offered English: meanings fall back to English, so that course cannot work', () => {
    const langs = learnableLanguages('en');
    expect(langs).not.toContain('en');
    expect(langs).toHaveLength(availableLanguages().length - 1);
  });

  test('a phone language we do not ship: English first, then everything else', () => {
    const langs = learnableLanguages('ja');
    expect(langs[0]).toBe('en');
    expect([...langs].sort()).toEqual([...availableLanguages()].sort());
  });

  test('SOON never lists a shipped course', () => {
    const shipped = new Set(availableLanguages());
    for (const l of soonLanguages('de')) expect(shipped.has(l)).toBe(false);
  });
});
