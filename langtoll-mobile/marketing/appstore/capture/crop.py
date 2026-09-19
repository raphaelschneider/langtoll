#!/usr/bin/env python3
"""crop.py card <lock.png> <out.png>   — Live Activity card → RGBA with rounded alpha
   crop.py island <home.png> <out.jpg> — Dynamic Island pill + status icons strip"""
import sys
from PIL import Image, ImageDraw


def dark(p):
    r, g, b = p[:3]
    return r < 40 and g < 45 and b < 50


def card(src, out):
    im = Image.open(src).convert('RGB')
    W, H = im.size
    px = im.load()
    # rows in the lower 3/4 where most of the middle band is card-dark
    xs = range(0, W, 4)
    rows = [y for y in range(H // 4, H) if sum(dark(px[x, y]) for x in xs) > 0.3 * len(xs)]
    # the card is the first contiguous run
    top = rows[0]
    bot = top
    for y in rows[1:]:
        if y - bot > 12:
            break
        bot = y
    mid = (top + bot) // 2
    cols = [x for x in range(W) if dark(px[x, mid])]
    left, right = cols[0], cols[-1]
    # extend vertically at the corner-free middle column to catch rounded ends
    c = im.crop((left, top - 2, right + 1, bot + 3)).convert('RGBA')
    mask = Image.new('L', (c.width * 4, c.height * 4), 0)
    rad = int(0.075 * c.width) * 4  # ~22pt on a 1100px-wide iPhone card
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, mask.width - 1, mask.height - 1], radius=rad, fill=255)
    c.putalpha(mask.resize(c.size, Image.LANCZOS))
    c.save(out)
    print('card', out, c.size)


def island(src, out):
    im = Image.open(src).convert('RGB')
    W, H = im.size
    px = im.load()
    band = [(x, y) for y in range(0, 200) for x in range(0, W, 2) if px[x, y][:3] == (0, 0, 0)]
    xs = [p[0] for p in band]; ys = [p[1] for p in band]
    l, t, b = min(xs), min(ys), max(ys)
    s = im.crop((max(0, l - 24), max(0, t - 16), W - 20, b + 16))
    s.save(out, quality=95)
    print('island', out, s.size)


if __name__ == '__main__':
    {'card': card, 'island': island}[sys.argv[1]](sys.argv[2], sys.argv[3])
