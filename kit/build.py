"""Build SVL's four pages from source.

    python3 build.py                 # all four
    python3 build.py vanishing       # one or more of: numolab timesorcery vanishing codex
    python3 build.py --live FILE     # also check a saved copy of a live artifact against the build
    python3 build.py --zip           # also pack the kit (without out/ and site/) as out/svl-pages-kit.zip

Writes two versions of each page:
  out/<name>.html   the claude.ai artifact version (publish this with the Artifact tool)
  site/<file>.html  the standalone GitHub Pages version (SVL commits these himself)

All four pages share one header and one footer. Each body.html marks their places with
{{NAV}} and {{FOOT}}; nav() and foot() below write the markup, and shared/svl.css styles it.
In the artifact versions the links point at the claude.ai artifacts and open in a new tab;
in the site versions they point at the sibling files.
"""
import os
import re
import sys
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'out')
SITE = os.path.join(ROOT, 'site')

LAB_ART = 'https://claude.ai/artifact/1u4CmPQFRszxxz2beVf3Ae'
TS_ART = 'https://claude.ai/artifact/QHHN95PKtW8xcd5neG5txY'
VP_ART = 'https://claude.ai/artifact/3BpZc1MADJBMPu4YpdctVj'
CODEX_ART = 'https://claude.ai/artifact/JEiyxZC7ir6Kb9L84dinv4'

CREDIT = 'Built by SVL with Claude, October 2026.'
PAGES = [  # key, name, artifact, GitHub file; the order of the header
    ('numolab', 'Numogram Lab', LAB_ART, 'index.html'),
    ('timesorcery', 'Time-Sorcery', TS_ART, 'time-sorcery.html'),
    ('vanishing', 'Vanishing Point', VP_ART, 'vanishing-point.html'),
    ('codex', 'Codex', CODEX_ART, 'codex.html'),
]
CYPHERS = '<a href="https://cyphers.news" target="_blank" rel="noopener">Cyphers</a>'
SEP = ' <span class="sep" aria-hidden="true">·</span> '   # the spaces are where a narrow screen wraps the line
PLACEHOLDERS = ['{{NAV}}', '{{FOOT}}', '{{LAB_LINK}}', '{{TS_LINK}}', '{{CSS}}', '{{DATA}}', '{{FORECASTS}}', '{{LOGIC}}', '{{UI}}',
                '/*STYLE*/', '/*SCRIPT*/', '/*ENGINE*/']

FIT_META = '<meta name="claude:viewport-fit-sides" content="cover">\n'


def rd(*parts):
    with open(os.path.join(ROOT, *parts), encoding='utf-8') as f:
        return f.read()


def wr(path, text):
    left = [p for p in PLACEHOLDERS if p in text]
    if left:
        sys.exit(f'{os.path.relpath(path, ROOT)} still contains {", ".join(left)}')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:  # LF on every OS, matching GitHub
        f.write(text)
    return len(text)


def page_link(key, site):
    for k, name, art, file in PAGES:
        if k == key:
            return f'<a href="{file}">{name}</a>' if site else f'<a href="{art}" target="_blank" rel="noopener">{name}</a>'
    raise KeyError(key)


def nav(cur, site):
    """The shared header: all four pages in a fixed order, the current one unlinked."""
    items = [f'<span aria-current="page">{name}</span>' if k == cur else page_link(k, site) for k, name, _, _ in PAGES]
    return '<nav class="svl-nav" aria-label="SVL’s pages">' + SEP.join(items) + '</nav>'


def foot(cur, site):
    """The shared footer line: the credit, then the other three pages and Cyphers."""
    others = [page_link(k, site) for k, _, _, _ in PAGES if k != cur] + [CYPHERS]
    return f'<div class="svl-foot"><span>{CREDIT}</span><span>Elsewhere: {SEP.join(others)}</span></div>'


def shared(page, cur, site):
    return page.replace('{{NAV}}', nav(cur, site)).replace('{{FOOT}}', foot(cur, site))


def css(name):
    return rd(name, 'style.css') + '\n' + rd('shared', 'svl.css')


