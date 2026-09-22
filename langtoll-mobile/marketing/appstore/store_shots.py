#!/usr/bin/env python3
"""LangToll App Store screenshot composer — after ReLift's store_shots.py playbook.

Each shot is a composition, not a bare screenshot:
  - rail-navy canvas with soft teal/coral/amber aurora washes (brand: night transit)
  - the device — dark rounded bezel, soft shadow, gentle alternating tilt
  - Fraunces serif headline + letter-spaced Inter kicker
  - optional transparent Tolly overlapping the device edge (the mascot sells it)

Captions sell the OUTCOME, not the feature — what the user becomes
("Your doomscroll finally pays rent", not "Locks your apps until you practice").

Usage:
  python3 store_shots.py --raw raw/ --out out/ [--only 01_hero,...]

Raw captures are 1206x2622 (iPhone 17 sim, marketing status bar 9:41).
Output is 1320x2868 — the App Store 6.9" portrait spec.
Fonts: Fraunces SemiBold + Inter (variable) live in ./fonts (extracted from
langtoll-web's built woff2 via fontTools; regenerate with fonts/README note).
"""
from __future__ import annotations

import argparse
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# App Store portrait specs. The iPhone set is 0.46 aspect, the iPad slot 0.75 —
# not a rescale, so each canvas carries its own SHOTS geometry below. Everything
# else (palette, fonts, aurora, device frame, text ramp) is shared, because two
# copies of a brand drift apart the moment one of them is edited.
CANVASES = {
    "iphone": (1320, 2868),  # App Store 6.9" portrait
    "ipad": (2064, 2752),    # App Store 13" iPad portrait
}
W, H = CANVASES["iphone"]


def set_canvas(name: str) -> None:
    """Point the module at one of CANVASES. Call before building any shot."""
    global W, H
    W, H = CANVASES[name]

# Brand — design/tokens.ts (dark set)
NAVY = (15, 22, 27)        # #0F161B rail navy
NAVY_DEEP = (10, 15, 19)
TEAL = (92, 189, 205)      # #5CBDCD rail teal
TEAL_DEEP = (28, 90, 102)  # #1C5A66
CREAM = (236, 231, 216)    # #ECE7D8
MINT = (79, 192, 124)      # #4FC07C
CORAL = (240, 104, 78)     # #F0684E
AMBER = (217, 164, 78)     # #D9A44E
INK_SOFT = (162, 178, 182) # #A2B2B6

HERE = os.path.dirname(os.path.abspath(__file__))
FRAUNCES_SB = os.path.join(HERE, "fonts", "FrauncesSemiBold.ttf")
INTER_VAR = os.path.join(HERE, "fonts", "InterVariable.ttf")
TOLLY_DIR = os.path.join(HERE, "..", "..", "assets", "tolly")


def serif(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FRAUNCES_SB, size)


def inter(size: int, weight: int = 600) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(INTER_VAR, size)
    f.set_variation_by_axes([weight])
    return f


