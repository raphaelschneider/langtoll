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

  test('every other phone language works the same way', () => {
    for (const ui of ['pt', 'es', 'fr', 'it'] as const) {
      const langs = learnableLanguages(ui);
      expect(langs[langs.length - 1]).toBe(ui);
      expect(langs[0]).not.toBe(ui);
    }
  });

  test('an English phone is not offered English: meanings fall back to English, so that course cannot work', () => {
    const langs = learnableLanguages('en');
    expect(langs).not.toContain('en');
    expect(langs).toHaveLength(availableLanguages().length - 1);
  });

  test('a phone language we do not ship changes nothing', () => {
    expect(learnableLanguages('ja')).toEqual(availableLanguages());
  });

  test('SOON never lists a shipped course', () => {
    const shipped = new Set(availableLanguages());
    for (const l of soonLanguages('de')) expect(shipped.has(l)).toBe(false);
  });
});
