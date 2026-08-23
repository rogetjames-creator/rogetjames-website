#!/usr/bin/env python3
"""Regenerate concepts/hero-mark/hero-mark.html from the live source.

Reads the mark straight out of src/components/Hero.jsx, the outlined letters
out of src/components/heroWords.js and GSAP out of node_modules, and writes a
single standalone HTML file. Nothing is retyped, so the reference copy can
never drift away from what the website actually does.

    python3 concepts/hero-mark/build.py
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
hero  = (ROOT / "src/components/Hero.jsx").read_text()
words = (ROOT / "src/components/heroWords.js").read_text()
gsap  = (ROOT / "node_modules/gsap/dist/gsap.min.js").read_text()

def const(name):
    return re.search(r'const %s\s*=\s*("(?:[^"\\]|\\.)*"|[\d.]+);' % name, hero, re.S).group(1)

ART       = re.search(r'const ART_SYMBOL = "([^"]+)";', hero).group(1)
POSITIONS = re.search(r'const POSITIONS = \{(.*?)\n\};', hero, re.S).group(1)
SEQUENCE  = re.search(r'const SEQUENCE = \[(.*?)\n\];', hero, re.S).group(1)
SYMBOL_FILTER = re.search(r'const SYMBOL_FILTER =\s*("(?:[^"\\]|\\.)*");', hero, re.S).group(1)

used = sorted(set(re.findall(r'"([A-Z]+)"', SEQUENCE)))
blocks = []
for name in used:
    m = re.search(r'\n  (%s): \{ col: "\w", width: [\d.]+, cap: [\d.]+, glyphs: \[.*?\n  \] \},' % name,
                  words, re.S)
    if m:
        blocks.append(m.group(0).strip("\n"))

TEMPLATE = (pathlib.Path(__file__).parent / "template.html").read_text()
out = TEMPLATE % dict(
    ART=ART, GSAP=gsap, WORDBLOCKS="\n".join(blocks),
    WORD_FILL=const("WORD_FILL"), SYMBOL_FILL=const("SYMBOL_FILL"),
    SYMBOL_FILTER=SYMBOL_FILTER, CAST_SHADOW=const("CAST_SHADOW"),
    POSITIONS=POSITIONS, SEQUENCE=SEQUENCE,
    FLIP_EVERY=const("FLIP_EVERY"), FLIP_STAGGER=const("FLIP_STAGGER"),
    FLIP_DOWN=const("FLIP_DOWN"), FLIP_UP=const("FLIP_UP"),
    FLIP_START_DELAY=const("FLIP_START_DELAY"))
(pathlib.Path(__file__).parent / "hero-mark.html").write_text(out)
print("hero-mark.html rebuilt — %.0f KB, words: %s" % (len(out) / 1024, ", ".join(used)))