# ---------------------------------------------------------------- background
def aurora_bg(tints: list[tuple[tuple[int, int, int], float, float, float]],
              base_rgb: tuple[int, int, int] = NAVY) -> Image.Image:
    """Rail navy with big soft color washes — night-transit glow."""
    base = Image.new("RGB", (W // 4, H // 4), base_rgb)
    d = ImageDraw.Draw(base, "RGBA")
    for rgb, cx, cy, r in tints:
        x, y, rad = cx * base.width, cy * base.height, r * base.width
        d.ellipse([x - rad, y - rad, x + rad, y + rad], fill=rgb + (44,))
    base = base.filter(ImageFilter.GaussianBlur(60))
    return base.resize((W, H), Image.LANCZOS)


# ---------------------------------------------------------------- primitives
def rounded(img: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.width, img.height], radius=radius, fill=255)
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out


def with_shadow(card: Image.Image, blur: int = 40, alpha: int = 110, dy: int = 26) -> Image.Image:
    pad = blur * 3
    canvas = Image.new("RGBA", (card.width + pad * 2, card.height + pad * 2), (0, 0, 0, 0))
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [pad, pad + dy, pad + card.width, pad + card.height + dy],
        radius=min(card.width, card.height) // 8,
        fill=(0, 0, 0, alpha),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(card, (pad, pad))
    return canvas


def device(raw: Image.Image, width: int, tilt: float = 0.0,
           bezel: int = 26, corner: int = 120) -> Image.Image:
    """The device: near-black bezel + rounded screenshot, shadowed, optionally tilted.

    `corner` is the screen's corner radius in RAW capture pixels, so it scales
    with the frame. An iPad's corners are far less round relative to its size
    than a phone's, and reusing the phone's 120 gives a tablet the silhouette of
    a huge iPhone — pass a smaller corner for iPad."""
    screen_w = width - bezel * 2
    scale = screen_w / raw.width
    screen = raw.resize((screen_w, int(raw.height * scale)), Image.LANCZOS)
    screen = rounded(screen, radius=int(corner * scale))
    body = Image.new("RGBA", (width, screen.height + bezel * 2), (0, 0, 0, 0))
    ImageDraw.Draw(body).rounded_rectangle(
        [0, 0, body.width, body.height], radius=int(corner * scale) + bezel, fill=(8, 12, 15, 255)
    )
    body.alpha_composite(screen, (bezel, bezel))
    shadowed = with_shadow(body, blur=60, alpha=130, dy=40)
    if tilt:
        shadowed = shadowed.rotate(tilt, expand=True, resample=Image.BICUBIC)
    return shadowed


def draw_text(canvas: Image.Image, kicker: str, headline: str,
              ink=CREAM, kicker_ink=TEAL, top: int = 150) -> int:
    """Kicker (letter-spaced Inter caps) + up-to-2-line Fraunces headline, centered.
    Headline auto-shrinks until every line fits — long outcome lines can't clip."""
    d = ImageDraw.Draw(canvas)
    # The ramp was authored against the 1320pt-wide iPhone canvas. Scaling it by
    # canvas width keeps the headline the same SIZE RELATIVE TO THE SHOT on a
    # 2064pt iPad slot; leaving it fixed would render a caption where a headline
    # belongs. k == 1.0 for iPhone, so that set renders exactly as before.
    k = W / CANVASES["iphone"][0]
    y = int(top * k)
    if kicker:
        spaced = " ".join(kicker.upper())
        ksize = int(42 * k)
        while ksize > int(28 * k):
            f = inter(ksize, 640)
            if d.textlength(spaced, font=f) <= W - int(100 * k):
                break
            ksize -= 2
        f = inter(ksize, 640)
        tw = d.textlength(spaced, font=f)
        d.text(((W - tw) / 2, y), spaced, font=f, fill=kicker_ink)
        y += int(96 * k)
    lines = headline.split("\n")
    size = int(128 * k)
    while size > int(84 * k):
        f = serif(size)
        if max(d.textlength(line, font=f) for line in lines) <= W - int(110 * k):
            break
        size -= 4
    f = serif(size)
    line_h = int(size * 1.18)
    for line in lines:
        tw = d.textlength(line, font=f)
        d.text(((W - tw) / 2, y), line, font=f, fill=ink)
        y += line_h
    return y + int(30 * k)


def strip(path: str, width: int, tilt: float = 0.0, radius: int = 46) -> Image.Image:
    """A wide capture (Dynamic-Island strip, lock-screen banner) as a floating
    card: rounded, shadowed, gently tilted. Same finish as device(), no bezel —
    these are crops of a real phone surface, not full screens.

    RGBA sources carry their own EXACT silhouette (alpha traced from the
    capture's card contour) and are used as-is; RGB sources get the generic
    rounding."""
    raw = Image.open(path)
    if raw.mode == "RGBA":
        card = raw.resize((width, int(raw.height * width / raw.width)), Image.LANCZOS)
    else:
        img = raw.convert("RGB").resize((width, int(raw.height * width / raw.width)), Image.LANCZOS)
        card = rounded(img, radius=radius)
    shadowed = with_shadow(card, blur=40, alpha=120, dy=24)
    if tilt:
        shadowed = shadowed.rotate(tilt, expand=True, resample=Image.BICUBIC)
    return shadowed


def tolly(name: str, width: int, tilt: float = 0.0) -> Image.Image:
    """Transparent Tolly art, soft-shadowed for compositing over the device edge."""
    img = Image.open(os.path.join(TOLLY_DIR, f"{name}.png")).convert("RGBA")
    img = img.resize((width, int(img.height * width / img.width)), Image.LANCZOS)
    if tilt:
        img = img.rotate(tilt, expand=True, resample=Image.BICUBIC)
    sh = Image.new("RGBA", (img.width + 80, img.height + 80), (0, 0, 0, 0))
    alpha = img.split()[3].point(lambda a: int(a * 0.5))
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 255))
    shadow.putalpha(alpha)
    sh.paste(shadow, (40, 52), shadow)
    sh = sh.filter(ImageFilter.GaussianBlur(18))
    sh.alpha_composite(img, (40, 40))
    return sh


