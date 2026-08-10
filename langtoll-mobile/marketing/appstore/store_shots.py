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

W, H = 1320, 2868  # App Store 6.9" portrait spec

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


def device(raw: Image.Image, width: int, tilt: float = 0.0) -> Image.Image:
    """The phone: near-black bezel + rounded screenshot, shadowed, optionally tilted."""
    bezel = 26
    screen_w = width - bezel * 2
    scale = screen_w / raw.width
    screen = raw.resize((screen_w, int(raw.height * scale)), Image.LANCZOS)
    screen = rounded(screen, radius=int(120 * scale))
    body = Image.new("RGBA", (width, screen.height + bezel * 2), (0, 0, 0, 0))
    ImageDraw.Draw(body).rounded_rectangle(
        [0, 0, body.width, body.height], radius=int(120 * scale) + bezel, fill=(8, 12, 15, 255)
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
    y = top
    if kicker:
        spaced = " ".join(kicker.upper())
        ksize = 42
        while ksize > 28:
            f = inter(ksize, 640)
            if d.textlength(spaced, font=f) <= W - 100:
                break
            ksize -= 2
        f = inter(ksize, 640)
        tw = d.textlength(spaced, font=f)
        d.text(((W - tw) / 2, y), spaced, font=f, fill=kicker_ink)
        y += 96
    lines = headline.split("\n")
    size = 128
    while size > 84:
        f = serif(size)
        if max(d.textlength(line, font=f) for line in lines) <= W - 110:
            break
        size -= 4
    f = serif(size)
    line_h = int(size * 1.18)
    for line in lines:
        tw = d.textlength(line, font=f)
        d.text(((W - tw) / 2, y), line, font=f, fill=ink)
        y += line_h
    return y + 30


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
        dev = device(raw, width=spec.get("device_w", 1090), tilt=spec.get("tilt", 0.0))
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
        "raw": "raw_practice_es.png",
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
        "kicker": "paid in portuguese — 30 minutes of phone",
        "headline": "Scroll guilt-free.\nYou earned it.",
        "aurora": [(MINT, 0.18, 0.25, 0.55), (TEAL, 0.9, 0.75, 0.5), (TEAL_DEEP, 0.4, 0.0, 0.4)],
        "device_w": 1100, "tilt": -2.5, "device_y": 545,
    },
    {
        # What accrues while you "waste time": the wallet. Tolly peeks over the edge.
        "name": "05_wallet",
        "raw": "raw_wallet_fr.png",
        "kicker": "every unlock leaves words behind",
        "headline": "Your wasted minutes,\nnow a French vocabulary",
        "aurora": [(TEAL_DEEP, 0.1, 0.2, 0.6), (AMBER, 0.9, 0.8, 0.45), (TEAL, 0.3, 0.95, 0.4)],
        "device_w": 1080, "tilt": 3.0, "device_y": 545,
        # Bottom-left corner, over the already-faded next card — never over legible copy.
        "tollys": [{"name": "tolly-happy", "w": 330, "x": -20, "y": 2500, "tilt": -6.0}],
    },
    {
        # The promise, in the app's own voice. No willpower story — inevitability.
        "name": "06_hook",
        "raw": "raw_hook_it.png",
        "kicker": "italian, without the willpower",
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


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--only", help="comma-separated shot names to render")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    only = set(args.only.split(",")) if args.only else None
    rendered = []
    for spec in SHOTS:
        if only and spec["name"] not in only:
            continue
        img = build_shot(spec, args.raw)
        path = os.path.join(args.out, f"{spec['name']}.png")
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
