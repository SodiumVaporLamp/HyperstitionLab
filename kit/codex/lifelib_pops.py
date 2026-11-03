#!/usr/bin/env python3
"""Codex: ground truth from lifelib, an independent engine (the one behind the Catagolue census).

    pip install --break-system-packages python-lifelib     # compiles rules with g++ on first use
    python3 codex/lifelib_pops.py                          # rewrites codex/lifelib_pops.json (a few minutes)

Population at every generation 0..500 for 20 word bodies, under each word's own law and under
Conway's Life. Rules where empty space ignites (B0) can only be stepped two generations at a time
in lifelib, so they are sampled at even generations, the only ones where the true population is
finite. The body encoding and the decoder are written again here, independently of the page.
codex/check.js compares the page's engine with this file generation by generation.
"""
import json
import os
import unicodedata

import lifelib

HERE = os.path.dirname(os.path.abspath(__file__))

# Fixed before running: a spread of physics (Life, no-birth, B1 explosive, S0, B0).
WORDS = ["CONWAY", "HYPERSTITION", "GLIDER", "NUMOGRAM", "CODEX", "AQ", "CCRU", "LEMURIA", "SYZYGY",
         "PANDEMONIUM", "TIME", "LIFE", "OUROBOROS", "ORACLE", "SORCERY", "XENOTATION", "ACCELERATION",
         "OUTSIDE", "CTHELL", "QABBALA"]
GENS = 500


def glyph_values(s):
    out = []
    for ch in unicodedata.normalize("NFD", s):
        if "0" <= ch <= "9":
            out.append(ord(ch) - 48)
        elif ch.isascii() and ch.isalpha():
            out.append(ord(ch.upper()) - 55)
    return out


def aq(s):
    return sum(glyph_values(s))


def decode(code):
    code %= 3 ** 10
    t = []
    for _ in range(10):
        t.append(code % 3)
        code //= 3
    B = sum(1 << n for n in range(9) if t[n] == 2)
    S = sum(1 << n for n in range(9) if t[n + 1] >= 1)
    return B, S


def rule_str(B, S):
    return "b" + "".join(str(n) for n in range(9) if B >> n & 1) + "s" + "".join(str(n) for n in range(9) if S >> n & 1)


def body(s):
    cells = []
    for i, L in enumerate(glyph_values(s)):
        x0 = -(L // 2)
        cells += [(x, 2 * i) for x in range(x0, x0 + L)]
    return cells


def rle(cells):
    xs = [c[0] for c in cells]
    ys = [c[1] for c in cells]
    x0, y0 = min(xs), min(ys)
    rows = {}
    for x, y in cells:
        rows.setdefault(y - y0, set()).add(x - x0)
    out = []
    height = max(ys) - y0 + 1
    pending_gap = 0
    for r in range(height):
        row = rows.get(r, set())
        if r > 0:
            pending_gap += 1
        if not row:
            continue
        if pending_gap:
            out.append(("%d$" % pending_gap) if pending_gap > 1 else "$")
            pending_gap = 0
        x, line = 0, ""
        maxx = max(row)
        while x <= maxx:
            v = x in row
            run = 0
            while x <= maxx and (x in row) == v:
                run += 1
                x += 1
            line += (str(run) if run > 1 else "") + ("o" if v else "b")
        out.append(line)
    return "".join(out) + "!"


LIFE = (1 << 3, (1 << 2) | (1 << 3))
jobs = []
for w in WORDS:
    jobs.append((w, "own", decode(aq(w))))
    jobs.append((w, "life", LIFE))
rules = sorted({rule_str(*j[2]) for j in jobs})
print("compiling", len(rules), "rules:", rules, flush=True)
trees = {}
keep = []
for i in range(0, len(rules), 8):  # lifelib allows up to 8 rules per session
    chunk = rules[i:i + 8]
    sess = lifelib.load_rules(*chunk)
    lt_chunk = sess.lifetree(memory=1500)
    keep.append((sess, lt_chunk))
    for r in chunk:
        trees[r] = lt_chunk

out = {"words": WORDS, "gens": GENS, "bodies": {w: body(w) for w in WORDS}, "aq": {w: aq(w) for w in WORDS}, "runs": {}}
for w, which, (B, S) in jobs:
    r = rule_str(B, S)
    step = 2 if B & 1 else 1
    p = trees[r].pattern(rle(body(w)), r)
    assert p.population == len(body(w)), (w, p.population, len(body(w)))
    pops = []
    for g in range(0, GENS + 1, step):
        pops.append(int(p.population))
        if g < GENS:
            p = p[step]
    out["runs"][w + "|" + which] = {"rule": r, "step": step, "pops": pops}
    print(f"{w:13s} {which:4s} {r:12s} step {step}  gen {GENS} pop {pops[-1]}", flush=True)

with open(os.path.join(HERE, "lifelib_pops.json"), "w") as f:
    json.dump(out, f)
print("wrote lifelib_pops.json")
