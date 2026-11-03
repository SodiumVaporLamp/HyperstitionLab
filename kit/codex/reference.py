#!/usr/bin/env python3
"""Codex: the reference numbers, computed independently of the page's JavaScript.

    pip install --break-system-packages numpy wordfreq
    python3 codex/reference.py        # rewrites codex/reference.json

1. The zone code, decoded for all 3^10 codes and tested against all 512 3x3 blocks.
2. Facts about the code: which codes are Conway's Life, how many distinct physics, which named rules
   it cannot reach. check.js compares the page's decoder with a SHA-256 of every code's B/S pair.
3. The odds on the page ("how lucky is Conway?"): the 50 Life terms below were fixed before any
   value was computed; word counts use the top 50,000 words in wordfreq's English list, letters only.
4. AQ for a fixed list of test strings, which check.js also runs through Numogram Lab's values().
build.py fills the page's odds from reference.json, so no number is copied by hand.
"""
import hashlib
import itertools
import json
import os
import unicodedata

import numpy as np
from wordfreq import top_n_list

HERE = os.path.dirname(os.path.abspath(__file__))
N = 3 ** 10


def aq(s):
    """Ccru glossary: A = 10 ... Z = 35; digits at face value; accents dropped (NFD)."""
    t = 0
    for ch in unicodedata.normalize('NFD', s):
        if '0' <= ch <= '9':
            t += ord(ch) - 48
        elif ch.isascii() and ch.isalpha():
            t += ord(ch.lower()) - 87
    return t


# ---------- 1. the decoder, exhaustively ----------
codes = np.arange(N)
tr = np.zeros((N, 10), dtype=np.int8)
x = codes.copy()
for k in range(10):
    tr[:, k] = x % 3
    x //= 3
B = tr[:, 0:9] == 2          # a dead cell with n live neighbours sits in zone n
S = tr[:, 1:10] >= 1         # a live cell with n live neighbours sits in zone n + 1
nb = np.array(list(itertools.product([0, 1], repeat=9)), dtype=np.int8)
c = nb[:, 4]
s = nb.sum(1)
n = s - c
act = tr[:, s]
want = np.where(act == 0, 0, np.where(act == 1, c[None, :], 1))
got = np.where(c[None, :] == 1, S[:, n], B[:, n]).astype(np.int8)
decoder_ok = bool((want == got).all())

bmask = (B * (1 << np.arange(9))).sum(1)
smask = (S * (1 << np.arange(9))).sum(1)
key = (bmask + (smask << 9)).astype(np.int64)
keys_sha256 = hashlib.sha256(','.join(map(str, key.tolist())).encode()).hexdigest()


def mask(digits):
    return sum(1 << int(d) for d in digits)


LIFE_KEY = mask('3') + (mask('23') << 9)
life_codes = [int(i) for i in np.nonzero(key == LIFE_KEY)[0]]
distinct = int(len(np.unique(key)))
keyset = set(key.tolist())
named = {'HighLife B36/S23': ('36', '23'), 'Seeds B2/S': ('2', ''), 'Day & Night B3678/S34678': ('3678', '34678'),
         'Life B3/S23': ('3', '23'), 'Life without Death B3/S012345678': ('3', '012345678')}
reachable = {name: (mask(b) + (mask(s_) << 9)) in keyset for name, (b, s_) in named.items()}

