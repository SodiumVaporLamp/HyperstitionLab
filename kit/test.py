"""Browser checks for SVL's four pages. Needs Playwright with Chromium
(both come pre-installed in Claude's cloud workspace), and npm for the accessibility scan.

    python3 test.py                       # all four pages
    python3 test.py vanishing             # one or more of: numolab timesorcery vanishing codex
    python3 test.py --vp php2shell,jev    # also photograph these Vanishing Point milestones (or f-… forecasts)

Rebuilds the pages it tests, then loads the standalone site/ versions at desktop and phone
sizes in light and dark: no script errors, no sideways scrolling, plus a run through each
page's controls. Screenshots go to out/shots/; look at them before publishing.
Requests to Google Fonts fail inside the sandbox; those console errors are ignored.

Vanishing Point's forecasts get their own checks (see "forecasts" below): the page as of
three faked dates, the spiral's geometry measured from the rendered marks, crossing the
one-day floor by wheel, pinch and keyboard, an axe accessibility scan with colour contrast,
and broken copies of forecasts.js to show check.js catches what it should.

Codex runs codex/check.js (its engine against LifeWiki, the Python reference, Numogram Lab's AQ
and lifelib), then drives the page: words, laws, fates, controls, house style in what the page
says, and an axe scan in light and dark.
"""
import json
import math
import re
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

import build

ROOT = Path(__file__).resolve().parent
SITE = ROOT / 'site'
SHOTS = ROOT / 'out' / 'shots'
FILES = {'numolab': 'index.html', 'timesorcery': 'time-sorcery.html', 'vanishing': 'vanishing-point.html', 'codex': 'codex.html'}
NAMES = {'numolab': 'Numogram Lab', 'timesorcery': 'Time-Sorcery', 'vanishing': 'Vanishing Point', 'codex': 'Codex'}
PRESETS = {
    'desk': dict(viewport={'width': 1280, 'height': 900}, device_scale_factor=1),
    'phone': dict(viewport={'width': 375, 'height': 812}, device_scale_factor=2, is_mobile=True, has_touch=True),
}
problems, notes = [], []


def url(page, hash_=''):
    return (SITE / FILES[page]).as_uri() + (('#' + hash_) if hash_ else '')


def open_page(browser, preset, scheme, page, hash_='', when=None, **extra):
    """when: a datetime to fake the page's clock (Date.now and new Date) from the first script on."""
    ctx = browser.new_context(color_scheme=scheme, **PRESETS[preset], **extra)
    pg = ctx.new_page()
    tag = f'{page}/{preset}-{scheme}' + (f'@{when:%Y-%m-%d}' if when else '')
    pg.on('pageerror', lambda e: problems.append(f'{tag}: script error: {e}'))
    pg.on('console', lambda m: problems.append(f'{tag}: console error: {m.text}')
          if m.type == 'error' and 'net::ERR_' not in m.text else None)
    if when:
        pg.clock.set_fixed_time(when)
    pg.goto(url(page, hash_))
    pg.wait_for_timeout(900)
    return ctx, pg, tag


def no_overflow(pg, tag):
    w = pg.viewport_size['width']
    sw = pg.evaluate('document.documentElement.scrollWidth')
    if sw > w:
        problems.append(f'{tag}: page scrolls sideways ({sw}px wide in a {w}px window)')


def step(tag, name, fn):
    try:
        fn()
    except Exception as e:  # report and carry on
        problems.append(f'{tag}: {name} failed: {str(e).splitlines()[0]}')


def shared_links(pg, tag, page):
    """The shared header names this page and links the other three; the footer adds Cyphers."""
    others = sorted(FILES[k] for k in FILES if k != page)
    cur = pg.inner_text('nav.svl-nav [aria-current="page"]').strip()
    if cur != NAMES[page]:
        problems.append(f'{tag}: header marks {cur!r} as the current page')
    head = sorted(pg.eval_on_selector_all('nav.svl-nav a', 'els => els.map(e => e.getAttribute("href"))'))
    if head != others:
        problems.append(f'{tag}: header links {head}, expected {others}')
    foot = sorted(pg.eval_on_selector_all('.svl-foot a', 'els => els.map(e => e.getAttribute("href"))'))
    if foot != sorted(others + ['https://cyphers.news']):
        problems.append(f'{tag}: footer links {foot}')
    if 'Built by SVL with Claude, October 2026.' not in pg.inner_text('.svl-foot'):
        problems.append(f'{tag}: footer is missing the credit line')


def smoke(browser, page):
    for preset in PRESETS:
        for scheme in ('light', 'dark'):
            ctx, pg, tag = open_page(browser, preset, scheme, page)
            no_overflow(pg, tag)
            if preset == 'desk' and scheme == 'light':
                step(tag, 'shared header and footer', lambda: shared_links(pg, tag, page))
            pg.screenshot(path=str(SHOTS / f'{page}-{preset}-{scheme}.png'))
            if scheme == 'light':
                pg.screenshot(path=str(SHOTS / f'{page}-{preset}-full.png'), full_page=True)
            ctx.close()


def numolab(browser):
    ctx, pg, tag = open_page(browser, 'phone', 'dark', 'numolab', 'zones')

    def pair_card():
        pg.fill('#in-a', 'Sam Altman'); pg.fill('#in-b', 'Dario Amodei'); pg.wait_for_timeout(300)
        v = pg.inner_text('#between')
        assert 'Same zone · 4' in v and 'Ordinal (94)' in v, f'verdict reads {v!r}'
        assert len(pg.query_selector_all('#pair-table td.eq')) == 2, 'Ordinal 94 should be shaded in both columns'
        pg.query_selector('#pair-card').screenshot(path=str(SHOTS / 'numolab-pair-card.png'))
        pg.fill('#in-a', 'Listen'); pg.fill('#in-b', 'Silent'); pg.wait_for_timeout(300)
        assert 'exact twins' in pg.inner_text('#between'), 'anagrams should read as exact twins'
        pg.fill('#in-a', ''); pg.wait_for_timeout(300)
        assert 'Waiting' in pg.inner_text('#between'), 'an empty phrase should wait'
    step(tag, 'pair card', pair_card)

    def card_fits():
        """The inputs and the pair card fit on one phone screen under the sticky tab rail (CLAUDE.md),
        for the example pairs and for every demon the card can show, with long phrase names."""
        room = 812 - pg.evaluate("document.querySelector('.rail').getBoundingClientRect().height")
        span = "Math.round(document.querySelector('#pair-card').getBoundingClientRect().bottom - document.querySelector('.pair-inputs').getBoundingClientRect().top)"
        longest = pg.evaluate("""() => { const by = {};
          for (const p of Object.values(LEXICON).flat()) { const z = dr(values(p).aq);
            if (/[0-9]/.test(p) || p.length < 14 || p.length > 17) continue;
            if (!by[z] || p.length > by[z].length) by[z] = p; }
          return by; }""")
        cases = [tuple(x) for x in pg.evaluate('EXAMPLE_PAIRS')]
        cases += [(longest[str(a)], longest[str(b)]) for a in range(1, 10) for b in range(1, a)]
        worst = (0, None)
        for a, b in cases:
            pg.fill('#in-a', a); pg.fill('#in-b', b); pg.wait_for_timeout(30)
            h = pg.evaluate(span)
            worst = max(worst, (h, f'{a} / {b}'))
        assert worst[0] <= room, f'inputs and card run to {worst[0]}px for {worst[1]}, with {room:.0f}px under the rail'
        notes.append(f'pair card: {len(cases)} pairs fit a 375×812 phone; the tallest, {worst[1]}, runs to {worst[0]} of {room:.0f}px')
    step(tag, 'pair card fits one phone screen', card_fits)

    def demon_text():
        pg.fill('#in-a', 'Man'); pg.fill('#in-b', 'Machine'); pg.wait_for_timeout(200)
        t = pg.evaluate('demonLore(8, 1).t')
        assert t in pg.inner_text('#between'), 'the pair card should carry the demon’s description'
        note = pg.inner_text('#cipher-note')
        assert 'GPT6 is AQ 76 → zone 4 but Ordinal 43 → zone 7' in note and 'letters alone' in note, f'cipher note reads {note!r}'
        pg.click('#tab-demons'); pg.wait_for_timeout(400)
        pg.click('#pm .cell[data-k="6::4"]'); pg.wait_for_timeout(100)
        d = pg.inner_text('#pm-detail')
        assert pg.evaluate('demonLore(6, 4).r') in d and 'Paraphrased from the Pandemonium Matrix, mesh 19' in d, f'demon detail reads {d!r}'
        assert 'Chuckles' in d, 'the detail should give the Matrix’s other names'
    step(tag, 'demon descriptions and the cipher note', demon_text)
    ctx.close()
    for scheme in ('light', 'dark'):
        for tab in ['zones', 'alphabet', 'demons', 'loops', 'attractor']:
            ctx, pg, tag = open_page(browser, 'phone', scheme, 'numolab', tab)
            pg.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)")
            pg.wait_for_timeout(500)
            no_overflow(pg, f'{tag}#{tab}')
            ctx.close()