def standalone(src, title, desc):
    """Wrap an artifact page in a full document for GitHub Pages."""
    i = src.index('</style>') + len('</style>')
    pre = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta name="twitter:card" content="summary">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}</style>
'''
    return pre + src[:i] + '\n</head>\n<body>' + src[i:] + '\n</body>\n</html>\n'


def build_numolab():
    body = rd('numolab', 'body.html')
    js = (rd('numolab', 'lexicon.js') + '\n' + rd('shared', 'demons.js') + '\n' + rd('numolab', 'logic.js') + '\n'
          + rd('numolab', 'ui.js'))
    page = body.replace('/*STYLE*/', css('numolab')).replace('/*SCRIPT*/', js)
    a = wr(os.path.join(OUT, 'numogram-lab.html'), shared(page, 'numolab', False))
    desc = ("Interactive AQ gematria on the Ccru Numogram: zones and demons, the alphabet's mirror syzygies, "
            "the Pandemonium Matrix, cipher-hop loops and the number-spelling attractor.")
    src = shared(page, 'numolab', True).replace(FIT_META, '')
    s = wr(os.path.join(SITE, 'index.html'), standalone(src, 'Numogram Lab', desc))
    return 'numogram-lab.html', a, 'index.html', s


def build_timesorcery():
    body = rd('timesorcery', 'body.html')
    js = (rd('timesorcery', 'data.js') + '\n' + rd('shared', 'demons.js') + '\n' + rd('timesorcery', 'logic.js') + '\n'
          + rd('timesorcery', 'ui.js'))
    page = body.replace('/*STYLE*/', css('timesorcery')).replace('/*SCRIPT*/', js)
    a = wr(os.path.join(OUT, 'time-sorcery.html'), shared(page, 'timesorcery', False).replace('{{LAB_LINK}}', LAB_ART))
    desc = ("A nine-step walkthrough that turns the Ccru's number practices on the future: count, total, plex, "
            "date, name the demon, walk its rites, xenotate, transmit.")
    src = shared(page, 'timesorcery', True).replace('{{LAB_LINK}}', 'index.html').replace(FIT_META, '')
    s = wr(os.path.join(SITE, 'time-sorcery.html'), standalone(src, 'Time-Sorcery', desc))
    return 'time-sorcery.html', a, 'time-sorcery.html', s


def build_vanishing():
    page = (rd('vanishing', 'body.html')
            .replace('{{CSS}}', css('vanishing'))
            .replace('{{DATA}}', rd('vanishing', 'data.js'))
            .replace('{{FORECASTS}}', rd('vanishing', 'forecasts.js'))
            .replace('{{LOGIC}}', rd('vanishing', 'logic.js'))
            .replace('{{UI}}', rd('vanishing', 'ui.js')))
    a = wr(os.path.join(OUT, 'vanishing-point.html'),
           shared(page, 'vanishing', False).replace('{{LAB_LINK}}', LAB_ART).replace('{{TS_LINK}}', TS_ART))
    src = (shared(page, 'vanishing', True).replace('{{LAB_LINK}}', 'index.html')
           .replace('{{TS_LINK}}', 'time-sorcery.html').replace(FIT_META, ''))
    desc = ("A history of AI on a logarithmic spiral, from the first ledgers to the present, "
            "with dated forecasts extending into the future.")
    s = wr(os.path.join(SITE, 'vanishing-point.html'), standalone(src, 'Vanishing Point', desc))
    return 'vanishing-point.html', a, 'vanishing-point.html', s


def codex_odds():
    """The numbers in Codex's “how lucky is Conway?”, from codex/reference.json (codex/reference.py)."""
    import html
    import json
    ref = json.loads(rd('codex', 'reference.json'))
    o, life = ref['odds'], set(ref['life_codes'])
    terms = ''.join(f'<li{" class=\"hit\"" if t["aq"] in life else ""}>{html.escape(t["term"])} {t["aq"]}</li>' for t in o['terms'])
    return {
        'B0SHARE': f"{o['b0_share'] * 100:.0f}%",
        'MEANL': f"{o['mean_letter']:.1f}",
        'SIXAVG': f"{6 * o['mean_letter']:.0f}",
        'P6': f"{o['six_letter_hits'] / o['six_letter_words'] * 100:.1f}%",
        'N6': f"{o['six_letter_words']:,}",
        'P1': f"{o['p_at_least_one'] * 100:.0f}%",
        'EXPHITS': f"{o['expected_hits']:.2f}",
        'NLIFEWORDS': f"{o['life_words']:,}",
        'NWORDS': f"{o['n_words']:,}",
        'TERMS': terms,
    }


def build_codex():
    body = rd('codex', 'body.html')
    for k, v in codex_odds().items():
        body = body.replace('{{' + k + '}}', v)
    engine = rd('codex', 'engine.js')
    if '</script' in engine:
        sys.exit('codex/engine.js contains </script, which would end the inline script early')
    page = (body.replace('/*STYLE*/', css('codex')).replace('/*ENGINE*/', engine).replace('/*SCRIPT*/', rd('codex', 'ui.js')))
    left = sorted(set(re.findall(r'\{\{[A-Z0-9_]+\}\}', page)) - {'{{NAV}}', '{{FOOT}}'})
    if left:
        sys.exit(f'codex/body.html still contains {", ".join(left)}')
    a = wr(os.path.join(OUT, 'codex.html'), shared(page, 'codex', False))
    desc = ("Type a word: its AQ total becomes the law of a Life-like universe and its letters its starting shape, "
            "run beside Conway's Life, which is 135, like CONWAY.")
    src = shared(page, 'codex', True).replace(FIT_META, '')
    s = wr(os.path.join(SITE, 'codex.html'), standalone(src, 'Codex', desc))
    return 'codex.html', a, 'codex.html', s


BUILDS = {'numolab': build_numolab, 'timesorcery': build_timesorcery, 'vanishing': build_vanishing, 'codex': build_codex}


def compare_live(path, built):
    """A live artifact is the published file wrapped in a short document skeleton."""
    live = open(path, encoding='utf-8').read()
    for art in built:
        mine = open(os.path.join(OUT, art), encoding='utf-8').read()
        if mine in live:
            extra = len(live.encode()) - len(mine.encode())
            print(f'live copy {path} = out/{art} plus a {extra}-byte wrapper: the kit matches what is published')
            return True
    print(f'live copy {path} matches none of: {", ".join("out/" + b for b in built)}.'
          ' The published page has changed outside this kit (or the kit has unpublished edits): ask SVL before publishing.')
    return False


def pack():
    dest = os.path.join(OUT, 'svl-pages-kit.zip')
    os.makedirs(OUT, exist_ok=True)
    n = 0
    with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED) as z:
        for dirpath, dirnames, files in os.walk(ROOT):
            rel = os.path.relpath(dirpath, ROOT)
            if rel.split(os.sep)[0] in ('out', 'site', '__pycache__', '.git'):
                continue
            dirnames[:] = [d for d in dirnames if d not in ('out', 'site', '__pycache__', '.git')]
            for f in sorted(files):
                z.write(os.path.join(dirpath, f), os.path.join('svl-pages', rel, f) if rel != '.' else os.path.join('svl-pages', f))
                n += 1
    print(f'packed {n} files into out/svl-pages-kit.zip')


if __name__ == '__main__':
    args = sys.argv[1:]
    live = None
    if '--live' in args:
        k = args.index('--live'); live = args[k + 1]; del args[k:k + 2]
    zip_it = '--zip' in args
    args = [a for a in args if a != '--zip']
    names = args or list(BUILDS)
    built = []
    for n in names:
        if n not in BUILDS:
            sys.exit(f'unknown page {n!r}; choose from {", ".join(BUILDS)}')
        art, a, site, s = BUILDS[n]()
        built.append(art)
        print(f'{n:12s} out/{art} ({a:,} chars)   site/{site} ({s:,} chars)')
    ok = compare_live(live, built) if live else True
    if zip_it:
        pack()
    sys.exit(0 if ok else 1)