# ---------- 3. the odds ----------
LIFE_TERMS = [  # fixed before any value below was computed
    'CONWAY', 'JOHN CONWAY', 'JOHN HORTON CONWAY', 'GOSPER', 'BILL GOSPER', 'MARTIN GARDNER', 'GARDNER',
    'LIFE', 'GAME OF LIFE', 'CELLULAR AUTOMATON', 'AUTOMATON', 'CELL', 'GENERATION', 'NEIGHBOR', 'BIRTH', 'SURVIVAL',
    'GLIDER', 'GLIDER GUN', 'GUN', 'SPACESHIP', 'BLINKER', 'BLOCK', 'BEEHIVE', 'LOAF', 'BOAT', 'SHIP', 'TUB', 'POND',
    'TOAD', 'BEACON', 'PULSAR', 'PENTADECATHLON', 'OSCILLATOR', 'STILL LIFE', 'METHUSELAH', 'ACORN', 'DIEHARD',
    'R PENTOMINO', 'PUFFER', 'RAKE', 'BREEDER', 'EATER', 'REFLECTOR', 'ASH', 'SOUP', 'GARDEN OF EDEN', 'GOLLY',
    'HASHLIFE', 'LIFEWIKI', 'CATAGOLUE',
]
TARGETS = set(life_codes)
words = [w for w in top_n_list('en', 50000) if w.isascii() and w.isalpha()]
counts = {}
for w in words:
    for ch in w:
        counts[ch] = counts.get(ch, 0) + 1
total = sum(counts.values())
pv = np.zeros(36)
for ch, k in counts.items():
    pv[ord(ch) - 87] += k / total
mean_letter = float((pv * np.arange(36)).sum())


def p_hit(letters, maxv=40 * 36):
    """Chance that a run of `letters` letters, each drawn from English letter frequencies, totals 135 or 136."""
    dist = np.zeros(maxv)
    dist[0] = 1.0
    for _ in range(letters):
        dist = np.convolve(dist, pv)[:maxv]
    return float(sum(dist[t] for t in TARGETS))


terms = [{'term': t, 'aq': aq(t), 'letters': sum(ch.isalpha() for ch in t)} for t in LIFE_TERMS]
for t in terms:
    t['p'] = p_hit(t['letters'])
six = [w for w in words if len(w) == 6]
life_words = sorted(w for w in words if aq(w) in TARGETS)
out = {
    'decoder_ok': decoder_ok,
    'life_codes': life_codes,
    'distinct': distinct,
    'keys_sha256': keys_sha256,
    'reachable': reachable,
    'odds': {
        'n_words': len(words),
        'mean_letter': mean_letter,
        'six_letter_words': len(six),
        'six_letter_hits': sum(aq(w) in TARGETS for w in six),
        'terms': terms,
        'hits': [t['term'] for t in terms if t['aq'] in TARGETS],
        'expected_hits': sum(t['p'] for t in terms),
        'p_at_least_one': 1 - float(np.prod([1 - t['p'] for t in terms])),
        'life_words': len(life_words),
        'life_word_examples': [w for w in ('always', 'assert') if w in life_words],
        'b0_share': sum(aq(w) % 3 == 2 for w in words) / len(words),
    },
    'aq_test_words': {w: aq(w) for w in [
        'CONWAY', 'HYPERSTITION', 'TIME', 'DEATH', 'AQ', 'CODEX', 'ZONE', 'GLIDER', 'ORACLE', 'SORCERY',
        'Nick Land', 'Lemurian Time War', 'Ccru 1997', 'Café', 'H.P. Lovecraft', 'Pandemonium', 'Xenotation',
        '2026', 'Áccéléràtion', 'Uttunul', 'Numogram', 'Ouroboros', 'Katak', 'naïve façade', '0', '',
    ]},
}
with open(os.path.join(HERE, 'reference.json'), 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=1, ensure_ascii=False)
o = out['odds']
print('decoder, 59,049 codes x 512 blocks:', 'PASS' if decoder_ok else 'FAIL')
print('Conway’s Life codes:', life_codes, '| distinct physics:', distinct, '| reachable:', reachable)
print(f"odds: mean letter {o['mean_letter']:.2f}; six-letter hits {o['six_letter_hits']}/{o['six_letter_words']}; "
      f"terms hit {o['hits']}; expected {o['expected_hits']:.2f}; P(at least one) {o['p_at_least_one']:.1%}; "
      f"{o['life_words']} of {o['n_words']} words are Life; B0 share {o['b0_share']:.1%}")
print('wrote codex/reference.json')
