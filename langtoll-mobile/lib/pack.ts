// Resolves the pack the user actually trains on: their language + CEFR level's
// bundled pack, plus the AI topic pack merged in when one is generated and enabled.
import { packFor, type LanguagePack, type Level, type VocabItem, type SentenceItem } from '@/content';
import { getState } from '@/lib/store';
import { resolvedLocale } from '@/lib/i18n';
import { sanitizeTopic } from '@/lib/ai/topics';
import { poolItems } from '@/lib/ai/pool';
import { FALLBACK_LOCALE, type LocaleCode } from '@/lib/locales';

/** Onboarding difficulty (1–10) → CEFR level. Four bands since B2 landed. */
export function levelForDifficulty(d: number): Level {
  if (d <= 3) return 'A1';
  if (d <= 6) return 'A2';
  if (d <= 8) return 'B1';
  return 'B2';
}

// Packs are authored with English in `en` and every other UI locale under
// `gloss`. Rather than thread a locale through the whole trainer, we resolve it
// once here: the returned pack has the user's locale sitting in `en`, so
// engine.ts keeps its single "side the user reads" slot and needs no changes.
// Items with no gloss for the locale keep English — a half-translated pack
// degrades word by word instead of failing.
const localized = new Map<string, LanguagePack>();

function localizePack(pack: LanguagePack, locale: LocaleCode): LanguagePack {
  if (locale === FALLBACK_LOCALE) return pack;
  const key = `${pack.id}:${locale}`;
  const hit = localized.get(key);
  if (hit) return hit;
  const out: LanguagePack = {
    ...pack,
    vocab: pack.vocab.map((v) => {
      const g = v.gloss?.[locale];
      return g && g.length ? { ...v, en: g } : v;
    }),
    sentences: pack.sentences.map((s) => {
      const g = s.gloss?.[locale];
      return g ? { ...s, en: g } : s;
    }),
  };
  localized.set(key, out);
  return out;
}

// Same swap localizePack applies to bundled items, for items that arrive OUTSIDE
// the bundled pack — the pool and custom topics. These were appended after
// localizePack ran, so their glosses were never consulted and a Portuguese user
// saw English hints on every AI exercise while bundled ones localized correctly.
function localizeItems<V extends VocabItem[], S extends SentenceItem[]>(
  vocab: V,
  sentences: S,
  locale: LocaleCode
): { vocab: VocabItem[]; sentences: SentenceItem[] } {
  if (locale === FALLBACK_LOCALE) return { vocab, sentences };
  return {
    vocab: vocab.map((v) => {
      const g = v.gloss?.[locale];
      return g && g.length ? { ...v, en: g } : v;
    }),
    sentences: sentences.map((s) => {
      const g = s.gloss?.[locale];
      return g ? { ...s, en: g } : s;
    }),
  };
}

/**
 * Keep only the speaker-gendered variants matching the learner's chosen forms.
 * With forms unset (or 'both' semantics) everything stays — the annotations on
 * the items do the explaining. The voice never changes either way: the same
 * teacher reads whichever form the learner is being taught.
 */
function filterPackForForms(pack: LanguagePack, forms: 'm' | 'f' | null): LanguagePack {
  if (!forms) return pack;
  const keep = (g?: 'm' | 'f') => !g || g === forms;
  return {
    ...pack,
    vocab: pack.vocab.filter((v) => keep(v.speakerGender)),
    sentences: pack.sentences.filter((x) => keep(x.speakerGender)),
  };
}

export function activePack(): LanguagePack {
  const s = getState();
  const locale = resolvedLocale();
  const base = localizePack(packFor(s.learningLanguage, s.level), locale);

  // The generated pool, merged for EVERYONE. The bundled packs alone are a few
  // hundred items per level, which a heavy user exhausts in days — this is what
  // stops the same sentence coming round every session. Read synchronously from
  // the in-memory cache (see lib/ai/pool), so a session never waits on network
  // and works offline once synced. Localized here because it bypasses
  // localizePack entirely.
  const rawPool = poolItems(s.learningLanguage, s.level);
  const pool = localizeItems(rawPool.vocab, rawPool.sentences, locale);

  // Sanitize on every load: packs generated before the blank-detection guards
  // existed are already persisted on devices, and a bad sentence renders an
  // unanswerable exercise ("__" offered as one of the options).
  const topic = s.customTopic ? sanitizeTopic(s.customTopic) : null;
  const useTopic = !!topic && s.useCustomTopic && topic.vocab.length > 0;
  const topicItems = useTopic ? localizeItems(topic!.vocab, topic!.sentences, locale) : null;

  // The goal's pack rides along whenever it matches the active course — this
  // is what makes "Pass the B1 exam" VISIBLE in sessions rather than a label.
  const goalPack =
    s.goalPack && s.goalPack.language === s.learningLanguage && s.goalPack.level === s.level
      ? sanitizeTopic(s.goalPack)
      : null;
  const rawGoalItems =
    goalPack && goalPack.vocab.length ? localizeItems(goalPack.vocab, goalPack.sentences, locale) : null;
  // Tagged 'goal' so the trainer can guarantee them seats — merged untagged
  // they are outnumbered ~10:1 by the base pack and pool, which made the goal
  // statistically invisible in any single session.
  const goalItems = rawGoalItems
    ? {
        vocab: rawGoalItems.vocab.map((v) => ({ ...v, source: 'goal' as const })),
        sentences: rawGoalItems.sentences.map((s) => ({ ...s, source: 'goal' as const })),
      }
    : null;

  if (!topicItems && !goalItems && !pool.vocab.length && !pool.sentences.length) {
    return filterPackForForms(base, s.forms);
  }

  return filterPackForForms(
    {
      ...base,
      name: useTopic ? `${base.name} · ${topic!.name}` : base.name,
      vocab: [...base.vocab, ...pool.vocab, ...(topicItems?.vocab ?? []), ...(goalItems?.vocab ?? [])],
      sentences: [
        ...base.sentences,
        ...pool.sentences,
        ...(topicItems?.sentences ?? []),
        ...(goalItems?.sentences ?? []),
      ],
    },
    s.forms
  );
}
