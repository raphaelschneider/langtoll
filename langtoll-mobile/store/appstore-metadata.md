# App Store metadata — LangToll 1.0

Everything App Store Connect asks for, written once and checked. Paste from here.
Run `python3 scripts/check-store-metadata.py` after any edit — it enforces Apple's
limits and the no-repeat rule, so nothing gets silently truncated at submission.

---

## What can be changed later, and what costs a review

| Field | Change after launch? |
|---|---|
| **Promotional text** (170) | **Any time, no review.** The only free lever. |
| Price, availability, IAP prices | Any time, no review |
| Name, Subtitle, Keywords | Only with a **new version** → full review |
| Description, Screenshots, What's New | Only with a **new version** → full review |
| Category, age rating | New version |

Consequence: treat Name/Subtitle/Keywords as near-permanent, and use Promotional
Text for anything seasonal ("New: five languages", a launch offer).

---

## How Apple actually indexes (this drives every choice below)

- Indexed for search: **Name + Subtitle + Keywords field + IAP display names**.
  The **description is NOT indexed** (that's Google Play). The description sells;
  it does not rank.
- The algorithm **combines words across those fields** into phrases. So "learn" in
  the Name plus "german" in Keywords already covers *learn german*.
- Therefore **never repeat a word** across Name/Subtitle/Keywords — a duplicate is
  a wasted character, not a ranking boost.
- Keywords field: **comma-separated, no spaces after commas** (a space costs a
  character), single words beat phrases, no plurals when the singular is there.
- Banned/wasted: competitor names (rejection risk), the word "app", your category
  name, anything already in the Name/Subtitle.
- **Each localization has its own Name/Subtitle/Keywords** — that is the single
  biggest reach multiplier available, see the localization section.

---

## English (primary — en-US)

**Name** (≤30)
```
LangToll: Learn Languages
```

**Subtitle** (≤30)
```
Unlock your apps by learning
```

**Keywords** (≤100) — no word repeats anything above
```
german,spanish,french,italian,portuguese,vocabulary,screen,time,blocker,focus,habit,practice
```

**Promotional text** (≤170, editable any time without review)
```
Five languages, one rule: the apps that eat your evenings stay locked until you practice. Tolly is at the gate.
```

**Description** (≤4000) — sells the transformation, not the feature list
```
Your doomscroll is about to teach you a language.

LangToll puts the apps that eat your evenings behind a toll gate. Want TikTok,
Instagram, YouTube? Pay the fare first: five quick exercises, sixty seconds, and
your pass is issued. Thirty minutes of phone time, earned. Then the gate closes
again.

No streak guilt. No willpower required. You will learn — because you can't not.

WHAT YOU BECOME
Order dinner without pointing at the menu. Understand the group chat. Speak in
sentences instead of single words. The twenty minutes you were going to lose
anyway become the reason you can.

HOW THE TOLL WORKS
• Choose the apps that steal your time — they go behind the gate
• Practice five exercises to earn your pass
• Your pass buys thirty minutes, then the apps lock again
• Miss the toll and Tolly, the operator, keeps the gate shut

FIVE LANGUAGES, A REAL CURRICULUM
German, Spanish, French, Italian and Portuguese — each from A1 to B2. Not a
phrasebook: multiple choice, typed answers with accent-forgiving grading, cloze,
sentence building, listening, and article drills where your language has them.

BUILT FOR REAL LIFE
• Every lesson through B1 ships inside the app — works with no signal
• Words you master collect in your wallet like ticket stubs
• Spoken aloud on-device in the language you're learning
• A live countdown on your lock screen while your pass is valid
• Nothing to sign up for. No account, no email, no password.

LANGTOLL PLUS
The lock is free forever. Plus adds unlimited apps and whole categories behind
the gate, custom fares, strict mode, AI topic packs for your world, and every
language we add. 7-day free trial on monthly and yearly.

Your worst habit becomes your study schedule.
```

**What's New** (first version)
```
First stop. Five languages, one toll gate, and Tolly at the window.
```

---

## Localizations (the reach multiplier)

Add a localization for each language the app teaches — the UI already speaks all
six, so the store page matching is consistent, and each one gets its **own 100
keyword characters**. Localize at minimum Name/Subtitle/Keywords.

Note: these sell LangToll to speakers of that language who want to learn *another*
one, so the subtitle must not imply "learn German" to a German reader.

### German (de-DE)
- Name: `LangToll: Sprachen lernen` (25)
- Subtitle: `Üben, um Apps zu entsperren` (27)
- Keywords: `vokabeln,spanisch,franzoesisch,italienisch,englisch,bildschirmzeit,fokus,gewohnheit`

### Spanish (es-ES / es-MX)
- Name: `LangToll: Aprende idiomas` (25)
- Subtitle: `Practica para desbloquear` (25)
- Keywords: `vocabulario,aleman,frances,italiano,ingles,pantalla,bloqueo,concentracion,habito`

### French (fr-FR)
- Name: `LangToll : Apprends une langue` (30)
- Subtitle: `Pratique pour débloquer` (23)
- Keywords: `vocabulaire,allemand,espagnol,italien,anglais,ecran,blocage,concentration,habitude`

### Italian (it-IT)
- Name: `LangToll: Impara le lingue` (26)
- Subtitle: `Allenati per sbloccare` (22)
- Keywords: `vocabolario,tedesco,spagnolo,francese,inglese,schermo,blocco,concentrazione,abitudine`

### Portuguese (pt-BR)
- Name: `LangToll: Aprenda idiomas` (25)
- Subtitle: `Treine para desbloquear` (23)
- Keywords: `vocabulario,alemao,espanhol,frances,ingles,tela,bloqueio,concentracao,habito`

---

## Also indexed, easy to forget

**In-app purchase display names** are searchable (35-char cap — an earlier draft
here was 40 and would have been rejected). Full per-product fields and the review
notes live in store/subscription-review-notes.md. Name them with intent, not
internals:

| Product | Display name |
|---|---|
| langtoll_plus_yearly | `Plus Yearly — All Languages` (27/35) |
| langtoll_plus_monthly | `Plus Monthly — All Languages` (28/35) |
| langtoll_plus_weekly | `Plus Weekly — All Languages` (27/35) |

**Category**: Education (primary), Productivity (secondary). Education carries the
language-learning intent; Productivity catches the screen-time/blocker crowd.

**Support URL / Marketing URL**: https://langtoll.app — must resolve before
submission (currently the droplet is off; bring the new host up first).
