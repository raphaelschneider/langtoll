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

  test('Spanish is first (the preselected course) on every phone that is not Spanish, own language last', () => {
    for (const ui of ['de', 'pt', 'fr', 'it', 'en'] as const) {
      expect(learnableLanguages(ui)[0]).toBe('es');
    }
    for (const ui of ['de', 'pt', 'fr', 'it'] as const) {
      const langs = learnableLanguages(ui);
      expect(langs[langs.length - 1]).toBe(ui);
    }
  });

  test('a Spanish phone gets the next course first and Spanish last', () => {
    const langs = learnableLanguages('es');
    expect(langs[0]).not.toBe('es');
    expect(langs[langs.length - 1]).toBe('es');
  });

  test('an English phone is not offered English: meanings fall back to English, so that course cannot work', () => {
    const langs = learnableLanguages('en');
    expect(langs).not.toContain('en');
    expect(langs).toHaveLength(availableLanguages().length - 1);
  });

  test('a phone language we do not ship: Spanish first, then everything else', () => {
    const langs = learnableLanguages('ja');
    expect(langs[0]).toBe('es');
    expect([...langs].sort()).toEqual([...availableLanguages()].sort());
  });

  test('SOON never lists a shipped course', () => {
    const shipped = new Set(availableLanguages());
    for (const l of soonLanguages('de')) expect(shipped.has(l)).toBe(false);
  });
});