# ---------------------------------------------------------------- shot builds
def build_shot(spec: dict, raw_dir: str) -> Image.Image:
    canvas = aurora_bg(spec["aurora"], base_rgb=spec.get("bg_base", NAVY)).convert("RGBA")

    text_bottom = draw_text(canvas, spec.get("kicker", ""), spec["headline"],
                            ink=spec.get("ink", CREAM), kicker_ink=spec.get("kicker_ink", TEAL))

    if spec.get("strips"):
        # Wide-crop composition (no full screen to show) — each strip floats.
        for s in spec["strips"]:
            card = strip(os.path.join(HERE, s["path"]), s["w"], tilt=s.get("tilt", 0.0))
            sx = s.get("x", (W - card.width) // 2)
            canvas.alpha_composite(card, (sx, s["y"]))
    else:
        raw = Image.open(os.path.join(raw_dir, spec["raw"])).convert("RGB")
        dev = device(raw, width=spec.get("device_w", 1090), tilt=spec.get("tilt", 0.0),
                     bezel=spec.get("bezel", 26), corner=spec.get("corner", 120))
        dx = spec.get("device_x", (W - dev.width) // 2)
        dy = spec.get("device_y", text_bottom + 40)
        canvas.alpha_composite(dev, (dx, dy))

    for t in spec.get("tollys", []):
        art = tolly(t["name"], t["w"], tilt=t.get("tilt", 0.0))
        canvas.alpha_composite(art, (t["x"], t["y"]))

    return canvas.convert("RGB")


# The launch set. Order tells the story: the hook (your vice, tolled) → the fare
# (tiny exercises) → the payoff (pass issued, guilt-free scroll) → what accrues
# (the wallet) → the promise → the always-on watch. All-dark: the app is dark,
# and a full-navy set stands out in a sea of white screenshots.
#
# One language per shot — the set itself demonstrates the catalogue:
# 01 German (home) · 02 the island/lock-screen closer promoted to the front
# (founder call 2026-08-10: best feature in the first three) · 03 Spanish
# (practice) · 04 Portuguese (ceremony) · 05 French (wallet) · 06 Italian
# (onboarding hook).
SHOTS = [
    {
        # Ralph's register, verbatim: name the transformation, not the mechanism.
        # The screen's own "Erst Deutsch, dann TikTok." carries the German.
        "name": "01_hero",
        "raw": "raw_home.png",
        "kicker": "your apps, behind a language toll",
        "headline": "Your doomscroll\nfinally pays rent",
        "aurora": [(TEAL_DEEP, 0.15, 0.22, 0.7), (CORAL, 0.95, 0.72, 0.5), (TEAL, 0.6, 0.02, 0.38)],
        "device_w": 1100, "tilt": -3.0, "device_y": 545,
    },
    {
        # The closer: LangToll off-app — Tolly keeping the meter running on the
        # lock screen and up top all day. Real device crops, no bezel needed.
        # The overline is the catalogue itself. (Never name the island feature.)
        "name": "02_watch",
        "kicker": "word · translation · always on your screen",
        "headline": "He watches the clock.\nYou soak up the words.",
        "aurora": [(TEAL, 0.85, 0.2, 0.5), (TEAL_DEEP, 0.15, 0.8, 0.55), (AMBER, 0.2, 0.05, 0.3)],
        # The catalogue, scattered (founder direction 2026-08-10): every course
        # language rains down the canvas as real device captures — island pills
        # between lock-screen banners, each gently crooked, each banner
        # self-labelling its course (DE/FR/ES/PT/IT in the ticket footer).
        # Pairs deliberately cross languages: source AND target vary.
        "strips": [
            {"path": "raw/raw_lockscreen_tschuess_exact.png", "w": 1150, "tilt": 2.5, "x": -100, "y": 450},
            {"path": "raw/raw_island_goodbye_tchau_full.jpg", "w": 900, "tilt": -4.0, "x": 330, "y": 850},
            {"path": "raw/raw_lock_bonjour_buenosdias_exact.png", "w": 1150, "tilt": -3.0, "x": 20, "y": 1000},
            {"path": "raw/raw_lock_hola_ciao_exact.png", "w": 1150, "tilt": 2.5, "x": -100, "y": 1390},
            {"path": "raw/raw_lock_porfavor_perfavore_exact.png", "w": 1150, "tilt": -2.5, "x": 15, "y": 1945},
            {"path": "raw/raw_lock_prego_denada_exact.png", "w": 1150, "tilt": 3.0, "x": -90, "y": 2350},
            {"path": "raw/raw_island_buongiorno_full.jpg", "w": 900, "tilt": 0.0, "y": 1825},
        ],
        "tollys": [{"name": "tolly-celebrate", "w": 640, "x": 640, "y": 2120, "tilt": 3.0}],
    },
    {
        # The fare: a rep is BUILDING a real sentence from word tiles — not matching\n        # a word to its translation. The caption must never promise more than the\n        # screen proves (an early cut said "order dinner" over a "the coffee" drill).
        "name": "03_practice",
        # The sentence FINISHED and checked: green banner, Tolly happy (founder
        # call 2026-09-22). Capture kind order_done in capture/cap.py.
        "raw": "raw_practice_done.png",
        "kicker": "whole sentences, from day one",
        "headline": "Speak in sentences,\nnot in single words",
        "aurora": [(TEAL, 0.2, 0.18, 0.55), (AMBER, 0.9, 0.7, 0.5), (TEAL_DEEP, 0.5, 1.0, 0.45)],
        "device_w": 1100, "tilt": 3.0, "device_y": 545,
    },
    {
        # The payoff — PAID stamp, Tolly celebrating. Permission to enjoy the
        # scroll. The screen's "Desbloqueado!" is the pt pack's own flavor word.
        "name": "04_pass",
        "raw": "raw_pass_pt.png",
        "kicker": "fare paid — 30 minutes of phone",
        "headline": "Scroll guilt-free.\nYou earned it.",
        "aurora": [(MINT, 0.18, 0.25, 0.55), (TEAL, 0.9, 0.75, 0.5), (TEAL_DEEP, 0.4, 0.0, 0.4)],
        "device_w": 1100, "tilt": -2.5, "device_y": 545,
    },
    {
        # What accrues while you "waste time": the wallet. Tolly peeks over the edge.
        "name": "05_wallet",
        "raw": "raw_wallet_fr.png",
        "kicker": "every unlock leaves words behind",
        "headline": "Your wasted minutes,\nnow a new vocabulary",
        "aurora": [(TEAL_DEEP, 0.1, 0.2, 0.6), (AMBER, 0.9, 0.8, 0.45), (TEAL, 0.3, 0.95, 0.4)],
        "device_w": 1080, "tilt": 3.0, "device_y": 545,
        # Bottom-left corner, over the already-faded next card — never over legible copy.
        "tollys": [{"name": "tolly-happy", "w": 330, "x": -20, "y": 2500, "tilt": -6.0}],
    },
    {
        # The promise, in the app's own voice. No willpower story — inevitability.
        "name": "06_hook",
        "raw": "raw_hook_it.png",
        "kicker": "a new language, without the willpower",
        "headline": "Fluency you can't\nprocrastinate",
        "aurora": [(CORAL, 0.15, 0.2, 0.5), (TEAL, 0.88, 0.65, 0.55), (TEAL_DEEP, 0.4, 1.0, 0.45)],
        "device_w": 1100, "tilt": -2.5, "device_y": 545,
    },
    {
        # The paywall closer Ralph may still prefer — kept out of the contact
        # sheet; renders alongside so both options stay on disk.
        "name": "06_plus_alternate",
        "raw": "raw_plus.png",
        "kicker": "langtoll plus",
        "headline": "Every app becomes\na language lesson",
        "aurora": [(TEAL, 0.85, 0.2, 0.5), (TEAL_DEEP, 0.15, 0.8, 0.55), (AMBER, 0.2, 0.05, 0.3)],
        "device_w": 1080, "tilt": 3.0, "device_y": 545,
        "in_sheet": False,
    },
]



# ---------------------------------------------------------------- custom product page: language-app intent
# Apple Ads "duolingo" keyword (every launch-day install, 2026-09-22): people who
# searched for a language app and met a screen-time pitch. Two of five bounced off
# the first screens; the tap→install rate on the product page was 23%. This set
# answers THEIR question first — is this a language course, and why this one —
# and only then shows the lock. Same captures, same system, different order and
# copy. Rendered with `--set language`; goes on a Custom Product Page assigned
# to the language-app ad group (store/apple-ads.md). Never names a competitor:
# App Review 2.3 forbids other apps' names in metadata, screenshots included.
_BY_NAME = {s["name"]: s for s in SHOTS}

SHOTS_LANGUAGE = [
    {
        # The searcher's own history, without the name: streaks are the thing
        # they quit. The screen proves the mechanism ("Apps locked · Practice to unlock").
        **_BY_NAME["01_hero"],
        "name": "L1_locks",
        "kicker": "the language app you can\u2019t skip",
        "headline": "Streaks didn\u2019t work.\nLocks do.",
    },
    {
        # Second, because it is what they came for: a real course. The capture
        # is a sentence-building drill; "A1 to B2" is the curriculum in plans.ts.
        **_BY_NAME["03_practice"],
        "name": "L2_course",
        "kicker": "real sentences \u00b7 A1 to B2 \u00b7 six languages",
        "headline": "A course you finish,\nnot a game you drop",
    },
    {
        # The deal, in one line, over the paid pass. "5 exercises \u2192 30 min" is the
        # default fare (FREE_EXERCISES_PER_UNLOCK / FREE_UNLOCK_MINUTES).
        **_BY_NAME["04_pass"],
        "name": "L3_deal",
        "kicker": "5 exercises buy 30 minutes of phone",
        "headline": "Practice first.\nThen TikTok.",
    },
    {
        **_BY_NAME["02_watch"],
        "name": "L4_watch",
        "kicker": "word \u00b7 translation \u00b7 always on your screen",
        "headline": "Vocabulary that\nfollows you all day",
    },
    {
        **_BY_NAME["05_wallet"],
        "name": "L5_wallet",
        "kicker": "every unlock leaves words behind",
        "headline": "Your wasted minutes,\nnow a new vocabulary",
    },
    {
        # The closer for a paid-intent searcher: the trial, honestly. Yearly and
        # monthly carry the 7-day intro offer in App Store Connect; weekly does not,
        # so the kicker names the plan the offer is on.
        **_BY_NAME["06_plus_alternate"],
        "name": "L6_trial",
        "kicker": "7 days free on yearly \u00b7 cancel anytime",
        "headline": "Try it for a week.\nKeep it if it works.",
        "in_sheet": True,
    },
]

SHOT_SETS = {"default": SHOTS, "language": SHOTS_LANGUAGE}


# ---------------------------------------------------------------- iPad set
# The 13" iPad slot (2064x2752) is 0.75 aspect against the phone's 0.46, so this
# is a REDRAW, not a rescale: every device_w / y below is tuned to the squarer
# canvas, and the frame is an iPad frame (thinner bezel, much less round corners).
#
# Same six beats and the same captions as the phone set — they sell outcomes, not
# hardware, so they carry across — and the same one-language-per-shot rule:
# 01 German (home) · 02 the catalogue raining down the Lock Screen · 03 Spanish
# (a whole sentence) · 04 Portuguese (the payoff) · 05 French (wallet) ·
# 06 Italian (hook).
#
# 02's kicker differs from the phone set's twice over, and both are deliberate.
# The phone says "always on your screen" because an iPhone has both the Lock
# Screen and the Dynamic Island; NO iPad has an island, so this names the surface
# it actually has, and the art follows — lock-screen cards only, never an island
# pill. And it says "your next word" rather than the phone's "word · translation"
# because these captures are a FREE profile, where the card carries the word
# alone; the translation beside it is the Plus gate. A caption must never promise
# more than the screen behind it proves. If these are ever re-shot on a Plus
# profile, the card gains its translation and the phone's wording can come back.
IPAD_FRAME = {"bezel": 22, "corner": 80}

SHOTS_IPAD = [
    {
        "name": "01_hero",
        "raw": "raw_home_de.png",
        "kicker": "your apps, behind a language toll",
        "headline": "Your doomscroll\nfinally pays rent",
        "aurora": [(TEAL_DEEP, 0.15, 0.22, 0.7), (CORAL, 0.95, 0.72, 0.5), (TEAL, 0.6, 0.02, 0.38)],
        "device_w": 1660, "tilt": -2.0, "device_y": 820, **IPAD_FRAME,
    },
    {
        # No device frame: these are crops of the real Lock Screen card, cascading
        # down the canvas so the catalogue reads at a glance. Source AND target
        # vary across the pairs, exactly as the phone set does.
        "name": "02_watch",
        "kicker": "your next word · always on your lock screen",
        "headline": "He watches the clock.\nYou soak up the words.",
        "aurora": [(TEAL, 0.85, 0.2, 0.5), (TEAL_DEEP, 0.15, 0.8, 0.55), (AMBER, 0.2, 0.05, 0.3)],
        "strips": [
            {"path": "raw-ipad/card_de.png", "w": 1300, "tilt": 2.0,  "x": 180, "y": 950},
            {"path": "raw-ipad/card_fr.png", "w": 1300, "tilt": -2.5, "x": 330, "y": 1280},
            {"path": "raw-ipad/card_es.png", "w": 1300, "tilt": 2.5,  "x": 170, "y": 1610},
            {"path": "raw-ipad/card_pt.png", "w": 1300, "tilt": -2.0, "x": 340, "y": 1940},
            {"path": "raw-ipad/card_it.png", "w": 1300, "tilt": 1.5,  "x": 200, "y": 2270},
        ],
        "tollys": [{"name": "tolly-celebrate", "w": 620, "x": 1330, "y": 2180, "tilt": 4.0}],
    },
    {
        "name": "03_practice",
        "raw": "raw_practice_es.png",
        "kicker": "whole sentences, from day one",
        "headline": "Speak in sentences,\nnot in single words",
        "aurora": [(TEAL, 0.2, 0.18, 0.55), (AMBER, 0.9, 0.7, 0.5), (TEAL_DEEP, 0.5, 1.0, 0.45)],
        "device_w": 1660, "tilt": 2.0, "device_y": 820, **IPAD_FRAME,
    },
    {
        "name": "04_pass",
        "raw": "raw_home_pt_active.png",
        "kicker": "fare paid — 30 minutes of phone",
        "headline": "Scroll guilt-free.\nYou earned it.",
        "aurora": [(MINT, 0.18, 0.25, 0.55), (TEAL, 0.9, 0.75, 0.5), (TEAL_DEEP, 0.4, 0.0, 0.4)],
        "device_w": 1660, "tilt": -1.5, "device_y": 820, **IPAD_FRAME,
    },
    {
        "name": "05_wallet",
        "raw": "raw_wallet_fr.png",
        "kicker": "every unlock leaves words behind",
        "headline": "Your wasted minutes,\nnow a new vocabulary",
        "aurora": [(TEAL_DEEP, 0.1, 0.2, 0.6), (AMBER, 0.9, 0.8, 0.45), (TEAL, 0.3, 0.95, 0.4)],
        "device_w": 1660, "tilt": 2.0, "device_y": 820, **IPAD_FRAME,
        "tollys": [{"name": "tolly-happy", "w": 380, "x": 120, "y": 2360, "tilt": -6.0}],
    },
    {
        "name": "06_hook",
        "raw": "raw_hook_it.png",
        "kicker": "a new language, without the willpower",
        "headline": "Fluency you can't\nprocrastinate",
        "aurora": [(CORAL, 0.15, 0.2, 0.5), (TEAL, 0.88, 0.65, 0.55), (TEAL_DEEP, 0.4, 1.0, 0.45)],
        "device_w": 1660, "tilt": -2.0, "device_y": 820, **IPAD_FRAME,
    },
]

# ---------------------------------------------------------------- localized captions
# Per-storefront captions over the SAME raw captures (the app UI underneath stays
# as captured). Keyed by shot name; a shot missing here keeps its English caption.
# Voice follows lib/i18n/<locale>.ts: du/tú, "Fahrpreis"/"tarifa", "Doomscroll",
# "Handy"/"móvil". Austria has no listing of its own and is served by de.
# "kicker_ipad" overrides only the iPad set (its 02 names the Lock Screen — see
# the SHOTS_IPAD note on why the phone's wording would over-promise there).
CAPTIONS = {
    "de": {
        "01_hero": ("deine apps, hinter einer sprach-maut",
                    "Dein Doomscroll\nzahlt sich endlich aus"),
        "02_watch": ("wort · übersetzung · immer im blick",
                     "Er behält die Uhr im Blick.\nDu die neuen Wörter.",
                     "dein nächstes wort · auf dem sperrbildschirm"),
        "03_practice": ("ganze sätze, vom ersten tag an",
                        "Sprich in Sätzen,\nnicht in Einzelwörtern"),
        "04_pass": ("fahrpreis bezahlt — 30 min handyzeit",
                    "Scrollen ohne Reue.\nDu hast es dir verdient."),
        "05_wallet": ("jedes entsperren hinterlässt wörter",
                      "Verschwendete Minuten,\njetzt neuer Wortschatz"),
        "06_hook": ("eine neue sprache, ohne willenskraft",
                    "Fließend werden,\nohne Aufschieben"),
        "06_plus_alternate": ("langtoll plus",
                              "Jede App wird\nzur Sprachstunde"),
    },
    "es": {
        "01_hero": ("tus apps, tras un peaje de idiomas",
                    "Tu doomscroll\npor fin vale la pena"),
        "02_watch": ("palabra · traducción · siempre a la vista",
                     "Él vigila el reloj.\nTú absorbes las palabras.",
                     "tu próxima palabra · en la pantalla bloqueada"),
        "03_practice": ("frases completas desde el primer día",
                        "Habla con frases,\nno con palabras sueltas"),
        "04_pass": ("tarifa pagada — 30 min de móvil",
                    "Scrollea sin culpa.\nTe lo has ganado."),
        "05_wallet": ("cada desbloqueo te deja palabras",
                      "Tus minutos perdidos,\nahora vocabulario nuevo"),
        "06_hook": ("un idioma nuevo, sin fuerza de voluntad",
                    "Fluidez sin\nprocrastinar"),
        "06_plus_alternate": ("langtoll plus",
                              "Cada app se convierte\nen una clase de idiomas"),
    },
    "fr": {
        "01_hero": ("tes apps, derrière un péage de langue",
                    "Ton scroll compulsif\nsert enfin à quelque chose"),
        "02_watch": ("mot · traduction · toujours sous tes yeux",
                     "Il surveille l'horloge.\nToi, tu retiens les mots.",
                     "ton prochain mot · sur l'écran verrouillé"),
        "03_practice": ("des phrases entières dès le premier jour",
                        "Parle en phrases,\npas en mots isolés"),
        "04_pass": ("tarif payé — 30 min de temps d'écran",
                    "Scrolle sans culpabilité.\nTu l'as mérité."),
        "05_wallet": ("chaque déblocage te laisse des mots",
                      "Tes minutes perdues,\ndevenues vocabulaire"),
        "06_hook": ("une nouvelle langue, sans volonté",
                    "Parler couramment,\nsans procrastiner"),
        "06_plus_alternate": ("langtoll plus",
                              "Chaque app devient\nun cours de langue"),
    },
    "it": {
        "01_hero": ("le tue app, dietro un pedaggio di lingua",
                    "Il tuo scroll infinito\nfinalmente serve a qualcosa"),
        "02_watch": ("parola · traduzione · sempre sotto gli occhi",
                     "Lui guarda l'orologio.\nTu assorbi le parole.",
                     "la prossima parola · sulla schermata di blocco"),
        "03_practice": ("frasi intere dal primo giorno",
                        "Parla per frasi,\nnon per parole singole"),
        "04_pass": ("tariffa pagata — 30 min di telefono",
                    "Scrolla senza sensi di colpa.\nTe lo sei meritato."),
        "05_wallet": ("ogni sblocco ti lascia parole",
                      "I tuoi minuti persi,\nora vocabolario nuovo"),
        "06_hook": ("una nuova lingua, senza forza di volontà",
                    "Parla fluente,\nsenza rimandare"),
        "06_plus_alternate": ("langtoll plus",
                              "Ogni app diventa\nuna lezione di lingua"),
    },
    "pt": {
        "01_hero": ("seus apps, atrás de um pedágio de idioma",
                    "Seu doomscroll\nfinalmente vale a pena"),
        "02_watch": ("palavra · tradução · sempre na sua tela",
                     "Ele vigia o relógio.\nVocê absorve as palavras.",
                     "sua próxima palavra · na tela bloqueada"),
        "03_practice": ("frases inteiras desde o primeiro dia",
                        "Fale em frases,\nnão em palavras soltas"),
        "04_pass": ("tarifa paga — 30 min de celular",
                    "Scroll sem culpa.\nVocê mereceu."),
        "05_wallet": ("cada desbloqueio deixa palavras",
                      "Seus minutos perdidos,\nagora vocabulário novo"),
        "06_hook": ("um idioma novo, sem força de vontade",
                    "Fluência sem\nprocrastinar"),
        "06_plus_alternate": ("langtoll plus",
                              "Cada app vira\numa aula de idiomas"),
    },
}


# Localized sets are re-captured with the app UI in that language, into
# <raw>/<locale>/ under these names (the English set keeps its original files).
# The course on each screen follows the English set's one-language-per-shot plan,
# except that no reader is shown a course in their own language — that one is
# swapped for English.
LOCALE_RAW = {
    "01_hero": "home.png",
    "03_practice": "practice_done.png",
    "04_pass": "pass.png",
    "05_wallet": "wallet.png",
    "06_hook": "hook.png",
    "06_plus_alternate": None,  # paywall stays English-only; never in the sheet
}
# iPad keeps the mid-build capture: the finished-sentence raws are iPhone only.
LOCALE_RAW_IPAD = {**LOCALE_RAW, "03_practice": "practice.png", "04_pass": "home_active.png"}
# Upload order of the localized listings (founder call 2026-09-19): hero, watch,
# wallet, hook, practice, pass. Files are numbered to match, because App Store
# Connect keeps whatever order the files arrive in.
LOCALE_ORDER = {
    "03_practice": "05_practice",
    "04_pass": "06_pass",
    "05_wallet": "03_wallet",
    "06_hook": "04_hook",
}
# Course order for the 02 strips: the catalogue minus the reader's language.
STRIP_COURSES = ["de", "fr", "es", "pt", "it", "en"]


def localize(shots: list[dict], locale: str, canvas: str) -> list[dict]:
    """Copies of `shots` in `locale`: its captions over its own captures."""
    if locale == "en":
        return shots
    table = CAPTIONS[locale]
    raws = LOCALE_RAW_IPAD if canvas == "ipad" else LOCALE_RAW
    base = "raw-ipad" if canvas == "ipad" else "raw"
    courses = [c for c in STRIP_COURSES if c != locale][:5]
    out = []
    for spec in shots:
        if raws.get(spec["name"], "") is None:
            continue
        cap = table.get(spec["name"])
        if cap:
            kicker = cap[2] if canvas == "ipad" and len(cap) > 2 else cap[0]
            spec = {**spec, "kicker": kicker, "headline": cap[1]}
        if spec["name"] in raws:
            spec = {**spec, "raw": os.path.join(locale, raws[spec["name"]])}
        if spec.get("strips"):
            # Same slots, same tilts; each lock-screen slot takes the next course,
            # each island slot re-uses one (the island pill is iPhone-only).
            locks = iter(courses)
            islands = iter([courses[0], courses[3]])
            strips = []
            for s in spec["strips"]:
                if "island" in s["path"]:
                    path = f"{base}/{locale}/island_{next(islands)}.png"
                else:
                    path = f"{base}/{locale}/lock_{next(locks)}.png"
                strips.append({**s, "path": path})
            spec = {**spec, "strips": strips}
        out.append(spec)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--only", help="comma-separated shot names to render")
    ap.add_argument("--canvas", default="iphone", choices=sorted(CANVASES),
                    help="which App Store slot to render for (default iphone)")
    ap.add_argument("--locale", default="en", choices=["en", *sorted(CAPTIONS)],
                    help="caption language (default en)")
    ap.add_argument("--set", default="default", choices=sorted(SHOT_SETS),
                    help="shot set: default gallery, or a custom product page (iPhone, en only)")
    args = ap.parse_args()
    if args.set != "default" and (args.canvas != "iphone" or args.locale != "en"):
        ap.error("custom product page sets render for the iPhone canvas in English only")
    os.makedirs(args.out, exist_ok=True)

    set_canvas(args.canvas)
    base_shots = SHOTS_IPAD if args.canvas == "ipad" else SHOT_SETS[args.set]
    shots = localize(base_shots, args.locale, args.canvas)

    only = set(args.only.split(",")) if args.only else None
    rendered = []
    for spec in shots:
        if only and spec["name"] not in only:
            continue
        img = build_shot(spec, args.raw)
        out_name = LOCALE_ORDER.get(spec["name"], spec["name"]) if args.locale != "en" else spec["name"]
        path = os.path.join(args.out, f"{out_name}.png")
        img.save(path)
        rendered.append((spec["name"], img, spec.get("in_sheet", True)))
        print(f"ok {path}")

    # Contact sheet for review — a third scale, side by side. Alternates render
    # to disk but stay out of the sheet, so it shows the gallery as submitted.
    sheet_shots = [(n, im) for n, im, keep in rendered if keep]
    if sheet_shots:
        tw, th = W // 3, H // 3
        sheet = Image.new("RGB", (tw * len(sheet_shots) + 20 * (len(sheet_shots) + 1), th + 40), NAVY_DEEP)
        for i, (_, img) in enumerate(sheet_shots):
            sheet.paste(img.resize((tw, th), Image.LANCZOS), (20 + i * (tw + 20), 20))
        sheet_path = os.path.join(args.out, "contact_sheet.png")
        sheet.save(sheet_path)
        print(f"ok {sheet_path}")


if __name__ == "__main__":
    main()