def timesorcery(browser):
    ctx, pg, tag = open_page(browser, 'desk', 'light', 'timesorcery')
    verdict = lambda: pg.inner_text('#verdict')

    def examples():
        for i in range(5):
            pg.click(f'#examples .chip[data-i="{i}"]'); pg.wait_for_timeout(200)
        assert verdict().strip(), 'no verdict after the examples'
    step(tag, 'example chips', examples)

    def binomic():
        pg.click('#binomic'); pg.wait_for_timeout(250); pg.click('#binomic'); pg.wait_for_timeout(250)
    step(tag, 'binomic toggle', binomic)

    def years():
        pg.fill('#year', '1850'); pg.wait_for_timeout(300)
        assert pg.is_visible('#year-err'), 'no error shown for 1850'
        pg.fill('#year', '1900'); pg.wait_for_timeout(300)
        pg.fill('#year', '2999'); pg.wait_for_timeout(300)
    step(tag, 'year field', years)

    def draws():
        for src in ['futures', 'q101', 'lab']:
            pg.select_option('#src', src); pg.click('#draw'); pg.wait_for_timeout(250)
            assert pg.input_value('#seed'), f'no seed drawn from {src}'
        pg.click('#ryear'); pg.wait_for_timeout(250)
    step(tag, 'random draws', draws)

    def dots():
        pg.click('#examples .chip[data-i="0"]'); pg.wait_for_timeout(250)
        pg.query_selector_all('#spiral .sd')[40].click(); pg.wait_for_timeout(250)
    step(tag, 'spiral dot', dots)

    def rites():
        pg.click('#examples .chip[data-i="0"]'); pg.wait_for_timeout(250)
        btns = pg.query_selector_all('#pub button[data-p]')
        if btns:
            btns[0].click(); pg.wait_for_timeout(300)
    step(tag, 'rite buttons', rites)

    def empty_seed():
        pg.fill('#seed', ''); pg.wait_for_timeout(300)
        assert pg.inner_text('#year-err').strip(), 'no message for an empty seed'
        pg.fill('#seed', 'Accelerate'); pg.fill('#year', '2030'); pg.wait_for_timeout(300)
    step(tag, 'seed field', empty_seed)

    def zero_and_demon():
        """Step 5's zone-0 sentence follows the selected count; step 6 carries the demon's description."""
        pg.click('#examples .chip[data-i="0"]'); pg.wait_for_timeout(300)
        assert pg.evaluate('demonLore(6, 4).t') in pg.inner_text('#i6'), 'step 6 should describe Tchakki'
        assert 'It stands between zone 6, your phrase’s, and zone 4, your year’s' in pg.inner_text('#i6'), 'step 6 should say why the demon appears'
        pg.fill('#seed', 'Year Zero'); pg.fill('#year', '2000'); pg.wait_for_timeout(400)
        run = pg.inner_text('#i5')
        assert '1900 is the only year that lands in zone 0 in this count' in run, f'running count note reads {run!r}'
        pg.click('#binomic'); pg.wait_for_timeout(400)
        two = pg.inner_text('#i5')
        assert 'every year ending in 00, from 1900 to 2900' in two and 'K-00' in two, f'two-digit note reads {two!r}'
        assert '1900, 2000 … 2900' in pg.inner_html('#spiral .origin'), 'the origin’s title should list the two-digit zone-0 years'
        pg.click('#binomic'); pg.wait_for_timeout(300)
    step(tag, 'zone-0 years and the demon card', zero_and_demon)
    ctx.close()


def vanishing(browser):
    ctx, pg, tag = open_page(browser, 'desk', 'light', 'vanishing')
    st = lambda: pg.evaluate('window.__vanishing.state')
    box = pg.query_selector('#tunnel').bounding_box()

    def nexts():
        s0 = st()['sel']
        for _ in range(3):
            pg.click('#next'); pg.wait_for_timeout(1500)
        assert st()['sel'] != s0, 'Next did not move'
    step(tag, 'Prev/Next', nexts)

    def click_mark():
        hits = pg.evaluate('window.__vanishing.hits()')
        big = [h for h in hits if h['rad'] > 3 and 60 < h['x'] < box['width'] - 60 and 60 < h['y'] < box['height'] - 60]
        h = big[len(big) // 3]
        pg.mouse.click(box['x'] + h['x'], box['y'] + h['y']); pg.wait_for_timeout(1500)
        assert st()['sel'] == h['id'], f"clicked {h['id']}, selected {st()['sel']}"
    step(tag, 'click a mark', click_mark)

    def wheel():
        d0 = st()['D']
        pg.mouse.move(box['x'] + box['width'] / 2 + 100, box['y'] + box['height'] / 2)
        for _ in range(6):
            pg.mouse.wheel(0, -120); pg.wait_for_timeout(50)
        pg.wait_for_timeout(300)
        assert st()['D'] != d0, 'wheel did not travel'
    step(tag, 'wheel', wheel)

    def filters():
        total = pg.inner_text('#listcount')
        pg.click('#lanechips [data-th="lang"]'); pg.wait_for_timeout(1500)
        assert 'Language' in pg.inner_text('#listcount'), 'lane filter'
        pg.click('#lanechips [data-th=""]'); pg.wait_for_timeout(300)
        pg.click('#lanechips [data-demons="1"]'); pg.wait_for_timeout(1500)
        assert 'demons' in pg.inner_text('#listcount'), 'demons filter'
        pg.click('#lanechips [data-demons="1"]'); pg.wait_for_timeout(300)
        pg.click('#labchips [data-lab="anthropic"]'); pg.wait_for_timeout(1500)
        assert st()['lab'] == 'anthropic', 'lab chip'
        pg.click('#labchips [data-lab="anthropic"]'); pg.wait_for_timeout(300)
        assert st()['lab'] is None, 'lab chip off'
        pg.check('#bitter'); pg.wait_for_timeout(300)
        assert pg.inner_text('#listcount') != total, 'Bitter Lesson view'
        pg.uncheck('#bitter'); pg.check('#keyonly'); pg.wait_for_timeout(300); pg.uncheck('#keyonly')
    step(tag, 'filters', filters)

    def centres():
        for vp in ['k2045', 'now', 'doomsday']:
            pg.select_option('#vp', vp); pg.wait_for_timeout(500)
            assert st()['vp'] == vp, vp
        pg.click('#eras .chip:has-text("Today")'); pg.wait_for_timeout(1800)
    step(tag, 'centres and era chips', centres)

    def play():
        pg.click('#eras .chip:has-text("K-00")'); pg.wait_for_timeout(1800)
        d0 = st()['D']; pg.click('#play'); pg.wait_for_timeout(2500)
        assert st()['D'] != d0, 'Descend did not move'
        pg.click('#play'); pg.wait_for_timeout(200)
        assert not st()['playing'], 'did not pause'
    step(tag, 'Descend', play)

    def keys_and_list():
        s0 = st()['sel']
        pg.focus('#tunnel'); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(1500)
        assert st()['sel'] != s0, 'arrow key'
        pg.click('.li[data-id="transformer"]'); pg.wait_for_timeout(1500)
        assert st()['sel'] == 'transformer', 'list click'
    step(tag, 'keyboard and list', keys_and_list)
    pg.screenshot(path=str(SHOTS / 'vanishing-after-controls.png'))
    ctx.close()

    ctx, pg, tag = open_page(browser, 'desk', 'light', 'vanishing', 'pacioli', reduced_motion='reduce')
    step(tag, 'hash link', lambda: (_ for _ in ()).throw(AssertionError('#pacioli did not open its card'))
         if pg.evaluate('window.__vanishing.state.sel') != 'pacioli' else None)

    def forced_dark():
        pg.evaluate("document.documentElement.setAttribute('data-theme','dark')"); pg.wait_for_timeout(400)
        pg.query_selector('.tunnel-frame').screenshot(path=str(SHOTS / 'vanishing-forced-dark.png'))
        s0 = pg.evaluate('window.__vanishing.state.sel')
        pg.click('#play'); pg.wait_for_timeout(4300)
        moved = pg.evaluate('window.__vanishing.state.sel') != s0
        pg.click('#play')
        assert moved, 'reduced-motion slideshow did not advance'
    step(tag, 'forced dark theme and reduced motion', forced_dark)
    ctx.close()

    ctx, pg, tag = open_page(browser, 'phone', 'light', 'vanishing')

    def tap():
        pg.query_selector('#tunnel').scroll_into_view_if_needed(); pg.wait_for_timeout(300)
        hits = pg.evaluate('window.__vanishing.hits()')
        b = pg.query_selector('#tunnel').bounding_box()
        h = [x for x in hits if x['rad'] > 3 and 40 < x['x'] < b['width'] - 40 and 40 < x['y'] < b['height'] - 40][2]
        pg.touchscreen.tap(b['x'] + h['x'], b['y'] + h['y']); pg.wait_for_timeout(1500)
        assert pg.evaluate('window.__vanishing.state.sel') == h['id'], 'tap did not select'
    step(tag, 'tap a mark', tap)
    ctx.close()


# ---------------------------------------------------------------------------------------------
# Vanishing Point: forecasts
# ---------------------------------------------------------------------------------------------
UTC = timezone.utc
CLOCKS = {  # the page as of these moments
    'today': datetime(2026, 10, 23, 12, tzinfo=UTC),
    'nov14': datetime(2026, 11, 14, 12, tzinfo=UTC),
    '2031': datetime(2031, 1, 1, 12, tzinfo=UTC),
}
GROW = 2.5
LANES = {'model': 0, 'cap': 1, 'reck': 2, 'learn': 3, 'lang': 4, 'hyp': 5}
LANE_D = [0.30, 0.18, 0.06, -0.06, -0.18, -0.30]
LAND_D = 0.45


def load_js(name, var):
    """Read a data array straight from the source file with node, not from the page."""
    out = subprocess.run(['node', '-e', f"process.stdout.write(JSON.stringify(require('./vanishing/{name}').{var}))"],
                         cwd=ROOT, capture_output=True, text=True, check=True).stdout
    return json.loads(out)


# The dates are computed here from the stated conventions, independently of the page's own code:
# a year sits mid-year, a month mid-month, a day at noon; deadlines, windows' ends and 50% dates
# sit at the end of the period they name.
def _parts(d):
    p = [int(x) for x in d.lstrip('~').split('-')] if not d.startswith('-') else [int(d)]
    return p + [0] * (3 - len(p))


def dec_year(dt):
    y0 = datetime(dt.year, 1, 1, tzinfo=UTC)
    return dt.year + (dt - y0) / (datetime(dt.year + 1, 1, 1, tzinfo=UTC) - y0)


def mid_year(d):
    y, m, day = _parts(d)
    if not m:
        return y + 0.5
    if not day:
        return y + (m - 0.5) / 12
    return dec_year(datetime(y, m, day, 12, tzinfo=UTC))


def end_of(d):
    y, m, day = _parts(d)
    if day:
        return datetime(y, m, day, tzinfo=UTC) + timedelta(days=1)
    if m:
        return datetime(y + (m == 12), m % 12 + 1, 1, tzinfo=UTC)
    return datetime(y + 1, 1, 1, tzinfo=UTC)


def start_of(d):
    y, m, day = _parts(d)
    return datetime(y, m or 1, day or 1, tzinfo=UTC)


def ring_year(f):
    if f['type'] == 'date':
        return mid_year(f['at'])
    key = {'deadline': 'due', 'bet': 'due', 'window': 'to', 'spread': 'p50'}[f['type']]
    return dec_year(end_of(f[key]))


def expected_status(f, now):
    o = f.get('outcome')
    if o and (not o.get('after') or now >= start_of(o['after'])):
        return o['is']
    key = {'date': 'at', 'deadline': 'due', 'bet': 'due', 'window': 'to'}.get(f['type'])
    return 'closed' if key and now >= end_of(f[key]) else 'open'


def fstate(pg):
    return pg.evaluate("""() => { const v = window.__vanishing, r = v.range();
      return { ahead: v.state.ahead, vp: v.state.vp, D: v.state.D, push: v.state.push, sel: v.state.sel, DMIN: r.DMIN, DMAX: r.DMAX,
               tag: document.querySelector('#headtag').textContent }; }""")


def set_depth(pg, D):
    pg.evaluate("v => { const s = document.querySelector('#depth'); s.value = v; s.dispatchEvent(new Event('input')); }", f'{-D:.4f}')
    pg.wait_for_timeout(150)


def to_floor(pg):
    pg.evaluate("() => { const s = document.querySelector('#depth'); s.value = s.max; s.dispatchEvent(new Event('input')); }")
    pg.wait_for_timeout(150)


def forecasts_clock(browser):
    """The page as of 23 October 2026, 14 November 2026 and 1 January 2031: every status matches
    one computed here from the data; Doomsday resolves; Vinge's window closes."""
    fcs = load_js('forecasts.js', 'FORECASTS')
    for name, when in CLOCKS.items():
        ctx, pg, tag = open_page(browser, 'desk', 'light', 'vanishing', when=when)

        def statuses():
            got = {f['id']: f['status'] for f in pg.evaluate('window.__vanishing.forecasts()')}
            for f in fcs:
                want = expected_status(f, when)
                assert got.get(f['id']) == want, f"{f['id']} reads {got.get(f['id'])!r}, expected {want!r}"
            open_rows = pg.eval_on_selector_all('#fc-open .fi', 'els => els.map(e => e.dataset.id)')
            done_rows = pg.eval_on_selector_all('#fc-done .fi', 'els => els.map(e => e.dataset.id)')
            assert sorted(open_rows) == sorted(f['id'] for f in fcs if expected_status(f, when) == 'open'), 'open list'
            assert len(open_rows) + len(done_rows) == len(fcs), 'every forecast is listed once'
            count = pg.inner_text('#fccount')
            assert f"{len(fcs)} forecasts" in count and 'milestones' in count, f'count line reads {count!r}'
        step(tag, 'statuses against the data', statuses)

        def specifics():
            vp = pg.evaluate('window.__vanishing.state.vp')
            if name == 'today':
                assert vp == 'doomsday', f'default centre {vp}'
                assert 'f-doomsday' in pg.eval_on_selector_all('#fc-open .fi', 'els => els.map(e => e.dataset.id)')
            if name == 'nov14':
                assert vp == 'now', f'after 13 November the page should open on now, not {vp}'
                assert '(passed)' in pg.inner_text('#vp option[value="doomsday"]')
                pg.click('.fi[data-id="f-doomsday"]'); pg.wait_for_timeout(500)
                st = fstate(pg)
                assert not st['ahead'], 'a resolved forecast is shown in the history view'
                assert 'Missed' in pg.inner_text('#card'), 'Doomsday card should read Missed'
                assert any(h['id'] == 'f-doomsday' for h in pg.evaluate('window.__vanishing.hits()')), 'Doomsday ring not drawn'
                pg.query_selector('.stage').screenshot(path=str(SHOTS / 'vp-clock-nov14-doomsday.png'))
            if name == '2031':
                pg.click('.fi[data-id="f-vinge-window"]'); pg.wait_for_timeout(500)
                card = pg.inner_text('#card')
                assert 'Closed, no verdict yet' in card and 'no verdict is recorded' in card, 'Vinge window card'
                assert any(h['id'] == 'f-vinge-window' for h in pg.evaluate('window.__vanishing.hits()')), 'Vinge ring not drawn'
                pg.query_selector('.stage').screenshot(path=str(SHOTS / 'vp-clock-2031-vinge.png'))
            pg.query_selector('#fclist').screenshot(path=str(SHOTS / f'vp-clock-{name}-list.png'))
        step(tag, 'what changes with the date', specifics)
        ctx.close()

        # the same dates on a phone, looking ahead
        ctx, pg, tag = open_page(browser, 'phone', 'dark' if name == 'nov14' else 'light', 'vanishing', when=when)
        no_overflow(pg, tag)

        def phone():
            pg.click('#ahead'); pg.wait_for_timeout(1600)   # the turn-round animates for 1.1 s
            pg.query_selector('.tunnel-box').screenshot(path=str(SHOTS / f'vp-clock-{name}-phone-ahead.png'))
            pg.query_selector('#card').screenshot(path=str(SHOTS / f'vp-clock-{name}-phone-card.png'))
            no_overflow(pg, tag + ' looking ahead')
        step(tag, 'phone, looking ahead', phone)
        ctx.close()

    # check.js as of the same dates: a window that closes without a verdict is flagged
    for name, when in CLOCKS.items():
        out = subprocess.run(['node', 'vanishing/check.js', '--now', f'{when:%Y-%m-%d}'], cwd=ROOT, capture_output=True, text=True)
        if out.returncode:
            problems.append(f'check.js --now {when:%Y-%m-%d} failed:\n{out.stdout}')
        flagged = 'f-vinge-window: its window closed' in out.stdout
        if flagged != (name == '2031'):
            problems.append(f'check.js --now {when:%Y-%m-%d}: Vinge window warning {"missing" if name == "2031" else "unexpected"}')
    notes.append('forecasts as of 23 Oct 2026, 14 Nov 2026 and 1 Jan 2031: out/shots/vp-clock-*.png')


def measure_marks(pg, kinds):
    """Where each mark was drawn, and whether a ring or dot is really in the canvas pixels there."""
    return pg.evaluate("""kinds => {
      const v = window.__vanishing, g = v.geo(), cv = document.querySelector('#tunnel');
      const c = cv.getContext('2d'), k = cv.width / g.W;
      return v.hits().filter(h => kinds.includes(h.kind)).map(h => {
        // sample the canvas around the mark at three radii: a sample counts if any of them is ink
        // (crimson, or dark) rather than the pale ribbon and background
        const ink = (x, y) => { const px = c.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
          return px[3] > 0 && (Math.abs(px[0] - px[1]) + Math.abs(px[1] - px[2]) + Math.abs(px[0] - px[2]) > 30 || px[0] + px[1] + px[2] < 330); };
        let inked = 0, n = 24;
        for (let i = 0; i < n; i++) {
          const a = i / n * Math.PI * 2;
          if ([1.6, 1.0, 0.4].some(d => { const rr = Math.max(0.8, h.rad - d); return ink(h.x + rr * Math.cos(a), h.y + rr * Math.sin(a)); })) inked++;
        }
        return { id: h.id, kind: h.kind, x: h.x, y: h.y, rad: h.rad, inked: inked / n, cx: g.cx, cy: g.cy, R0: g.R0, W: g.W, H: g.H };
      });
    }""", kinds)


def check_geometry(marks, lane_of, logtau, D, sign, tag, what):
    """Each mark's radius and angle, measured on screen, against log time computed here from its date:
    one turn and a 2.5-fold radius per decade, so ten times further is one turn further out."""
    us, angs, n = [], [], 0
    for m in marks:
        if m['id'] not in logtau:
            continue
        r = math.hypot(m['x'] - m['cx'], m['y'] - m['cy'])
        u_meas = math.log(r / m['R0'], GROW) - LANE_D[lane_of[m['id']]]
        u_exp = logtau[m['id']] - D
        phi = math.atan2(m['x'] - m['cx'], -(m['y'] - m['cy']))
        dphi = (phi - sign * 2 * math.pi * u_exp + math.pi) % (2 * math.pi) - math.pi
        us.append((logtau[m['id']], u_meas + D)); angs.append(dphi); n += 1
        if abs(u_meas - u_exp) > 0.04:
            problems.append(f'{tag}: {what} {m["id"]} sits {u_meas - u_exp:+.3f} turns from where its date puts it')
        if abs(dphi) > 0.26:
            problems.append(f'{tag}: {what} {m["id"]} is {math.degrees(dphi):+.1f}° off its angle')
    if n < 3:
        problems.append(f'{tag}: only {n} {what} measured')
        return None
    # the plainest case: the pair in one lane whose times differ most nearly tenfold
    best = None
    pos = {m['id']: m for m in marks if m['id'] in logtau}
    ids = list(pos)
    for i, a in enumerate(ids):
        for b in ids[i + 1:]:
            if lane_of[a] != lane_of[b]:
                continue
            gap = abs(abs(logtau[a] - logtau[b]) - 1)
            if best is None or gap < best[0]:
                best = (gap, a, b)
    if best and best[0] < 0.05:
        _, a, b = best
        if logtau[a] > logtau[b]:
            a, b = b, a
        ra = math.hypot(pos[a]['x'] - pos[a]['cx'], pos[a]['y'] - pos[a]['cy'])
        rb = math.hypot(pos[b]['x'] - pos[b]['cx'], pos[b]['y'] - pos[b]['cy'])
        pa = math.degrees(math.atan2(pos[a]['x'] - pos[a]['cx'], -(pos[a]['y'] - pos[a]['cy'])))
        pb = math.degrees(math.atan2(pos[b]['x'] - pos[b]['cx'], -(pos[b]['y'] - pos[b]['cy'])))
        notes.append(f'  tenfold pair: {a} and {b}, {10 ** (logtau[b] - logtau[a]):.2f} times as far: radius ×{rb / ra:.3f} '
                     f'(one turn is ×2.5, so {math.log(rb / ra, GROW):.3f} turns), angle {((pb - pa + 180) % 360) - 180:+.1f}° apart')
    # least-squares slope of measured log-radius (in turns) against log10 of the time: 1.000 is one turn per decade
    xs, ys = [a for a, _ in us], [b for _, b in us]
    mx, my = sum(xs) / n, sum(ys) / n
    slope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
    if abs(slope - 1) > 0.02:
        problems.append(f'{tag}: {what}: {slope:.3f} turns per decade, expected 1.000')
    return n, slope, max(abs(a) for a in angs)


def forecasts_geometry(browser):
    fcs = {f['id']: f for f in load_js('forecasts.js', 'FORECASTS')}
    evs = {e['id']: e for e in load_js('data.js', 'EVENTS')}
    when = CLOCKS['today']
    now_y = dec_year(when)
    ctx, pg, tag = open_page(browser, 'desk', 'light', 'vanishing', when=when, reduced_motion='reduce')

    def ahead():
        pg.click('#ahead'); pg.wait_for_timeout(300)
        for D in (0.45, -0.6):
            set_depth(pg, D)
            marks = measure_marks(pg, ['fc'])
            for m in marks:
                inside = m['rad'] + 2 <= m['x'] <= m['W'] - m['rad'] - 2 and m['rad'] + 2 <= m['y'] <= m['H'] - m['rad'] - 2
                if inside and m['inked'] < 0.5:
                    problems.append(f'{tag}: no ring in the pixels where {m["id"]} is said to be drawn ({m["inked"]:.0%} inked)')
            logtau = {i: math.log10(ring_year(f) - now_y) for i, f in fcs.items() if ring_year(f) > now_y}
            res = check_geometry(marks, {i: LANES[f['th']] for i, f in fcs.items()}, logtau, D, +1, tag, 'forecast ring')
            if res:
                notes.append(f'looking ahead at depth {D}: {res[0]} rings, {res[1]:.4f} turns per decade, worst angle {math.degrees(res[2]):.2f}°')
    step(tag, 'geometry looking ahead', ahead)

    def history():
        pg.click('#ahead'); pg.wait_for_timeout(300)
        pg.select_option('#vp', 'now'); pg.wait_for_timeout(300)
        for D in (1.6, 0.3):
            set_depth(pg, D)
            marks = measure_marks(pg, ['ev', 'fc'])
            logtau, lane_of = {}, {}
            for m in marks:
                if m['kind'] == 'ev':
                    e = evs[m['id']]
                    # model releases are packed so tightly that nudging moves them further than the tolerance
                    if e['d'].startswith('-') or e['th'] == 'model':
                        continue
                    logtau[m['id']] = math.log10(max(now_y - mid_year(e['d']), 1 / 365.2425)); lane_of[m['id']] = LANES[e['th']]
                else:
                    f = fcs[m['id']]
                    logtau[m['id']] = math.log10(max(now_y - ring_year(f), 1 / 365.2425)); lane_of[m['id']] = LANES[f['th']]
            # milestones that share a lane are nudged apart by up to 0.011 decades, and forecasts by 0.03
            res = check_geometry(marks, lane_of, logtau, D, -1, tag, 'mark')
            if res:
                notes.append(f'history (centre now) at depth {D}: {res[0]} marks, {res[1]:.4f} turns per decade, worst angle {math.degrees(res[2]):.2f}°')
    step(tag, 'geometry in the history view', history)
    ctx.close()


def crossing(browser):
    """The one-day floor: a plain stop centred on Doomsday or 2045; centred on now, going on past it
    turns the spiral round to look ahead, and back. By wheel, pinch, keyboard and the button."""
    when = CLOCKS['today']
    ctx, pg, tag = open_page(browser, 'desk', 'light', 'vanishing', when=when, reduced_motion='reduce')
    box = pg.query_selector('#tunnel').bounding_box()
    pg.mouse.move(box['x'] + box['width'] / 2 + 90, box['y'] + box['height'] / 2)

    def stops():
        for vp in ('doomsday', 'k2045'):
            pg.select_option('#vp', vp); pg.wait_for_timeout(200); to_floor(pg)
            for _ in range(10):
                pg.mouse.wheel(0, -120); pg.wait_for_timeout(30)
            st = fstate(pg)
            assert not st['ahead'] and st['vp'] == vp and abs(st['D'] - st['DMIN']) < 1e-6, f'{vp}: {st}'
            assert 'starts from today' in st['tag'], f'{vp}: head tag reads {st["tag"]!r}'
    step(tag, 'Doomsday and 2045 stop at the floor', stops)

    def wheel():
        pg.select_option('#vp', 'now'); pg.wait_for_timeout(200); to_floor(pg)
        pg.mouse.wheel(0, -100); pg.wait_for_timeout(60)
        st = fstate(pg)
        assert not st['ahead'] and 0 < st['push'] < 1 and 'keep going' in st['tag'], f'one notch past the floor: {st}'
        pg.wait_for_timeout(900)
        assert fstate(pg)['push'] == 0, 'pressure should drain when the reader stops'
        for _ in range(3):
            pg.mouse.wheel(0, -100); pg.wait_for_timeout(30)
        st = fstate(pg)   # reduced motion: no animation, so it has already landed
        assert st['ahead'] and abs(st['D'] - LAND_D) < 1e-6, f'three notches past the floor should turn round and land at {LAND_D}: {st}'
        for _ in range(4):
            pg.mouse.wheel(0, -100); pg.wait_for_timeout(30)
        assert abs(fstate(pg)['D'] - LAND_D) < 1e-6, 'the rest of the gesture should be swallowed'
        pg.wait_for_timeout(400)
        pg.mouse.wheel(0, 100); pg.wait_for_timeout(60)
        d1 = fstate(pg)['D']
        assert d1 > LAND_D, 'scrolling out looks further ahead'
        pg.mouse.wheel(0, -100); pg.wait_for_timeout(60)
        assert fstate(pg)['D'] < d1, 'scrolling in comes back toward today'
        to_floor(pg)
        for _ in range(4):
            pg.mouse.wheel(0, -100); pg.wait_for_timeout(30)
        st = fstate(pg)
        assert not st['ahead'] and st['vp'] == 'now', f'past today again should turn back to the past: {st}'
    step(tag, 'crossing by wheel', wheel)

    def keys():
        to_floor(pg)
        pg.focus('#tunnel'); pg.keyboard.press('ArrowUp'); pg.wait_for_timeout(60)
        st = fstate(pg)
        assert not st['ahead'] and st['push'] >= 0.5, f'one press at the floor: {st}'
        assert 'look ahead' in pg.inner_text('#vplive'), 'the live region should say what happens next'
        pg.keyboard.press('ArrowUp'); pg.wait_for_timeout(100)
        st = fstate(pg)
        assert st['ahead'], f'two presses at the floor turn round: {st}'
        pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(60)
        assert fstate(pg)['D'] > st['D'], 'ArrowDown looks further ahead'
        pg.keyboard.press('End'); pg.wait_for_timeout(100)
        pg.keyboard.press('ArrowUp'); pg.keyboard.press('ArrowUp'); pg.wait_for_timeout(100)
        assert not fstate(pg)['ahead'], 'two presses at the floor turn back'
    step(tag, 'crossing by keyboard', keys)

    def button():
        pg.select_option('#vp', 'doomsday'); pg.wait_for_timeout(200)
        set_depth(pg, 1.0)
        pg.click('#ahead'); pg.wait_for_timeout(200)
        st = fstate(pg)
        assert st['ahead'] and pg.get_attribute('#ahead', 'aria-pressed') == 'true', f'button on: {st}'
        pg.click('#ahead'); pg.wait_for_timeout(200)
        st = fstate(pg)
        assert not st['ahead'] and st['vp'] == 'doomsday' and abs(st['D'] - 1.0) < 1e-6, f'button off returns where it was: {st}'
    step(tag, 'the Looking ahead button', button)
    ctx.close()

    # with motion: the turn-round animates out from the floor
    ctx, pg, tag = open_page(browser, 'desk', 'light', 'vanishing', when=when)

    def animated():
        pg.select_option('#vp', 'now'); pg.wait_for_timeout(200); to_floor(pg)
        pg.focus('#tunnel'); pg.keyboard.press('ArrowUp'); pg.keyboard.press('ArrowUp'); pg.wait_for_timeout(200)
        mid = fstate(pg)
        assert mid['ahead'] and mid['D'] < LAND_D - 0.05, f'mid-animation: {mid}'
        pg.wait_for_timeout(1300)
        assert abs(fstate(pg)['D'] - LAND_D) < 1e-6, 'should land after the animation'
    step(tag, 'turning round with motion', animated)
    ctx.close()

    # a two-finger pinch on a phone, sent as raw touch events
    ctx, pg, tag = open_page(browser, 'phone', 'light', 'vanishing', when=when, reduced_motion='reduce')

    def pinch():
        pg.select_option('#vp', 'now'); pg.wait_for_timeout(200)
        pg.query_selector('#tunnel').scroll_into_view_if_needed(); pg.wait_for_timeout(200)
        to_floor(pg)
        b = pg.query_selector('#tunnel').bounding_box()
        cx, cy = b['x'] + b['width'] / 2, b['y'] + b['height'] / 2
        cdp = ctx.new_cdp_session(pg)

        def spread(d0, d1, steps=12):
            pts = lambda d: [{'x': cx - d / 2, 'y': cy, 'id': 0}, {'x': cx + d / 2, 'y': cy, 'id': 1}]
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': pts(d0)})
            for k in range(1, steps + 1):
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': pts(d0 + (d1 - d0) * k / steps)})
                pg.wait_for_timeout(16)
            mid = fstate(pg)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            pg.wait_for_timeout(150)
            return mid
        mid = spread(80, 92)    # a little past the floor: pressure, no turn
        assert not mid['ahead'] and 0 < mid['push'] < 1, f'a small spread at the floor: {mid}'
        assert fstate(pg)['push'] == 0, 'lifting the fingers drains the pressure'
        spread(60, 140)         # a wide spread: turns round
        st = fstate(pg)
        assert st['ahead'] and abs(st['D'] - LAND_D) < 1e-6, f'a wide spread at the floor turns round: {st}'
        spread(160, 80)         # pinch in: further ahead
        assert fstate(pg)['D'] > LAND_D, 'pinching in looks further ahead'
        pg.query_selector('.tunnel-box').screenshot(path=str(SHOTS / 'vp-pinch-ahead-phone.png'))
    step(tag, 'crossing by pinch', pinch)
    ctx.close()


AXE_VERSION = '4.10.3'


def axe_path():
    for p in [ROOT / 'out' / '.axe' / 'node_modules' / 'axe-core' / 'axe.min.js']:
        if p.exists():
            return p
    dest = ROOT / 'out' / '.axe'
    dest.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(['npm', 'install', '--no-save', '--no-audit', '--no-fund', '--prefix', str(dest), f'axe-core@{AXE_VERSION}'],
                       capture_output=True, text=True)
    p = dest / 'node_modules' / 'axe-core' / 'axe.min.js'
    if not p.exists():
        problems.append(f'could not install axe-core for the accessibility scan: {r.stderr[-300:]}')
        return None
    return p


def accessibility(browser):
    """axe-core on the forecast list, the cards and the controls, with colour contrast, light and dark."""
    axe = axe_path()
    if not axe:
        return
    targets = ['#fclist', '#card', '.transport', '.legend', '#body-machine']
    for scheme in ('light', 'dark'):
        for fid in ('f-legg', 'f-good', 'f-land', 'f-turing'):
            ctx, pg, tag = open_page(browser, 'desk', scheme, 'vanishing', fid, when=CLOCKS['today'], reduced_motion='reduce')
            pg.add_script_tag(path=str(axe))

            def scan():
                res = pg.evaluate("""async targets => {
                  const r = await axe.run({ include: targets.map(t => [t]) }, { resultTypes: ['violations', 'incomplete'] });
                  return { v: r.violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, where: x.nodes.slice(0, 3).map(n => n.target.join(' ')),
                                                        why: x.nodes[0] && x.nodes[0].any.concat(x.nodes[0].all).map(c => c.message).join(' | ') })),
                           incomplete: r.incomplete.map(x => x.id + ' ' + x.nodes.length + ' (' + Array.from(new Set(x.nodes.map(n => n.any.concat(n.all).map(c => c.message).join('; ')))).join(' / ') + ')') };
                }""", targets)
                for v in res['v']:
                    problems.append(f"{tag}: axe {v['id']} ({v['impact']}) on {v['n']} node(s): {', '.join(v['where'])}: {v['why']}")
                if res['incomplete'] and fid == 'f-legg':
                    notes.append(f"axe {scheme}: needs a human look: {', '.join(res['incomplete'])}")
            step(tag, 'axe scan', scan)
            if fid == 'f-legg':
                pg.click('#ahead'); pg.wait_for_timeout(200)   # the pressed button too
                step(tag + ' (button toggled)', 'axe scan', scan)
            ctx.close()
    notes.append(f'axe-core {AXE_VERSION}: forecast list, forecast cards, transport, legend and the body-of-the-machine panel, light and dark')


def check_js_bites():
    """Broken copies of forecasts.js: check.js must flag each one."""
    src = (ROOT / 'vanishing' / 'forecasts.js').read_text(encoding='utf-8')
    tmp = ROOT / 'out' / 'check-cases'
    tmp.mkdir(parents=True, exist_ok=True)
    cases = [
        ('unknown field', "  say: 'I believe that in about fifty", "  sayX: 'I believe that in about fifty", 'f-turing: unknown forecast field "sayX"'),
        ('missing quotation', "  say: 'I believe that in about fifty", "  _say: 'I believe that in about fifty", 'f-turing: missing say'),
        ('bad date', "made: '2025-10-28'", "made: '2025-13-28'", 'no such date'),
        ('no sources', "  s: [['Turing (1950), full text, Oxford Academic'", "  s: [], s0: [['Turing (1950), full text, Oxford Academic'", 'f-turing: no sources'),
        ('wrong target', "type: 'window', from: '2005', to: '2030',", "type: 'window', from: '2005', due: '2030',", 'a window has no due'),
        ('verdict without citation', "    sayc: 'ALPAC, Language and Machines", "    sayX: 'ALPAC, Language and Machines", 'goes with its citation'),
        ('said after named', "made: '1994', th: 'hyp', card: 'meltdown2012'", "made: '2013', th: 'hyp', card: 'meltdown2012'", 'not after the date said'),
    ]
    for name, a, b, expect in cases:
        if src.count(a) < 1:
            problems.append(f'check.js case "{name}": the text to break is no longer in forecasts.js; update test.py')
            continue
        broken = src.replace(a, b, 1)
        path = tmp / 'forecasts.js'
        path.write_text(broken, encoding='utf-8')
        out = subprocess.run(['node', 'vanishing/check.js', '--forecasts', str(path)], cwd=ROOT, capture_output=True, text=True)
        if expect not in out.stdout:
            problems.append(f'check.js missed a broken forecast ({name}); output ends: {out.stdout[-300:]}')
        elif out.returncode == 0 and 'warning' not in name:
            problems.append(f'check.js flagged "{name}" but still exited 0')
    out = subprocess.run(['node', 'vanishing/check.js', '--now', '2031-01-01'], cwd=ROOT, capture_output=True, text=True)
    if 'f-vinge-window: its window closed on 2030-12-31 with no outcome recorded' not in out.stdout:
        problems.append('check.js --now 2031-01-01 should warn that Vinge’s window closed without a verdict')
    notes.append(f'check.js caught all {len(cases)} broken copies of forecasts.js')


def body_panel(browser):
    """The body-of-the-machine panel in the Notes: one bar per row of BODY, computed sentences, tables, no sideways scroll."""
    M, I = load_js('data', 'BODY')['msft']['rows'], load_js('data', 'BODY')['ireland']['rows']
    for preset in PRESETS:
        for scheme in ('light', 'dark'):
            ctx, pg, tag = open_page(browser, preset, scheme, 'vanishing', reduced_motion='reduce')

            def check():
                n_m = pg.eval_on_selector_all('#bm-msft .pbar', 'els => els.length')
                n_i = pg.eval_on_selector_all('#bm-ie .pbar', 'els => els.length')
                assert (n_m, n_i) == (len(M), len(I)), f'bars drawn {n_m}, {n_i}; expected {len(M)}, {len(I)}'
                first, last, prev = M[0]['v'], M[-1]['v'], M[-2]['v']
                want = f"{last / first:.1f} times {M[0]['k']} and {round((last / prev - 1) * 100)} percent more"
                got = pg.inner_text('#bm-msft-sum')
                assert want in got, f'Microsoft sentence {got!r} lacks {want!r}'
                got = pg.inner_text('#bm-ie-sum')
                assert f"{I[-1]['v'] / I[0]['v']:.1f} times" in got, f'Ireland sentence {got!r}'
                pg.click('.bmdata > summary'); pg.wait_for_timeout(150)
                rows = pg.eval_on_selector_all('#bm-tables tbody tr', 'els => els.length')
                assert rows == len(M) + len(I), f'{rows} table rows'
                no_overflow(pg, tag)
                pg.query_selector('#body-machine').scroll_into_view_if_needed()
                pg.query_selector('#body-machine').screenshot(path=str(SHOTS / f'vp-body-{preset}-{scheme}.png'))
            step(tag, 'body of the machine panel', check)
            ctx.close()
    notes.append('body of the machine: out/shots/vp-body-*.png')


def forecasts(browser):
    check_js_bites()
    forecasts_clock(browser)
    forecasts_geometry(browser)
    crossing(browser)
    accessibility(browser)


def companion_checks():
    """shared/check.js on the real descriptions, then on broken copies it must catch."""
    out = subprocess.run(['node', 'shared/check.js'], cwd=ROOT, capture_output=True, text=True)
    if out.returncode:
        problems.append('shared/check.js: ' + out.stdout.strip())
    else:
        notes.append(out.stdout.strip())
    src = (ROOT / 'shared' / 'demons.js').read_text(encoding='utf-8')
    tmp = ROOT / 'out' / 'check-cases'
    tmp.mkdir(parents=True, exist_ok=True)
    cases = [
        ('a name in a description', "t: 'A bag of tricks, the demon of combustion.'", "t: 'Tchakki, a bag of tricks.'", 'names a demon'),
        ('straight quote', "t: 'The croaking curse, a demon of burning hail, at the fourth door.'", "t: 'The \"croaking\" curse.'", 'straight quote'),
        ('out of order', "{ m: 7, k: '4::1'", "{ m: 8, k: '4::1'", 'mesh order'),
        ('wrong net-span', "{ m: 30, k: '8::2'", "{ m: 30, k: '8::3'", 'is mesh 31'),
        ('lost question mark', "r: 'The Matrix marks its rite with a question mark in place of a route; it attends", "r: 'It attends", 'should say'),
    ]
    for name, a, b, expect in cases:
        if a not in src:
            problems.append(f'shared/check.js case "{name}": the text to break is no longer in demons.js; update test.py')
            continue
        path = tmp / 'demons.js'
        path.write_text(src.replace(a, b, 1), encoding='utf-8')
        out = subprocess.run(['node', 'shared/check.js', '--demons', str(path)], cwd=ROOT, capture_output=True, text=True)
        if out.returncode == 0 or expect not in out.stdout:
            problems.append(f'shared/check.js missed a broken description ({name}); output: {out.stdout[-300:]}')
    notes.append(f'shared/check.js caught all {len(cases)} broken copies of demons.js')


CODEX_AMERICAN = re.compile(r'\b(neighbou?rs?|color|colors|center|centered|traveler|travelers|analyze|behavior|gray|realize|recognize|labeled|modeling)\b')


def codex_checks():
    """codex/check.js: the engine as built, against LifeWiki, the Python reference, Numogram Lab and lifelib."""
    out = subprocess.run(['node', 'codex/check.js'], cwd=ROOT, capture_output=True, text=True)
    last = out.stdout.strip().splitlines()[-1] if out.stdout.strip() else out.stderr[-300:]
    if out.returncode:
        problems.append('codex/check.js: ' + ' | '.join(l for l in out.stdout.splitlines() if l.startswith('FAIL')) + ' | ' + last)
    else:
        notes.append(last)


def codex(browser):
    """Codex: the default word, typed words, a #word link, the controls, and house style in what it says."""
    ctx, pg, tag = open_page(browser, 'desk', 'light', 'codex', reduced_motion='reduce')
    said = []

    def fates(timeout=20000):
        pg.wait_for_function("""() => !document.getElementById('own-fate').classList.contains('pending')
                                 && !document.getElementById('life-fate').classList.contains('pending')""", timeout=timeout)
        return pg.inner_text('#own-fate'), pg.inner_text('#life-fate')

    def type_word(w):
        pg.fill('#word', w)
        pg.wait_for_timeout(450)
        said.append(pg.inner_text('body'))

    def conway():
        assert pg.inner_text('#bsr') == 'B3/S23', pg.inner_text('#bsr')
        assert 'Conway’s Life' in pg.inner_text('#readout')
        acts = pg.eval_on_selector_all('#zones .z', 'els => els.map(e => e.dataset.zone + ":" + e.querySelector(".za").textContent)')
        assert sorted(acts) == sorted([f'{z}:{"ignite" if z == 3 else "hold" if z == 4 else "void"}' for z in range(10)]), acts
        own, life = fates()
        want = 'Throws off 1 glider and settles by generation 178, with 46 cells counting it.'
        assert own == life == want, (own, life)
        said.append(pg.inner_text('body'))

    def words():
        type_word('Hyperstition')
        assert pg.inner_text('#bsr') == 'B1/S0124', pg.inner_text('#bsr')
        own, life = fates(30000)
        assert own.startswith('Explodes, passing 25,000 cells'), own
        assert life.startswith('Throws off 3 gliders'), life
        type_word('glider')
        assert pg.inner_text('#bsr') == 'B/S23'
        own, _ = fates()
        assert own == 'Dies out at generation 14.', own
        assert 'nothing is ever born' in pg.inner_text('#notes').lower()
        type_word('Oracle')
        assert '109 runs the same physics' in pg.inner_text('#notes'), pg.inner_text('#notes')
        type_word('time')
        assert pg.inner_text('#bsr') == 'B0/S3'
        assert 'background flips' in pg.inner_text('#notes')
        own, _ = fates()
        assert own == 'Settles at generation 51 into a cycle that repeats every 2 generations.', own
        assert 'off the background' in pg.inner_text('#own-count')
        type_word('')
        assert 'at least one letter or digit' in pg.inner_text('#sum')

    def controls():
        type_word('Murrumur')
        pg.click('#step'); pg.click('#step'); pg.click('#step')
        g = pg.inner_text('#life-count')
        assert g.startswith('gen 3 '), g
        pg.click('#restart')
        assert pg.inner_text('#life-count').startswith('gen 0 '), pg.inner_text('#life-count')
        assert pg.inner_text('#play') == 'Play'
        pg.click('#play')
        assert pg.inner_text('#play') == 'Pause'
        pg.wait_for_timeout(700)
        assert not pg.inner_text('#life-count').startswith('gen 0 '), 'Play did not advance'
        own, life = fates(40000)
        assert life == 'Throws off 13 gliders and settles by generation 5,024, with 671 cells counting them.', life

    def odds():
        ref = json.loads((ROOT / 'codex' / 'reference.json').read_text(encoding='utf-8'))['odds']
        text = pg.inner_text('body')
        for want in (f"{ref['p_at_least_one'] * 100:.0f}%", f"{ref['life_words']:,}", f"{ref['six_letter_words']:,} common six-letter words"):
            assert want in text, want
        assert pg.eval_on_selector_all('.termlist li', 'els => els.length') == 50
        assert pg.eval_on_selector_all('.termlist li.hit', 'els => els.map(e => e.textContent)') == ['CONWAY 135']

    def style():
        for text in said:
            m = CODEX_AMERICAN.search(text)
            assert not m or m.group(0).startswith('neighbour'), f'American spelling: {m.group(0)}'
            assert "'" not in text and '"' not in text, 'a straight quote in the page text'

    for name, fn in (('the default word', conway), ('typed words', words), ('controls', controls), ('the odds', odds), ('house style', style)):
        step(tag, name, fn)
    ctx.close()

    ctx, pg, tag = open_page(browser, 'phone', 'dark', 'codex', 'MURRUMUR', reduced_motion='reduce')
    step(tag, 'a #word link', lambda: pg.wait_for_function("document.getElementById('word').value === 'MURRUMUR'", timeout=3000))
    no_overflow(pg, tag)
    ctx.close()
    notes.append('codex: CONWAY, HYPERSTITION, GLIDER, ORACLE, TIME, an empty word and MURRUMUR, the controls, the odds and a #word link')

    axe = axe_path()
    if not axe:
        return
    for scheme in ('light', 'dark'):
        ctx, pg, tag = open_page(browser, 'desk', scheme, 'codex', 'TIME', reduced_motion='reduce')
        pg.add_script_tag(path=str(axe))
        pg.click('details.terms > summary')

        def scan():
            res = pg.evaluate("""async () => {
              const r = await axe.run(document, { resultTypes: ['violations'] });
              return r.violations.map(x => ({ id: x.id, impact: x.impact, n: x.nodes.length, where: x.nodes.slice(0, 3).map(n => n.target.join(' ')),
                                              why: x.nodes[0] && x.nodes[0].any.concat(x.nodes[0].all).map(c => c.message).join(' | ') }));
            }""")
            for v in res:
                problems.append(f"{tag}: axe {v['id']} ({v['impact']}) on {v['n']} node(s): {', '.join(v['where'])}: {v['why']}")
        step(tag, 'axe scan', scan)
        ctx.close()
    notes.append(f'axe-core {AXE_VERSION}: the whole Codex page, light and dark')


def photograph(browser, ids):
    for i in ids:
        for preset, scheme in (('desk', 'light'), ('phone', 'dark')):
            ctx, pg, tag = open_page(browser, preset, scheme, 'vanishing', i)
            pg.wait_for_timeout(900)
            if pg.evaluate('window.__vanishing.state.sel') != i:
                problems.append(f'{tag}: #{i} did not open (check the id)')
            elif not any(h['id'] == i for h in pg.evaluate('window.__vanishing.hits()')):
                problems.append(f'{tag}: #{i} is selected but its mark is not drawn')
            pg.query_selector('.tunnel-frame').screenshot(path=str(SHOTS / f'vp-{i}-{preset}.png'))
            pg.query_selector('#card').screenshot(path=str(SHOTS / f'vp-{i}-{preset}-card.png'))
            ctx.close()
        notes.append(f'photographed {i}: out/shots/vp-{i}-*.png')


if __name__ == '__main__':
    args = sys.argv[1:]
    ids = []
    if '--vp' in args:
        k = args.index('--vp'); ids = [x for x in args[k + 1].split(',') if x]; del args[k:k + 2]
    pages = args or list(FILES)
    if ids and 'vanishing' not in pages:
        pages.append('vanishing')
    SHOTS.mkdir(parents=True, exist_ok=True)
    for p in pages:
        build.BUILDS[p]()
    if 'numolab' in pages or 'timesorcery' in pages:
        companion_checks()
    if 'codex' in pages:
        codex_checks()
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for p in pages:
            smoke(browser, p)
            {'numolab': numolab, 'timesorcery': timesorcery, 'vanishing': vanishing, 'codex': codex}[p](browser)
            if p == 'vanishing':
                forecasts(browser)
                body_panel(browser)
        if ids:
            photograph(browser, ids)
        browser.close()
    for n in notes:
        print(n)
    print(f'screenshots: {SHOTS}')
    if problems:
        print(f'{len(problems)} problem(s):\n  ' + '\n  '.join(problems))
        sys.exit(1)
    print('all checks passed: ' + ', '.join(pages))
