/* ================= Vanishing Point: the tunnel ================= */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  for (const e of EVENTS) e._p = parseD(e.d);
  const BY_ID = Object.create(null);
  for (const e of EVENTS) BY_ID[e.id] = e;
  const CHRONO = EVENTS.slice().sort((a, b) => a._p.y - b._p.y);
  /* "Elsewhere on the spiral": a card's own see list plus every card whose see list names it, in date order */
  const SEE = Object.create(null);
  for (const e of EVENTS) for (const id of e.see || []) {
    if (!BY_ID[id]) continue;
    (SEE[e.id] = SEE[e.id] || new Set()).add(id);
    (SEE[id] = SEE[id] || new Set()).add(e.id);
  }
  const seeOf = e => SEE[e.id] ? [...SEE[e.id]].map(id => BY_ID[id]).sort((a, b) => a._p.y - b._p.y) : [];

  const NOW_MS = Date.now();
  const NOW_Y = decYearFromMs(NOW_MS);
  /* the page opens on the most recent milestone dated up to today */
  const LATEST = (CHRONO.filter(e => e._p.y <= NOW_Y).pop() || CHRONO[CHRONO.length - 1]).id;

  /* ---------- forecasts: statuses are read from the clock when the page opens ---------- */
  const FC = typeof FORECASTS !== 'undefined' ? FORECASTS : [];
  const FBY = Object.create(null);
  for (const f of FC) { f._t = fcTimes(f); f._st = fcStatus(f, NOW_MS); FBY[f.id] = f; }
  const FC_SORTED = FC.slice().sort((a, b) => a._t.ring - b._t.ring);
  const fcOpen = () => FC_SORTED.filter(f => f._st === 'open');
  const fcDone = () => FC_SORTED.filter(f => f._st !== 'open');
  const isF = id => !!(id && FBY[id]);
  const ST = { open: 'Open', met: 'Came true', late: 'Came true, late', claimed: 'Claimed met', disputed: 'Disputed',
               missed: 'Missed', none: 'No verdict', closed: 'Closed, no verdict yet' };
  const TYPE = { date: 'A date', deadline: 'A deadline', window: 'A window', spread: 'Odds by a date', bet: 'A bet' };
  const GROUP = { pioneer: 'Pioneer on the spiral', lab: 'Frontier lab', survey: 'Researcher survey', bet: 'Public bet', land: 'Land' };

  /* ---------- spiral geometry ---------- */
  const GROW = 2.5, LG = Math.log(GROW);     // radius grows 2.5x per turn; one turn = one decade of log time
  const LANE_D = [0.30, 0.18, 0.06, -0.06, -0.18, -0.30]; // lane offsets in turns; lane 0 (Models) is the outermost
  const RIB = 0.38;                                        // half-width of the ribbon, in turns
  const GAP = { model: 0.007, default: 0.011 };           // minimum spacing within a lane, in decades of log time
  const FGAP = 0.03;                                       // the same for forecast rings, which are bigger
  const TWO_PI = Math.PI * 2;
  const PUSH = 0.36;     // decades of travel past the floor that turn the spiral round
  const LAND_D = 0.45;   // where a turn-round lands: the head about three years from today

  const S = { vp: 'now', D: 1.8, sel: null, hover: null, thread: null, demons: false, lab: null, bitter: false, keyOnly: false,
              playing: false, ahead: false, back: null, fc: true, push: 0 };
  let T = 0, POS = {}, FPOS = {}, LNOW = null, DMIN = -1, DMAX = 4;

  const cv = $('#tunnel'), ctx = cv.getContext('2d');
  const geo = { W: 0, H: 0, cx: 0, cy: 0, R0: 0, Rmax: 0, dpr: 1 };
  let HIT = [];
  let P = {};

  function readPalette() {
    const cs = getComputedStyle(document.documentElement);
    const g = n => cs.getPropertyValue(n).trim() || '#888';
    P = { bg: g('--bg'), surface: g('--surface'), ribbon: g('--ribbon'), ink: g('--ink'), muted: g('--muted'), rule: g('--rule'),
          gold: g('--gold'), violet: g('--violet'), crimson: g('--crimson'), crimsonInk: g('--crimson-ink') };
  }

  function rOf(u, lane) { return geo.R0 * Math.exp(LG * (u + (lane == null ? 0 : LANE_D[lane]))); }
  function rEdge(u, side) { return geo.R0 * Math.exp(LG * (u + side * RIB)); }
  /* clockwise from 12 o'clock as time moves toward the centre; looking ahead the spiral is mirrored */
  function phiOf(u) { return (S.ahead ? TWO_PI : -TWO_PI) * u; }
  function pt(r, phi) { return [geo.cx + r * Math.sin(phi), geo.cy - r * Math.cos(phi)]; }
  function uRange() {
    const far = Math.hypot(geo.W, geo.H) / 2 + 40;
    return { lo: Math.log(0.9 / geo.R0) / LG - RIB, hi: Math.log(far / geo.R0) / LG + RIB };
  }
  /* log distance of a date from the centre: time left before the centre, or time ahead of today */
  function lOfY(y) { return S.ahead ? Math.log10(Math.max(y - NOW_Y, MIN_TAU)) : logTau(T, y); }

  /* ---------- centre, layout and range ---------- */
  function setCentre(key) {
    S.ahead = false;
    S.vp = key;
    T = vpYear(key, NOW_MS);
    POS = layoutEvents(EVENTS, THREADS, T, GAP);
    LNOW = (key === 'now' || NOW_Y >= T) ? null : logTau(T, NOW_Y);
    let lo = Infinity, hi = -Infinity;
    for (const e of EVENTS) { const L = POS[e.id].Ld; if (L < lo) lo = L; if (L > hi) hi = L; }
    DMAX = hi + 0.22;
    // centred on now, travel stops one day before today; elsewhere a little past today
    DMIN = key === 'now' ? FLOOR : (LNOW == null ? lo : Math.min(lo, LNOW)) - 0.4;
    layoutForecasts();
    syncMode();
  }
  function setAheadState() {
    if (!S.ahead) S.back = { vp: S.vp, D: S.D };
    S.ahead = true;
    T = NOW_Y; LNOW = null;
    layoutForecasts();
    let hi = FLOOR + 1;
    for (const id in FPOS) hi = Math.max(hi, FPOS[id].Ld);
    DMAX = hi + 0.3;
    DMIN = FLOOR;
    syncMode();
  }
  /* forecasts drawn in this view: the open ones looking ahead, the rest in the history views */
  function layoutForecasts() {
    FPOS = {};
    const byLane = {};
    for (const f of FC) {
      if (S.ahead ? f._st !== 'open' : f._st === 'open') continue;
      const t = f._t, lane = THREADS[f.th].lane, L = lOfY(t.ring);
      const o = f.outcome;
      const lo = o && o.on && (f._st === 'met' || f._st === 'late' || f._st === 'claimed') ? lOfY(parseD(o.on).y) : null;
      FPOS[f.id] = { L, Ld: L, lane, La: lOfY(t.a), Lb: lOfY(t.b), Lm: lOfY(t.made), Lp: t.p10 == null ? null : lOfY(t.p10), Lo: lo };
      (byLane[lane] = byLane[lane] || []).push(f.id);
    }
    for (const lane in byLane) {
      const ids = byLane[lane].sort((a, b) => FPOS[a].L - FPOS[b].L);
      const placed = spreadLane(ids.map(id => FPOS[id].L), FGAP);
      ids.forEach((id, i) => { FPOS[id].Ld = placed[i]; });
    }
  }
  function syncMode() {
    stopHintUntil = 0;
    const sl = $('#depth');
    sl.min = (-DMAX).toFixed(3); sl.max = (-DMIN).toFixed(3);
    sl.setAttribute('aria-label', S.ahead ? 'Look ahead: from the far future at the rim to today at the centre'
      : 'Travel through time, from the rim of the spiral to its centre');
    const b = $('#ahead');
    b.setAttribute('aria-pressed', String(S.ahead));
    $('#eras').hidden = S.ahead;
    $('#prev').setAttribute('aria-label', S.ahead ? 'Prev open forecast' : 'Prev milestone');
    $('#next').setAttribute('aria-label', S.ahead ? 'Next open forecast' : 'Next milestone');
    cv.setAttribute('aria-label', S.ahead
      ? 'Looking ahead: a logarithmic spiral of the ' + fcOpen().length + ' forecasts still open, with today at the centre and the far future at the rim. The list of forecasts below gives the same information.'
      : 'A logarithmic spiral of ' + EVENTS.length + ' milestones in the history of AI' + (S.fc && fcDone().length ? ', with ' + fcDone().length + ' resolved forecasts as dashed rings' : '') + '. The lists below the controls give the same information.');
    document.body.classList.toggle('looking-ahead', S.ahead);
    renderCaption();
  }
  function renderCaption() {
    const cap = $('#vpcap');
    if (S.ahead) {
      cap.innerHTML = 'Looking ahead from <b>today</b> · ' + fcOpen().length + ' open forecasts';
      return;
    }
    if (S.vp === 'now') {
      cap.innerHTML = 'Centre: <b>now</b>, the moment you opened this page';
      return;
    }
    const v = VPS[S.vp];
    const name = v.when + ' (Kurzweil’s Singularity)';
    const tau = T - NOW_Y;
    const rel = tau > 0 ? 'today is ' + fmtTau(tau) + ' out' : 'the date has passed';
    cap.innerHTML = 'Centre: <b>' + esc(name) + '</b> · ' + esc(rel);
  }

  /* ---------- filters ---------- */
  function shown(e) { return (!S.bitter || e.f !== 'road') && (!S.keyOnly || e.w === 3); }
  function labsOf(e) { return e.lab ? (Array.isArray(e.lab) ? e.lab : [e.lab]) : []; }
  function makerOf(e) { return e.org || labsOf(e).map(k => LABS[k]).join(' and '); }
  function focusOn() { return !!(S.thread || S.demons || S.lab); }
  function inFocus(e) {
    if (S.thread && e.th !== S.thread) return false;
    if (S.demons && !(e.tag && e.tag.indexOf('demon') >= 0)) return false;
    if (S.lab && labsOf(e).indexOf(S.lab) < 0) return false;
    return true;
  }
  function stepSet() { return CHRONO.filter(e => shown(e) && inFocus(e)); }

  /* ---------- drawing ---------- */
  let drawPending = false;
  function requestDraw() {
    if (drawPending) return;
    drawPending = true;
    requestAnimationFrame(() => { drawPending = false; draw(); });
  }
  function depthAlpha(r) { return Math.max(0.16, Math.min(1, (r - 3) / (0.32 * geo.R0))); }

  function spiralPath(c, u0, u1, radiusFn) {
    const step = 0.004;
    let first = true;
    for (let u = u1; u >= u0 - 1e-9; u -= step) {
      const r = radiusFn(u);
      const [x, y] = pt(r, phiOf(u));
      if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y);
    }
    const r = radiusFn(u0), [x, y] = pt(r, phiOf(u0));
    c.lineTo(x, y);
  }
  function ribbon(c, u0, u1, fill, alpha) {
    if (u1 <= u0) return;
    c.beginPath();
    spiralPath(c, u0, u1, u => rEdge(u, 1));
    const step = 0.004;
    for (let u = u0; u <= u1 + 1e-9; u += step) { const [x, y] = pt(rEdge(u, -1), phiOf(u)); c.lineTo(x, y); }
    c.closePath();
    c.globalAlpha = alpha; c.fillStyle = fill; c.fill(); c.globalAlpha = 1;
  }
  /* lane line, drawn in chunks so it can fade toward the centre */
  function laneLine(c, lane, u0, u1, color, width, dash, alphaMul) {
    if (u1 <= u0) return;
    c.save();
    c.strokeStyle = color; c.lineWidth = width; c.setLineDash(dash || []);
    const chunk = 0.12;
    for (let a = u1; a > u0; a -= chunk) {
      const b = Math.max(u0, a - chunk);
      const rMid = rOf((a + b) / 2, lane);
      if (rMid < 1.2) break;
      c.globalAlpha = depthAlpha(rMid) * alphaMul;
      c.beginPath(); spiralPath(c, b, a, u => rOf(u, lane)); c.stroke();
    }
    c.restore();
  }

  /* tick years: [year, label, rank] */
  const TICKS = (() => {
    const t = [];
    const add = (y, label, rank) => t.push({ y, label, rank });
    add(-3000.5, '3000 BCE', 0); add(-2000.5, '2000 BCE', 1); add(-1000.5, '1000 BCE', 1);
    add(1, '1 CE', 1); add(500, '500', 2); add(1000, '1000', 0); add(1500, '1500', 0);
    for (const y of [1100, 1200, 1300, 1400, 1600, 1700, 1800]) add(y, String(y), 1);
    for (const y of [1650, 1750, 1850]) add(y, String(y), 2);
    add(1900, '1900', 0); add(2000, '2000', 0);
    for (const y of [1925, 1950, 1975]) add(y, String(y), 1);
    for (let y = 1910; y <= 1990; y += 10) if (y % 25 && y !== 1950) add(y, String(y), 2);
    for (const y of [2010, 2020]) add(y, String(y), 1);
    // years up to the reader's own, and the months of this year and last, so the centre on now keeps its labels as time moves on
    const yNow = new Date(NOW_MS).getUTCFullYear();
    for (let y = 2001; y <= yNow; y++) if (y !== 2010 && y !== 2020) add(y, String(y), y % 10 === 0 ? 1 : (y % 5 === 0 ? 2 : 3));
    for (const Y of [yNow - 1, yNow]) for (let m = 1; m <= 12; m++) {
      add(decYearFromMs(Date.UTC(Y, m - 1, 1)), MONTHS[m - 1] + ' ' + Y, Y === yNow && m === 1 ? 3 : 4);
    }
    return t;
  })();
  /* looking ahead: the months of the coming year, then years and round decades */
  const TICKS_AHEAD = (() => {
    const t = [];
    const add = (y, label, rank) => { if (y > NOW_Y) t.push({ y, label, rank }); };
    const d = new Date(NOW_MS), y0 = d.getUTCFullYear();
    for (let k = 1; k <= 13; k++) {
      const ms = Date.UTC(y0, d.getUTCMonth() + k, 1), m = new Date(ms).getUTCMonth();
      if (m) add(decYearFromMs(ms), MONTHS[m] + ' ' + new Date(ms).getUTCFullYear(), 4);
    }
    for (let y = y0 + 1; y <= y0 + 9; y++) add(y, String(y), y % 5 === 0 ? 2 : 3);
    for (let y = Math.ceil((y0 + 10) / 5) * 5; y <= 2100; y += 5) add(y, String(y), y % 50 === 0 ? 0 : (y % 10 === 0 ? 1 : 2));
    for (const y of [2150, 2200, 2300]) add(y, String(y), 1);
    return t;
  })();

  let flashT = 0;
  function draw() {
    if (!geo.W || !geo.R0) return;
    const c = ctx;
    c.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
    c.clearRect(0, 0, geo.W, geo.H);
    const { lo, hi } = uRange();
    const uNow = LNOW == null ? -Infinity : LNOW - S.D;
    const uSplit = Math.max(lo, Math.min(hi, uNow));

    // ribbon: the past solid, the future between today and the centre faint; looking ahead, all of it is future
    if (S.ahead) ribbon(c, lo, hi, P.ribbon, 0.45);
    else {
      ribbon(c, uSplit, hi, P.ribbon, 1);
      if (uNow > lo) ribbon(c, lo, uSplit, P.ribbon, 0.45);
    }

    // lanes
    const hl = S.thread ? THREADS[S.thread].lane : -1;
    for (let k = 0; k < 5; k++) {
      const isHl = k === hl && !S.ahead;
      if (S.ahead) { laneLine(c, k, lo, hi, P.rule, 1, [2, 3], 0.8); continue; }
      laneLine(c, k, uSplit, hi, isHl ? P.violet : P.rule, isHl ? 1.6 : 1, null, isHl ? 1 : 1);
      if (uNow > lo) laneLine(c, k, lo, uSplit, isHl ? P.violet : P.rule, 1, [2, 3], 0.8);
    }

    const small = geo.W < 440;
    const labels = [];     // placed label rectangles
    const blocks = [];     // dots and fixed marks that labels should not cover
    const pending = [];    // label candidates
    const fontSm = (small ? '10.5px' : '11px') + ' "IBM Plex Mono", ui-monospace, monospace';
    const fontLab = (small ? '11.5px' : '12px') + ' "IBM Plex Sans", system-ui, sans-serif';
    const fontSel = '600 ' + (small ? '12.5px' : '13px') + ' "IBM Plex Sans", system-ui, sans-serif';

    // year ticks: candidates now, spokes drawn only for ticks whose labels find room
    for (const tk of (S.ahead ? TICKS_AHEAD : TICKS)) {
      if (!S.ahead && tk.y >= T) continue;
      const u = lOfY(tk.y) - S.D;
      if (u < lo || u > hi) continue;
      const rIn = rEdge(u, -1);
      if (rIn < 24) continue;
      pending.push({ kind: 'tick', pri: 46 - tk.rank * 9 - 1.5 * Math.abs(u), text: tk.label, r: rIn - 4, phi: phiOf(u), u, dir: -1, font: fontSm, color: P.muted, alpha: Math.max(0.6, depthAlpha(rIn)) });
    }

    // today
    if (LNOW != null && uNow >= lo && uNow <= hi) {
      const rIn = rEdge(uNow, -1), rOut = rEdge(uNow, 1), phi = phiOf(uNow);
      const [x1, y1] = pt(rIn, phi), [x2, y2] = pt(rOut, phi);
      c.strokeStyle = P.crimson; c.lineWidth = 2; c.globalAlpha = Math.max(0.6, depthAlpha(rIn));
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.globalAlpha = 1;
      if (rOut > 30) pending.push({ kind: 'now', pri: 95, text: 'today', r: rOut + 4, r0: rOut, phi, dir: 1, font: fontSm, color: P.crimson, alpha: 1 });
    }

    // events (the history views only)
    HIT = [];
    const BASE = [0, 2.5, 3.5, 4.8];
    const sel = S.sel, hov = S.hover, focus = focusOn();
    const drawn = [];
    if (!S.ahead) for (const e of EVENTS) {
      if (!shown(e)) continue;
      const p = POS[e.id];
      const u = p.Ld - S.D;
      if (u < lo || u > hi) continue;
      const r = rOf(u, p.lane);
      if (r < 1.5) continue;
      const phi = phiOf(u), [x, y] = pt(r, phi);
      if (x < -20 || y < -20 || x > geo.W + 20 || y > geo.H + 20) continue;
      const scale = Math.max(0.55, Math.min(1.2, 0.5 + 0.5 * r / geo.R0));
      drawn.push({ e, x, y, r, phi, rad: BASE[e.w] * scale });
    }
    // the focused set and heavier marks are drawn last so they sit on top
    drawn.sort((a, b) => (focus ? (inFocus(a.e) - inFocus(b.e)) : 0) || (a.e.w - b.e.w));
    for (const d of drawn) {
      const e = d.e, alphaBase = depthAlpha(d.r);
      const inF = !focus || inFocus(e);
      const color = focus && inF ? P.violet : (e.q ? P.gold : P.ink);
      c.globalAlpha = inF ? alphaBase : alphaBase * 0.22;
      markShape(c, e, d.x, d.y, d.rad, color, d.phi);
      c.globalAlpha = 1;
      HIT.push({ id: e.id, x: d.x, y: d.y, rad: d.rad, kind: 'ev' });
      if (d.rad >= 1.8) blocks.push({ id: e.id, x: d.x - d.rad - 1, y: d.y - d.rad - 1, w: 2 * d.rad + 2, h: 2 * d.rad + 2 });
      if (e.id === sel || e.id === hov) {
        c.strokeStyle = e.id === sel ? P.ink : P.muted; c.lineWidth = e.id === sel ? 1.8 : 1.2;
        c.beginPath(); c.arc(d.x, d.y, d.rad + (e.id === sel ? 4.5 : 3.5), 0, TWO_PI); c.stroke();
      }
      let pri = -1, font = fontLab, colorL = P.muted;
      if (e.id === sel) { pri = 100; font = fontSel; colorL = P.ink; }
      else if (e.id === hov) { pri = 98; colorL = P.ink; }
      else if (inF && d.r > geo.R0 * 0.46) {
        pri = e.w === 3 ? 60 : (e.w === 2 ? 24 : 6);
        pri += Math.max(0, 12 - Math.abs(d.r - geo.R0) / geo.R0 * 14);
        if (focus) pri += 26;
      }
      if (pri >= 0) pending.push({ kind: 'ev', id: e.id, r0: d.r, pri, text: shorten(e.short || e.t, e.id === sel ? (small ? 34 : 46) : (small ? 26 : 32)), r: d.r + d.rad + (e.id === sel ? 7 : 4), phi: d.phi, dir: 1, font, color: colorL, alpha: e.id === sel || e.id === hov ? 1 : Math.max(0.6, depthAlpha(d.r)) });
    }

    // forecasts: open ones looking ahead, resolved ones in the history views
    if (S.ahead || S.fc) drawForecasts(c, lo, hi, pending, blocks, { small, fontLab, fontSel });

    // centre
    c.fillStyle = P.crimson; c.beginPath(); c.arc(geo.cx, geo.cy, 2.6, 0, TWO_PI); c.fill();
    c.strokeStyle = P.crimson; c.lineWidth = 1; c.globalAlpha = 0.55;
    c.beginPath(); c.arc(geo.cx, geo.cy, 6.5, 0, TWO_PI); c.stroke(); c.globalAlpha = 1;
    blocks.push(rect(geo.cx - 8, geo.cy - 8, 16, 16));

    // pushing past the floor: a ring grows from the centre until the spiral turns round
    if (S.push > 0) {
      c.save();
      c.strokeStyle = P.crimson; c.lineWidth = 1.5 + S.push; c.setLineDash([4, 3]);
      c.globalAlpha = 0.35 + 0.55 * S.push;
      c.beginPath(); c.arc(geo.cx, geo.cy, 10 + S.push * Math.min(80, geo.R0 * 0.45), 0, TWO_PI); c.stroke();
      c.restore();
    }
    // after a turn-round, one ring sweeps out from the centre
    if (flashT) {
      const k = (performance.now() - flashT) / 700;
      if (k >= 1) flashT = 0;
      else {
        c.save(); c.strokeStyle = P.crimson; c.lineWidth = 2; c.globalAlpha = 0.5 * (1 - k);
        c.beginPath(); c.arc(geo.cx, geo.cy, 8 + k * geo.Rmax, 0, TWO_PI); c.stroke(); c.restore();
        requestDraw();
      }
    }

    // head: a notch at twelve o'clock just outside the ribbon, and the date tag above the frame's top edge
    const rh = rEdge(0, 1) + 3;
    c.fillStyle = P.ink;
    c.beginPath(); c.moveTo(geo.cx, geo.cy - rh); c.lineTo(geo.cx - 5, geo.cy - rh - 8); c.lineTo(geo.cx + 5, geo.cy - rh - 8); c.closePath(); c.fill();
    labels.push(rect(geo.cx - 7, geo.cy - rh - 10, 14, 12));
    const tag = document.getElementById('headtag');
    if (tag && tag.offsetWidth) labels.push(rect(geo.cx - tag.offsetWidth / 2 - 4, 6, tag.offsetWidth + 8, tag.offsetHeight + 8));

    // labels, most important first
    const maxEv = small ? 4 : (geo.W < 620 ? 8 : 11);
    const maxTick = small ? 9 : 18;
    let evCount = 0, tickCount = 0;
    pending.sort((a, b) => b.pri - a.pri);
    for (const L of pending) {
      const forced = L.pri >= 90;
      if (L.kind === 'ev' && !forced && evCount >= maxEv) continue;
      if (L.kind === 'tick' && tickCount >= maxTick) continue;
      c.font = L.font;
      const w = c.measureText(L.text).width, h = L.kind === 'tick' ? 12 : (L.pri >= 100 ? 16 : 15);
      let box = null;
      for (const cand of placeLabel(L, w, h)) {
        if (cand.x < 3 || cand.y < 3 || cand.x + cand.w > geo.W - 3 || cand.y + cand.h > geo.H - 3) continue;
        if (labels.some(b => overlaps(b, cand))) continue;
        if (blocks.some(b => b.id !== L.id && hits(b, cand)) && !(forced && cand.last)) continue;
        box = cand; break;
      }
      if (!box) continue;
      labels.push(box);
      if (L.kind === 'ev' && !forced) evCount++;
      if (L.kind === 'tick') {
        tickCount++;
        const [x1, y1] = pt(rEdge(L.u, -1), L.phi), [x2, y2] = pt(rEdge(L.u, 1), L.phi);
        c.globalAlpha = depthAlpha(rEdge(L.u, -1)) * 0.5; c.strokeStyle = P.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.globalAlpha = 1;
      }
      if (L.kind === 'ev' && forced) {
        c.globalAlpha = 0.9; c.fillStyle = P.surface;
        c.fillRect(box.x - 3, box.y - 1, box.w + 6, box.h + 2); c.globalAlpha = 1;
      }
      c.globalAlpha = L.alpha; c.fillStyle = L.color; c.textBaseline = 'top'; c.textAlign = 'left';
      c.fillText(L.text, box.x, box.y + (L.kind === 'tick' ? 0 : 1)); c.globalAlpha = 1;
    }
  }

  /* An arc along a lane between two log distances, clipped to what is on screen */
  function laneArc(c, lane, L0, L1, lo, hi) {
    let u0 = Math.min(L0, L1) - S.D, u1 = Math.max(L0, L1) - S.D;
    u0 = Math.max(u0, lo); u1 = Math.min(u1, hi);
    if (u1 - u0 < 0.002) return false;
    c.beginPath(); spiralPath(c, u0, u1, u => rOf(u, lane)); c.stroke();
    return true;
  }
  /* Forecast marks. Looking ahead: a dashed ring at the date named, with the span it covers from today
     drawn along its lane (a dotted run from the 10% to the 50% date for odds). In the history views:
     a dashed thread from the day it was said to the date it named, a muted ring, and inside the ring
     a dot if it came true, a small ring if it was claimed, a cross if it was missed. */
  function drawForecasts(c, lo, hi, pending, blocks, F) {
    const sel = S.sel, hov = S.hover;
    const ids = Object.keys(FPOS);
    // spans and threads first, so the rings sit on top
    for (const id of ids) {
      const f = FBY[id], p = FPOS[id], isSel = id === sel || id === hov;
      c.save();
      if (S.ahead) {
        c.strokeStyle = P.crimson; c.lineCap = 'round';
        if (f.type === 'spread') {
          // a dotted run from the 10% date, if that is still ahead, to the 50% date
          if (p.Lp != null && f._t.p10 > NOW_Y) { c.globalAlpha = isSel ? 0.75 : 0.4; c.lineWidth = isSel ? 2.2 : 1.6; c.setLineDash([1, 4]); laneArc(c, p.lane, p.Lp, p.Ld, lo, hi); }
          // odds keep rising after the 50% date: a fading run beyond it, never an end
          for (let k = 0; k < 4; k++) { c.globalAlpha = (isSel ? 0.6 : 0.32) * (1 - k / 4); c.lineWidth = 1.6; c.setLineDash([1, 4]); laneArc(c, p.lane, p.Ld + k * 0.06, p.Ld + (k + 1) * 0.06, lo, hi); }
        } else if (f.type !== 'date') {
          // the time a deadline or window leaves. A window that starts ahead is drawn from its start;
          // one that is already running, or a deadline, fades in over the third of a turn before its end
          // rather than winding all the way back to today
          c.lineWidth = isSel ? 3 : 2.2; c.setLineDash([]);
          const base = isSel ? 0.7 : 0.34;
          if (f.type === 'window' && f._t.a > NOW_Y && p.La > p.Ld - 0.35) { c.globalAlpha = base; laneArc(c, p.lane, p.La, p.Ld, lo, hi); }
          else {
            const s0 = p.Ld - 0.35;
            for (let k = 0; k < 5; k++) { c.globalAlpha = base * (k + 1) / 5; laneArc(c, p.lane, s0 + k * 0.07, s0 + (k + 1) * 0.07, lo, hi); }
          }
        }
      } else {
        // the thread from the day it was said to the date it named
        c.strokeStyle = isSel ? P.crimson : P.muted; c.globalAlpha = isSel ? 0.85 : 0.3; c.lineWidth = isSel ? 1.8 : 1;
        c.setLineDash([4, 3]);
        laneArc(c, p.lane, p.Lm, p.Ld, lo, hi);
        if (f.type === 'window') { c.setLineDash([]); c.lineWidth = isSel ? 3 : 2; c.globalAlpha = isSel ? 0.6 : 0.25; laneArc(c, p.lane, p.La, p.Lb, lo, hi); }
        if (p.Lo != null && f._st === 'late') { c.setLineDash([1, 3]); c.lineWidth = 1.4; c.globalAlpha = isSel ? 0.9 : 0.45; laneArc(c, p.lane, p.Ld, p.Lo, lo, hi); }
      }
      c.restore();
    }
    for (const id of ids) {
      const f = FBY[id], p = FPOS[id];
      const isSel = id === sel, isHov = id === hov, open = f._st === 'open';
      // where it came true, if it did
      if (!S.ahead && p.Lo != null) {
        const uo = p.Lo - S.D;
        if (uo >= lo && uo <= hi) {
          const ro = rOf(uo, p.lane), [xo, yo] = pt(ro, phiOf(uo));
          if (ro > 2) { c.globalAlpha = isSel ? 1 : Math.max(0.4, depthAlpha(ro)); c.fillStyle = isSel ? P.crimson : P.ink; c.beginPath(); c.arc(xo, yo, 2.2, 0, TWO_PI); c.fill(); c.globalAlpha = 1; }
        }
      }
      const u = p.Ld - S.D;
      if (u < lo || u > hi) continue;
      const r = rOf(u, p.lane);
      if (r < 1.5) continue;
      const phi = phiOf(u), [x, y] = pt(r, phi);
      if (x < -20 || y < -20 || x > geo.W + 20 || y > geo.H + 20) continue;
      const scale = Math.max(0.55, Math.min(1.25, 0.5 + 0.5 * r / geo.R0));
      const rad = 5.2 * scale;
      const col = open ? P.crimson : P.muted;
      c.save();
      c.globalAlpha = Math.max(0.45, depthAlpha(r));
      c.fillStyle = P.surface; c.beginPath(); c.arc(x, y, rad, 0, TWO_PI); c.fill();
      if (f.type === 'spread') {   // a 50% date: the ring half filled
        c.fillStyle = col; c.beginPath(); c.moveTo(x, y); c.arc(x, y, rad, Math.PI / 2, Math.PI * 1.5); c.closePath(); c.fill();
      }
      c.strokeStyle = col; c.lineWidth = 1.7; c.setLineDash([2.4, 1.9]);
      c.beginPath(); c.arc(x, y, rad, 0, TWO_PI); c.stroke(); c.setLineDash([]);
      const st = f._st;
      if (st === 'met' || st === 'late') { c.fillStyle = P.ink; c.beginPath(); c.arc(x, y, rad * 0.42, 0, TWO_PI); c.fill(); }
      else if (st === 'claimed') { c.strokeStyle = P.ink; c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, rad * 0.42, 0, TWO_PI); c.stroke(); }
      else if (st === 'missed') {
        const q = rad * 0.45; c.strokeStyle = P.ink; c.lineWidth = 1.3;
        c.beginPath(); c.moveTo(x - q, y - q); c.lineTo(x + q, y + q); c.moveTo(x + q, y - q); c.lineTo(x - q, y + q); c.stroke();
      }
      if (isSel || isHov) {
        c.globalAlpha = 1; c.strokeStyle = isSel ? P.ink : P.muted; c.lineWidth = isSel ? 1.8 : 1.2;
        c.beginPath(); c.arc(x, y, rad + (isSel ? 4.5 : 3.5), 0, TWO_PI); c.stroke();
      }
      c.restore();
      HIT.push({ id, x, y, rad: rad + 1, kind: 'fc' });
      blocks.push({ id, x: x - rad - 1, y: y - rad - 1, w: 2 * rad + 2, h: 2 * rad + 2 });
      let pri, font = F.fontLab, colorL = open ? P.crimsonInk : P.muted;
      if (isSel) { pri = 100; font = F.fontSel; colorL = P.ink; }
      else if (isHov) { pri = 98; colorL = P.ink; }
      else pri = (S.ahead ? 72 : 30) + Math.max(0, 12 - Math.abs(r - geo.R0) / geo.R0 * 14);
      pending.push({ kind: 'ev', id, r0: r, pri, text: shorten(f.short || f.t, isSel ? (F.small ? 34 : 46) : (F.small ? 26 : 32)),
        r: r + rad + (isSel ? 7 : 4), phi, dir: 1, font, color: colorL, alpha: isSel || isHov ? 1 : Math.max(0.65, depthAlpha(r)) });
    }
  }

  function markShape(c, e, x, y, rad, color, phi) {
    c.fillStyle = color; c.strokeStyle = color;
    if (e.th === 'model') {
      // a triangle pointing at the vanishing point
      const ux = -Math.sin(phi), uy = Math.cos(phi), px = -uy, py = ux, s = rad * 1.35;
      c.beginPath();
      c.moveTo(x + ux * s, y + uy * s);
      c.lineTo(x - ux * s * 0.7 + px * s * 0.9, y - uy * s * 0.7 + py * s * 0.9);
      c.lineTo(x - ux * s * 0.7 - px * s * 0.9, y - uy * s * 0.7 - py * s * 0.9);
      c.closePath(); c.fill();
    } else if (e.f === 'road') {
      c.lineWidth = Math.max(1.2, rad * 0.38);
      c.beginPath(); c.arc(x, y, rad, 0, TWO_PI);
      c.fillStyle = P.ribbon; c.fill(); c.stroke();
    } else if (e.f === 'verdict') {
      const s = rad * 1.6; c.fillRect(x - s / 2, y - s / 2, s, s);
    } else if (e.q) {
      const s = rad * 1.3;
      c.beginPath(); c.moveTo(x, y - s); c.lineTo(x + s, y); c.lineTo(x, y + s); c.lineTo(x - s, y); c.closePath(); c.fill();
    } else {
      c.beginPath(); c.arc(x, y, rad, 0, TWO_PI); c.fill();
    }
  }
  function shorten(s, n) { return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; }
  function rect(x, y, w, h) { return { x, y, w, h }; }
  function overlaps(a, b) { return a.x < b.x + b.w + 3 && b.x < a.x + a.w + 3 && a.y < b.y + b.h + 2 && b.y < a.y + a.h + 2; }
  function hits(a, b) { return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; }
  /* candidate boxes for a label: first pushed outward (dir 1) or inward (dir -1) along the radius,
     then for event labels to either side of the mark, then on the far side */
  function placeLabel(L, w, h) {
    const out = [];
    const sx = Math.sin(L.phi) * L.dir, sy = -Math.cos(L.phi) * L.dir;   // unit vector away from the anchor
    const [ax, ay] = pt(L.r, L.phi);
    let x, y;
    if (sx > 0.38) x = ax; else if (sx < -0.38) x = ax - w; else x = ax - w / 2;
    if (Math.abs(sx) > 0.38) y = ay - h / 2 + sy * 2; else y = sy < 0 ? ay - h : ay;
    out.push(rect(x, y, w, h));
    if (L.r0 != null) {
      const gap = L.r - L.r0;
      const [mx, my] = pt(L.r0, L.phi);
      out.push(rect(mx + gap, my - h / 2, w, h));
      out.push(rect(mx - gap - w, my - h / 2, w, h));
      const [bx, by] = pt(Math.max(0, L.r0 - gap), L.phi);
      const far = rect(bx - w / 2, sy < 0 ? by : by - h, w, h);
      far.last = true;
      out.push(far);
    }
    return out;
  }

  /* ---------- depth ---------- */
  let stopHintUntil = 0;
  function clampD(D) { return Math.max(DMIN, Math.min(DMAX, D)); }
  function headtag() {
    const tag = $('#headtag');
    if (S.push > 0) tag.textContent = S.ahead ? 'today · keep going to look back' : 'today · keep going to look ahead';
    else if (performance.now() < stopHintUntil && !canTurn()) tag.textContent = 'looking ahead starts from today';
    else tag.textContent = S.ahead ? 'ahead · ' + fmtAt(NOW_Y, S.D, 1) : 'head · ' + fmtAt(T, S.D);
  }
  function setD(D) {
    S.D = clampD(D);
    $('#depth').value = (-S.D).toFixed(3);
    headtag();
    requestDraw();
  }
  let anim = 0;
  function stopAnim() { if (anim) { cancelAnimationFrame(anim); anim = 0; } }
  function flyTo(D1, dur) {
    stopAnim();
    D1 = clampD(D1);
    const D0 = S.D;
    if (REDUCED || Math.abs(D1 - D0) < 1e-4) { setD(D1); return; }
    const ms = dur || Math.min(1500, 420 + 300 * Math.abs(D1 - D0));
    const t0 = performance.now();
    const stepFn = t => {
      const k = Math.min(1, (t - t0) / ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      setD(D0 + (D1 - D0) * e);
      anim = k < 1 ? requestAnimationFrame(stepFn) : 0;
    };
    anim = requestAnimationFrame(stepFn);
  }

  /* ---------- the floor, and turning round ----------
     Log time has no bottom at today, so travel stops one day short of it. Centred on now (or looking
     ahead), travel toward the centre that continues past that floor builds up pressure, drawn as a
     ring growing from the centre; enough of it turns the spiral round, to look ahead (or back). The
     view lands a few years out, and the next scroll in either direction means what it always means:
     in, toward today; out, away from it. Centred on 2045 there is no today at the centre
     to pass through, so the floor is a plain stop and the Looking ahead button is the way across. */
  let pushTimer = 0, quietUntil = 0;
  const live = msg => { const n = $('#vplive'); if (n) { n.textContent = ''; setTimeout(() => { n.textContent = msg; }, 30); } };
  function canTurn() { return S.ahead || S.vp === 'now'; }
  function pushReset() { clearTimeout(pushTimer); if (S.push) { S.push = 0; headtag(); requestDraw(); } }
  function pressure(add, holdMs) {
    const was = S.push;
    S.push = Math.min(1, S.push + add / PUSH);
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushReset, holdMs || 700);
    if (!was) live(S.ahead ? 'Today. Keep going to look back.' : 'Today. Keep going to look ahead.');
    headtag(); requestDraw();
    if (S.push >= 1) turnRound();
  }
  function atStop() {
    stopHintUntil = performance.now() + 1600;
    headtag();
    setTimeout(headtag, 1650);
  }
  /* travel toward the centre by `amount` decades */
  function inward(amount, holdMs) {
    const target = S.D - amount;
    if (target >= DMIN) { setD(target); return; }
    setD(DMIN);
    if (!canTurn()) { atStop(); return; }
    pressure(DMIN - target, holdMs);
  }
  function outward(amount) { pushReset(); setD(S.D + amount); }
  function turnRound() {
    pushReset();
    stopPlay(); stopAnim();
    quietUntil = performance.now() + 400;   // swallow the rest of the gesture that did it
    if (S.ahead) leaveAhead('now', LAND_D);
    else enterAhead(LAND_D);
  }
  function landAt(D1) {
    if (REDUCED) { setD(D1); return; }
    setD(DMIN); flashT = performance.now(); flyTo(D1, 1100);
  }
  function enterAhead(D1, opts) {
    opts = opts || {};
    stopPlay();
    setAheadState();
    if (!isF(S.sel) || FBY[S.sel]._st !== 'open') {
      // show the card of the open forecast nearest where the view lands
      const at = D1 == null ? LAND_D : D1;
      let best = null, bd = Infinity;
      for (const id in FPOS) { const d = Math.abs(FPOS[id].Ld - at); if (d < bd) { bd = d; best = id; } }
      if (best) { S.sel = best; renderFCard(FBY[best]); markList(); }
    }
    if (!opts.noLand) landAt(D1 == null ? LAND_D : D1);
    live('Looking ahead from today. ' + fcOpen().length + ' open forecasts. Scroll out to look further ahead.');
  }
  function leaveAhead(key, D1, opts) {
    opts = opts || {};
    const back = S.back;
    S.back = null;
    setCentre(key || (back && back.vp) || 'now');
    vpSel.value = S.vp;
    renderEras();
    if (!opts.noLand) landAt(D1 != null ? D1 : (back ? back.D : LAND_D));
    live('Looking back. Centre: ' + (S.vp === 'now' ? 'now' : VPS[S.vp].name) + '.');
  }
  $('#ahead').addEventListener('click', () => {
    stopPlay(); stopAnim(); pushReset();
    if (S.ahead) leaveAhead(null, null); else enterAhead(LAND_D);
  });

  /* ---------- selection and the card ---------- */
  function select(id, opts) {
    if (isF(id)) { selectF(id, opts); return; }
    const e = BY_ID[id];
    if (!e) return;
    opts = opts || {};
    if (S.ahead) leaveAhead(null, null, { noLand: true });
    S.sel = id;
    renderCard(e);
    markList();
    if (!opts.quiet) { try { history.replaceState(null, '', '#' + id); } catch (err) { /* ignore */ } }
    if (opts.fly !== false) flyTo(POS[id].Ld);
    requestDraw();
  }
  /* a forecast: open ones are shown looking ahead, the rest in the history view */
  function selectF(id, opts) {
    const f = FBY[id];
    opts = opts || {};
    if (f._st === 'open' && !S.ahead) enterAhead(null, { noLand: true });
    else if (f._st !== 'open' && S.ahead) leaveAhead(null, null, { noLand: true });
    if (!S.ahead && !S.fc) { S.fc = true; $('#fcshow').checked = true; syncMode(); }   // picking one shows them again
    S.sel = id;
    renderFCard(f);
    markList();
    if (!opts.quiet) { try { history.replaceState(null, '', '#' + id); } catch (err) { /* ignore */ } }
    if (opts.fly !== false && FPOS[id]) flyTo(FPOS[id].Ld);
    requestDraw();
  }
  function step(dir) {
    if (S.ahead) { stepF(dir, fcOpen()); return; }
    const set = stepSet();
    if (!set.length) return;
    const cur = BY_ID[S.sel];
    let i = set.indexOf(cur);
    if (i < 0) {
      const y = cur ? cur._p.y : (isF(S.sel) ? FBY[S.sel]._t.ring : T - Math.pow(10, S.D));
      if (dir > 0) { i = set.findIndex(e => e._p.y > y); if (i < 0) i = set.length - 1; }
      else { i = -1; for (let j = set.length - 1; j >= 0; j--) if (set[j]._p.y < y) { i = j; break; } if (i < 0) i = 0; }
    } else i = Math.max(0, Math.min(set.length - 1, i + dir));
    select(set[i].id);
  }
  function stepF(dir, set) {
    if (!set.length) return;
    let i = set.indexOf(FBY[S.sel]);
    i = i < 0 ? (dir > 0 ? 0 : set.length - 1) : Math.max(0, Math.min(set.length - 1, i + dir));
    selectF(set[i].id);
  }
  const FATE = { road: 'Road not taken: hand-built knowledge', verdict: 'Verdict' };
  function renderCard(e) {
    const tau = T - e._p.y;
    const k = kLabelFor(e._p.Y);
    const meta = [fmtDate(e)];
    if (k) meta.push(k);
    meta.push(tau > 0 ? fmtTau(tau) + ' from the centre' : 'after the centre');
    const set = stepSet(), idx = set.indexOf(e);
    const tags = ['<span class="tag">' + esc(THREADS[e.th].name) + '</span>'];
    if (e.th === 'model') tags.push('<span class="tag">' + esc(makerOf(e)) + '</span>');
    if (e.f) tags.push('<span class="tag ' + e.f + '">' + esc(FATE[e.f]) + '</span>');
    if (e.w === 3) tags.push('<span class="tag">Key milestone</span>');
    if (e.tag && e.tag.indexOf('demon') >= 0) tags.push('<span class="tag">Demon</span>');
    let html = '<p class="meta">' + esc(meta.join(' · ')) + '</p>' +
      '<h2>' + esc(e.t) + '</h2>' +
      '<div class="tags">' + tags.join('') + '</div>' +
      '<p class="x">' + esc(e.x) + '</p>';
    if (e.q) html += '<div class="voice texts"><h3>From the texts</h3><blockquote>“' + esc(e.q) + '”</blockquote><p class="qc">' + esc(e.qc) + '</p></div>';
    if (e.o) html += '<div class="voice page"><h3>This page</h3><p>' + esc(e.o) + '</p></div>';
    const fs = FC.filter(f => f.card === e.id);
    if (fs.length) html += '<div class="fclinks"><h3>' + (fs.length > 1 ? 'Forecasts' : 'The forecast') + ' in this source</h3>' +
      fs.map(f => '<button class="fclink" type="button" data-f="' + f.id + '"><span class="mk fc' + fcMarkClass(f) + '" aria-hidden="true"></span>' + esc(f.t) + ' · ' + esc(ST[f._st]) + '</button>').join('') + '</div>';
    const sees = seeOf(e);
    if (sees.length) html += '<div class="fclinks seelinks"><h3>Elsewhere on the spiral</h3>' +
      sees.map(m => '<button class="fclink" type="button" data-see="' + m.id + '"><span class="mk ' + markClass(m) + '" aria-hidden="true"></span>' +
        '<span>' + esc(m.t) + ' <span class="sd">' + esc(listDate(m)) + '</span></span></button>').join('') + '</div>';
    html += '<ul class="srcs" aria-label="Sources">' + e.s.map(s => '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + ' ↗</a></li>').join('') + '</ul>';
    html += '<nav class="cardnav" aria-label="Step through milestones"><button class="btn ghost" type="button" data-step="-1">← Prev</button>' +
      '<span class="pos">' + (idx >= 0 ? (idx + 1) + ' of ' + set.length : 'outside the current filter') + '</span>' +
      '<button class="btn ghost" type="button" data-step="1">Next →</button></nav>';
    const card = $('#card');
    card.classList.remove('fcard');
    card.innerHTML = html;
    card.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { stopPlay(); step(+b.dataset.step); }));
    card.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { stopPlay(); selectF(b.dataset.f); }));
    card.querySelectorAll('[data-see]').forEach(b => b.addEventListener('click', () => { stopPlay(); select(b.dataset.see); }));
  }

  /* ---------- forecast cards ---------- */
  const fday = d => fmtDate({ _p: parseD(d) });
  function named(f) {
    if (f.type === 'date') return (f.id === 'f-turing' ? 'about ' : '') + fday(f.at);
    if (f.type === 'deadline' || f.type === 'bet') return 'by ' + (parseD(f.due).M ? '' : 'the end of ') + fday(f.due);
    if (f.type === 'window') return fday(f.from) + ' to ' + fday(f.to);
    return (f.p10 ? '10% by ' + f.p10 + ', ' : '') + '50% by ' + f.p50;
  }
  function horizon(f) {
    const h = fcHorizon(f), fmt = y => y >= 2 ? Math.round(y) + ' years' : (y >= 1 / 6 ? Math.round(y * 12) + ' months' : Math.round(y * 365.2425) + ' days');
    return Math.abs(h[1] - h[0]) < 0.05 ? fmt(h[0]) : fmt(h[0]) + ' to ' + fmt(h[1]);
  }
  function fcMarkClass(f) {
    const st = f._st;
    return (f.type === 'spread' ? ' half' : '') + (st === 'open' ? '' : ' done') + (st === 'met' || st === 'late' ? ' hit' : '') +
      (st === 'claimed' ? ' claim' : '') + (st === 'missed' ? ' miss' : '');
  }
  function outcomeHtml(f) {
    const st = f._st, o = f.outcome, t = f._t;
    if (st === 'open') {
      if (f.type === 'spread') return '<p>Open. Odds do not close: ' + (t.ring < NOW_Y ? 'the 50 percent date has passed, and that alone does not make it wrong.' : 'nothing is settled when a date passes.') + '</p>';
      const when = new Date(t.closes - 1);
      return '<p>Open until the end of ' + esc(when.getUTCDate() + ' ' + MONTHS_LONG[when.getUTCMonth()] + ' ' + when.getUTCFullYear()) + '.' +
        (o && o.after ? ' From the next day the page counts it as ' + esc(ST[o.is].toLowerCase()) + ', on the evidence of ' + esc(o.judge.replace(/^The /, 'the ')) + '.' : '') + '</p>';
    }
    if (st === 'closed') return '<p>Its time has passed and no verdict is recorded yet. The page waits for one rather than judging it.</p>';
    let h = '<p><b>' + esc(ST[st]) + '</b>' + (o.on && st !== 'none' ? ', ' + esc(fday(o.on)) : '') + '.</p><p class="judge">Who judged: ' + esc(o.judge) + '.</p>';
    if (o.say) h += '<blockquote>“' + esc(o.say) + '”</blockquote><p class="qc">' + esc(o.sayc) + (o.s ? ' · <a href="' + esc(o.s[1]) + '" target="_blank" rel="noopener">source ↗</a>' : '') + '</p>';
    return h;
  }
  function renderFCard(f) {
    const st = f._st;
    const meta = ['Said ' + fday(f.made), named(f), 'horizon ' + horizon(f)];
    const tags = ['<span class="tag">' + esc(THREADS[f.th].name) + '</span>', '<span class="tag">' + esc(GROUP[f.group]) + '</span>',
      '<span class="tag">' + esc(TYPE[f.type]) + (f.prob ? ': ' + esc(f.prob) : '') + '</span>',
      '<span class="tag st st-' + st + '">' + esc(ST[st]) + '</span>'];
    const land = f.group === 'land';
    let html = '<p class="meta">' + esc(meta.join(' · ')) + '</p>' +
      '<h2>' + esc(f.t) + '</h2>' +
      '<p class="who">' + esc(f.who) + '</p>' +
      '<div class="tags">' + tags.join('') + '</div>' +
      '<div class="voice ' + (land ? 'texts' : 'said') + '"><h3>' + (land ? 'From the texts' : 'In their words') + '</h3><blockquote>“' + esc(f.say) + '”</blockquote><p class="qc">' + esc(f.sayc) + '</p></div>' +
      '<p class="x">' + esc(f.x) + '</p>' +
      '<dl class="fcdl"><dt>The event, in their words</dt><dd>' + esc(f.event) + '</dd>' +
      '<dt>How it is decided</dt><dd>' + esc(f.decide) + '</dd>' +
      '<dt>Outcome</dt><dd>' + outcomeHtml(f) + '</dd></dl>';
    if (f.read) html += '<div class="voice page"><h3>This page</h3><p>' + esc(f.read) + '</p></div>';
    if (f.card && BY_ID[f.card]) html += '<p class="fcfrom">On the spiral: <button class="linkish" type="button" data-ev="' + f.card + '">' + esc(BY_ID[f.card].t) + '</button></p>';
    html += '<ul class="srcs" aria-label="Sources">' + f.s.map(s => '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + ' ↗</a></li>').join('') + '</ul>';
    const set = st === 'open' ? fcOpen() : fcDone(), idx = set.indexOf(f);
    html += '<nav class="cardnav" aria-label="Step through forecasts"><button class="btn ghost" type="button" data-fstep="-1">← Prev</button>' +
      '<span class="pos">' + (idx + 1) + ' of ' + set.length + (st === 'open' ? ' open' : ' resolved') + '</span>' +
      '<button class="btn ghost" type="button" data-fstep="1">Next →</button></nav>';
    const card = $('#card');
    card.classList.add('fcard');
    card.innerHTML = html;
    card.querySelectorAll('[data-fstep]').forEach(b => b.addEventListener('click', () => { stopPlay(); stepF(+b.dataset.fstep, set); }));
    card.querySelectorAll('[data-ev]').forEach(b => b.addEventListener('click', () => { stopPlay(); select(b.dataset.ev); }));
  }

  /* ---------- the list of forecasts: a text version of the rings, with a strip for each ----------
     Each strip is a line of time with today in the middle: log time back to the left, ahead to the
     right, one month to a hundred years each way. A bar runs from the day a forecast was said to the
     date it named; the ring is the date named. */
  const STRIP = { lo: Math.log10(1 / 12), hi: 2 };
  const STRIP_TICKS = [-10, -1, 1, 10].map(d => '<i class="fs-tick" style="left:' + (50 + Math.sign(d) * 50 * (Math.log10(Math.abs(d)) - STRIP.lo) / (STRIP.hi - STRIP.lo)).toFixed(1) + '%"></i>').join('');
  function stripX(y) {
    const d = y - NOW_Y, a = Math.abs(d);
    const k = Math.max(0, Math.min(1, (Math.log10(Math.max(a, 1e-9)) - STRIP.lo) / (STRIP.hi - STRIP.lo)));
    return 50 + (d < 0 ? -50 : 50) * k;
  }
  function stripHtml(f) {
    const t = f._t, st = f._st;
    const x0 = stripX(t.made), x1 = stripX(t.ring), xs = Math.min(x0, x1), xe = Math.max(x0, x1);
    let h = '<span class="fs" aria-hidden="true">' + STRIP_TICKS + '<i class="fs-now"></i>';
    h += '<i class="fs-thread" style="left:' + xs.toFixed(1) + '%;width:' + (xe - xs).toFixed(1) + '%"></i>';
    if (f.type === 'window') { const a = stripX(t.a), b = stripX(t.b); h += '<i class="fs-win" style="left:' + Math.min(a, b).toFixed(1) + '%;width:' + Math.max(1, Math.abs(b - a)).toFixed(1) + '%"></i>'; }
    if (t.p10 != null) h += '<i class="fs-p10" style="left:' + stripX(t.p10).toFixed(1) + '%"></i>';
    h += '<i class="fs-said" style="left:' + x0.toFixed(1) + '%"></i>';
    h += '<i class="mk fc' + fcMarkClass(f) + '" style="left:' + x1.toFixed(1) + '%"></i></span>';
    return h;
  }
  /* short dates for the list: 28 Oct 2025, Oct 2025, 2025 */
  const sday = d => { const p = parseD(d); return (p.D ? p.D + ' ' : '') + (p.M ? MONTHS[p.M - 1] + ' ' : '') + p.Y; };
  function namedShort(f) {
    if (f.type === 'date') return (f.id === 'f-turing' ? 'about ' : '') + sday(f.at);
    if (f.type === 'deadline' || f.type === 'bet') return 'by ' + sday(f.due);
    if (f.type === 'window') return sday(f.from) + '–' + sday(f.to);
    return (f.p10 ? '10% ' + f.p10 + ', ' : '') + '50% ' + f.p50;
  }
  function fcRow(f) {
    const st = f._st;
    return '<li><button class="fi" type="button" data-id="' + f.id + '">' +
      '<span class="fd">' + esc(sday(f.made)) + ' <span aria-hidden="true">→</span><span class="sr"> to </span> ' + esc(namedShort(f)) + '</span>' +
      '<span class="ft"><span class="fw">' + esc(f.who) + '</span> ' + esc(f.t) + ' <span class="st st-' + st + '">' + esc(ST[st]) + '</span></span>' +
      stripHtml(f) + '</button></li>';
  }
  function renderFList() {
    if (!FC.length) { $('#fclist').hidden = true; return; }
    const open = fcOpen(), done = fcDone().reverse();
    $('#fc-open').innerHTML = open.map(fcRow).join('');
    $('#fc-done').innerHTML = done.map(fcRow).join('');
    $('#fccount').textContent = FC.length + ' forecasts, counted apart from the ' + EVENTS.length + ' milestones · ' + open.length + ' open · ' + done.length + ' resolved or closed';
    $('#fc-open-h').textContent = 'Open · ' + open.length + ', soonest first';
    $('#fc-done-h').textContent = 'Resolved or closed · ' + done.length + ', latest first';
  }
  $('#fclist').addEventListener('click', ev => {
    const b = ev.target.closest('.fi');
    if (!b) return;
    stopPlay();
    selectF(b.dataset.id);
    const box = $('.tunnel-box');
    if (box && box.scrollIntoView) box.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- the list of milestones ---------- */
  const ERAS = [
    { name: 'Before 1900', sub: 'Zero, ledgers and engines', to: 1900 },
    { name: '1900–1945', sub: 'Foundations and limits', to: 1946 },
    { name: '1946–1979', sub: 'Cybernetics to the first winter', to: 1980 },
    { name: '1980–2005', sub: 'Rules, statistics and the Web', to: 2006 },
    { name: '2006–2016', sub: 'Deep learning', to: 2017 },
    { name: '2017–2022', sub: 'The Transformer era', to: 2023 },
    { name: '2023 to now', sub: 'Agents and capital', to: 1e9 }
  ];
  function markClass(e) { return e.th === 'model' ? 'tri' : (e.f === 'road' ? 'ring' : (e.f === 'verdict' ? 'sq' : (e.q ? 'dia' : 'dot'))); }
  function listDate(e) {
    const p = e._p;
    if (e.dl && e.dl.length <= 12) return e.dl;   // longer labels (c. 3300–3000 BCE, Late Shang, …) don't fit the list's date column
    if (p.D) return p.D + ' ' + MONTHS[p.M - 1] + ' ' + p.Y;
    if (p.M) return MONTHS[p.M - 1] + ' ' + p.Y;
    return (p.circa ? 'c. ' : '') + (p.Y < 0 ? (-p.Y) + ' BCE' : p.Y);
  }
  function renderList() {
    const set = CHRONO.filter(e => shown(e) && inFocus(e));
    const parts = [];
    let from = -1e9;
    for (const era of ERAS) {
      const items = set.filter(e => e._p.Y >= from && e._p.Y < era.to);
      from = era.to;
      if (!items.length) continue;
      parts.push('<div class="era"><h3>' + esc(era.name) + ' <small>' + esc(era.sub) + ' · ' + items.length + '</small></h3><ul>' +
        items.map(e => '<li><button class="li" type="button" data-id="' + e.id + '">' +
          '<span class="ld">' + esc(listDate(e)) + '</span><span class="mk ' + markClass(e) + '" aria-hidden="true"></span>' +
          '<span class="lt' + (e.w === 3 ? ' lw3' : '') + '">' + esc(e.t) + ' <span class="lth">' + esc(e.th === 'model' ? makerOf(e) : THREADS[e.th].name) + '</span></span></button></li>').join('') +
        '</ul></div>');
    }
    $('#eralist').innerHTML = parts.join('') || '<p>No milestones match these settings.</p>';
    const what = [];
    if (S.thread) what.push(THREADS[S.thread].name);
    if (S.demons) what.push('demons');
    if (S.lab) what.push(LABS[S.lab] + ' releases');
    if (S.keyOnly) what.push('key milestones');
    if (S.bitter) what.push('Bitter Lesson view');
    $('#listcount').textContent = set.length + ' of ' + EVENTS.length + (what.length ? ' · ' + what.join(', ') : ' · tap any line to fly there');
    markList();
  }
  function markList() {
    document.querySelectorAll('.li[aria-current], .fi[aria-current]').forEach(b => b.removeAttribute('aria-current'));
    const b = document.querySelector('.li[data-id="' + S.sel + '"], .fi[data-id="' + S.sel + '"]');
    if (b) b.setAttribute('aria-current', 'true');
  }
  $('#eralist').addEventListener('click', ev => {
    const b = ev.target.closest('.li');
    if (!b) return;
    stopPlay();
    select(b.dataset.id);
    const box = $('.tunnel-box');
    if (box && box.scrollIntoView) box.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- lanes, options, eras ---------- */
  function renderLaneChips() {
    const counts = {};
    for (const e of EVENTS) if (shown(e)) counts[e.th] = (counts[e.th] || 0) + 1;
    const demons = EVENTS.filter(e => shown(e) && e.tag && e.tag.indexOf('demon') >= 0).length;
    $('#lanechips').innerHTML =
      '<button class="chip" type="button" data-th="" aria-pressed="' + (!S.thread && !S.demons) + '">All</button>' +
      THREAD_ORDER.map(k => '<button class="chip violet" type="button" data-th="' + k + '" aria-pressed="' + (S.thread === k) + '" title="' + esc(THREADS[k].blurb) + '">' +
        esc(THREADS[k].name) + '<span class="n">' + (counts[k] || 0) + '</span></button>').join('') +
      '<button class="chip violet" type="button" data-demons="1" aria-pressed="' + S.demons + '" title="Laplace’s, Maxwell’s, Selfridge’s, the Ccru’s and Musk’s">Demons<span class="n">' + demons + '</span></button>';
  }
  $('#lanechips').addEventListener('click', ev => {
    const b = ev.target.closest('.chip');
    if (!b) return;
    if (b.dataset.demons) { S.demons = !S.demons; S.thread = null; }
    else { const k = b.dataset.th; S.thread = k && S.thread !== k ? k : null; S.demons = false; }
    S.lab = null;
    refreshFilters(true);
  });
  function renderLabChips() {
    const counts = {};
    for (const e of EVENTS) if (e.th === 'model') for (const k of labsOf(e)) counts[k] = (counts[k] || 0) + 1;
    $('#labchips').innerHTML = LAB_ORDER.map(k => '<button class="chip violet" type="button" data-lab="' + k + '" aria-pressed="' + (S.lab === k) + '">' +
      esc(LABS[k]) + '<span class="n">' + (counts[k] || 0) + '</span></button>').join('');
  }
  $('#labchips').addEventListener('click', ev => {
    const b = ev.target.closest('.chip');
    if (!b) return;
    const k = b.dataset.lab;
    S.lab = S.lab === k ? null : k;
    S.thread = null; S.demons = false;
    refreshFilters(true);
  });
  /* releases per year: one series, bars with every value labelled */
  function renderPace() {
    const rel = EVENTS.filter(e => e.th === 'model' && (!S.lab || labsOf(e).indexOf(S.lab) >= 0));
    // up to this year, or to the last year with a release recorded if the page has not been updated since
    const yNow = new Date(NOW_MS).getUTCFullYear();
    const y0 = 2018, y1 = Math.min(yNow, Math.max(y0, ...EVENTS.filter(e => e.th === 'model').map(e => e._p.Y)));
    const counts = [];
    for (let y = y0; y <= y1; y++) counts.push({ y, n: rel.filter(e => e._p.Y === y).length });
    const max = Math.max(1, ...counts.map(c => c.n));
    const W = 360, H = 132, top = 18, bottom = 20, left = 2, right = 2;
    const band = (W - left - right) / counts.length, bw = Math.min(24, band * 0.6), ph = H - top - bottom;
    const bars = counts.map((c, i) => {
      const x = left + band * i + (band - bw) / 2, h = c.n ? Math.max(2, ph * c.n / max) : 0, y = top + ph - h;
      const partial = c.y === yNow;
      const r = Math.min(4, h, bw / 2);
      const path = h ? 'M' + x + ',' + (top + ph) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y + 'H' + (x + bw - r) + 'Q' + (x + bw) + ',' + y + ' ' + (x + bw) + ',' + (y + r) + 'V' + (top + ph) + 'Z' : '';
      const label = c.y + ': ' + c.n + (c.n === 1 ? ' release' : ' releases') + (partial ? ' so far' : '');
      return '<g><title>' + esc(label) + '</title>' +
        '<rect x="' + (left + band * i) + '" y="0" width="' + band + '" height="' + H + '" fill="transparent"></rect>' +
        (path ? '<path class="pbar' + (partial ? ' partial' : '') + '" d="' + path + '"></path>' : '') +
        '<text class="pval" x="' + (x + bw / 2) + '" y="' + (y - 5) + '">' + c.n + '</text>' +
        '<text class="pyr" x="' + (x + bw / 2) + '" y="' + (H - 5) + '">' + (partial ? c.y + '*' : c.y) + '</text></g>';
    }).join('');
    $('#pace').innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Model releases per year on this spiral' + (S.lab ? ', ' + esc(LABS[S.lab]) : '') + ': ' +
      counts.map(c => c.y + ' ' + c.n).join(', ') + '"><line class="pbase" x1="0" x2="' + W + '" y1="' + (top + ph) + '" y2="' + (top + ph) + '"></line>' + bars + '</svg>';
    $('#pace-title').textContent = 'Model releases per year' + (S.lab ? ' · ' + LABS[S.lab] : '');
  }
  /* the body of the machine: two single-series bar charts in the Notes, drawn like the releases chart.
     BODY in data.js holds the figures; the summary sentences and tables are computed from it. */
  function bmBars(rows, h, label, tick, tip, aria) {
    const max = Math.max(...rows.map(h));
    const W = 360, H = 132, top = 18, bottom = 20, left = 2, right = 2;
    const band = (W - left - right) / rows.length, bw = Math.min(24, band * 0.6), ph = H - top - bottom;
    const bars = rows.map((r, i) => {
      const x = left + band * i + (band - bw) / 2, hh = Math.max(2, ph * h(r) / max), y = top + ph - hh;
      const rr = Math.min(4, hh, bw / 2);
      const path = 'M' + x + ',' + (top + ph) + 'V' + (y + rr) + 'Q' + x + ',' + y + ' ' + (x + rr) + ',' + y + 'H' + (x + bw - rr) + 'Q' + (x + bw) + ',' + y + ' ' + (x + bw) + ',' + (y + rr) + 'V' + (top + ph) + 'Z';
      const lab = label(r, i);
      return '<g><title>' + esc(tip(r)) + '</title>' +
        '<rect x="' + (left + band * i) + '" y="0" width="' + band + '" height="' + H + '" fill="transparent"></rect>' +
        '<path class="pbar" d="' + path + '"></path>' +
        (lab ? '<text class="pval" x="' + (x + bw / 2) + '" y="' + (y - 5) + '">' + esc(lab) + '</text>' : '') +
        '<text class="pyr" x="' + (x + bw / 2) + '" y="' + (H - 5) + '">' + esc(tick(r)) + '</text></g>';
    }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(aria) + '"><line class="pbase" x1="0" x2="' + W + '" y1="' + (top + ph) + '" y2="' + (top + ph) + '"></line>' + bars + '</svg>';
  }
  function renderBody() {
    if (typeof BODY === 'undefined' || !$('#bm-msft')) return;
    const n0 = v => v.toLocaleString('en-GB');
    const bn = v => (v / 1000).toFixed(1);
    const M = BODY.msft.rows, I = BODY.ireland.rows;
    const m0 = M[0], m1 = M[M.length - 1], mp = M[M.length - 2];
    $('#bm-msft').innerHTML = bmBars(M, r => r.v, r => bn(r.v), r => r.k,
      r => r.k + ', the year to ' + r.end + ': $' + n0(r.v) + ' million',
      'Microsoft’s cash additions to property and equipment, US$ billion: ' + M.map(r => r.k + ' ' + bn(r.v)).join(', '));
    $('#bm-lease').textContent = m1.lease ? ' ($' + bn(m1.lease) + ' billion of them in fiscal ' + m1.k.slice(2) + ')' : '';
    $('#bm-msft-sum').textContent = m1.k + ' was ' + (m1.v / m0.v).toFixed(1) + ' times ' + m0.k + ' and ' +
      Math.round((m1.v / mp.v - 1) * 100) + ' percent more than ' + mp.k + '.';
    const i0 = I[0], i1 = I[I.length - 1];
    $('#bm-ie').innerHTML = bmBars(I, r => r.v, (r, i) => (i === 0 || i === I.length - 1) ? n0(r.v) : '', r => r.k,
      r => r.k + ': ' + n0(r.v) + ' GWh, ' + r.pct + '% of all metered electricity',
      'Electricity used by Ireland’s data centres, gigawatt hours: ' + I.map(r => r.k + ' ' + n0(r.v)).join(', '));
    $('#bm-ie-sum').textContent = 'Data centres used ' + (i1.v / i0.v).toFixed(1) + ' times as much in ' + i1.k + ' as in ' + i0.k +
      ', and their share rose from ' + i0.pct + ' to ' + i1.pct + ' percent.';
    const srcs = s => '<ul class="srcs">' + s.map(([l, u]) => '<li><a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(l) + '</a></li>').join('') + '</ul>';
    $('#bm-tables').innerHTML =
      '<div class="bmtbl"><table><caption>Microsoft, additions to property and equipment</caption>' +
      '<thead><tr><th scope="col">Fiscal year</th><th scope="col">Year ends</th><th scope="col" class="r">US$ million</th></tr></thead><tbody>' +
      M.map(r => '<tr><th scope="row">' + r.k + '</th><td>' + r.end + '</td><td class="r">' + n0(r.v) + '</td></tr>').join('') +
      '</tbody></table></div>' + srcs(BODY.msft.s) +
      '<div class="bmtbl"><table><caption>Ireland, metered electricity</caption>' +
      '<thead><tr><th scope="col">Year</th><th scope="col" class="r">Data centres, GWh</th><th scope="col" class="r">All metered, GWh</th><th scope="col" class="r">Share</th></tr></thead><tbody>' +
      I.map(r => '<tr><th scope="row">' + r.k + '</th><td class="r">' + n0(r.v) + '</td><td class="r">' + n0(r.total) + '</td><td class="r">' + r.pct + '%</td></tr>').join('') +
      '</tbody></table></div>' + srcs(BODY.ireland.s);
  }
  function refreshFilters(jump) {
    renderLaneChips();
    renderLabChips();
    renderPace();
    renderList();
    const cur = BY_ID[S.sel];
    if (jump && focusOn() && (!cur || !inFocus(cur))) {
      // move to the focused milestone nearest the head
      const set = stepSet();
      if (set.length) {
        let best = set[0], bd = Infinity;
        for (const e of set) { const d = Math.abs(POS[e.id].Ld - S.D); if (d < bd) { bd = d; best = e; } }
        select(best.id);
        return;
      }
    }
    if (cur) renderCard(cur);
    requestDraw();
  }
  $('#bitter').addEventListener('change', ev => { S.bitter = ev.target.checked; refreshFilters(false); });
  $('#keyonly').addEventListener('change', ev => { S.keyOnly = ev.target.checked; refreshFilters(false); });
  $('#fcshow').addEventListener('change', ev => { S.fc = ev.target.checked; syncMode(); requestDraw(); });

  const vpSel = $('#vp');
  vpSel.innerHTML =
    '<option value="now">Now</option>' +
    '<option value="k2045">2045 · Kurzweil</option>';
  vpSel.addEventListener('change', () => {
    stopPlay(); stopAnim(); pushReset();
    S.back = null;
    setCentre(vpSel.value);
    const cur = BY_ID[S.sel];
    if (cur) { setD(POS[cur.id].Ld); renderCard(cur); }
    else if (isF(S.sel) && FPOS[S.sel]) setD(FPOS[S.sel].Ld);
    else setD(LAND_D);
    renderEras();
  });

  function renderEras() {
    const marks = [['Writing', 'uruk'], ['Zero', 'brahmagupta'], ['Ledgers', 'pacioli'], ['K-00', 'hilbert'], ['1950', 'turing50'], ['2000', 'y2k'], ['Transformer', 'transformer'], ['Today', '']];
    $('#eras').innerHTML = marks.map(m => '<button class="chip" type="button" data-id="' + m[1] + '">' + esc(m[0]) + '</button>').join('');
  }
  $('#eras').addEventListener('click', ev => {
    const b = ev.target.closest('.chip');
    if (!b) return;
    stopPlay();
    const id = b.dataset.id;
    if (id && BY_ID[id]) { if (!shown(BY_ID[id])) { S.bitter = false; S.keyOnly = false; $('#bitter').checked = false; $('#keyonly').checked = false; refreshFilters(false); } select(id); return; }
    flyTo(LNOW == null ? DMIN + 0.4 : LNOW);
  });

  /* ---------- play: descend toward the centre ---------- */
  let playRaf = 0, playTimer = 0;
  function setPlayButton() {
    const b = $('#play');
    b.setAttribute('aria-pressed', String(S.playing));
    b.textContent = S.playing ? '❚❚ Pause' : '▶︎ Descend';
  }
  function stopPlay() {
    if (!S.playing) return;
    S.playing = false;
    if (playRaf) cancelAnimationFrame(playRaf);
    if (playTimer) clearInterval(playTimer);
    playRaf = 0; playTimer = 0;
    setPlayButton();
  }
  /* looking ahead, Descend comes in from the furthest forecast toward today */
  function startPlay() {
    stopAnim();
    S.playing = true; setPlayButton();
    if (REDUCED) {
      playTimer = setInterval(() => {
        if (S.ahead) {
          const set = fcOpen().slice().reverse(), i = set.indexOf(FBY[S.sel]);
          if (i >= set.length - 1) { stopPlay(); return; }
          selectF(set[i + 1].id, { quiet: true });
          return;
        }
        const set = stepSet(), i = set.indexOf(BY_ID[S.sel]);
        if (i >= set.length - 1) { stopPlay(); return; }
        step(1);
      }, 4000);
      return;
    }
    if (S.D <= DMIN + 0.03) setD(DMAX);
    let last = performance.now(), lastCard = 0;
    const tick = t => {
      if (!S.playing) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      const speed = S.D > 2.2 ? 0.3 : 0.11;
      const D0 = S.D, D1 = Math.max(DMIN, D0 - speed * dt);
      if (t - lastCard > 650) {
        let best = null;
        if (S.ahead) {
          for (const id in FPOS) { const L = FPOS[id].Ld; if (L <= D0 && L > D1) best = id; }
          if (best) { selectF(best, { fly: false, quiet: true }); lastCard = t; }
        } else {
          for (const e of stepSet()) {
            const L = POS[e.id].Ld;
            if (L <= D0 && L > D1 && e.w >= 2 && (!best || e.w > best.w)) best = e;
          }
          if (best) { select(best.id, { fly: false, quiet: true }); lastCard = t; }
        }
      }
      setD(D1);
      if (D1 <= DMIN + 1e-6) { stopPlay(); return; }
      playRaf = requestAnimationFrame(tick);
    };
    playRaf = requestAnimationFrame(tick);
  }
  function togglePlay() { if (S.playing) stopPlay(); else startPlay(); }
  $('#play').addEventListener('click', togglePlay);
  $('#prev').addEventListener('click', () => { stopPlay(); step(-1); });
  $('#next').addEventListener('click', () => { stopPlay(); step(1); });
  $('#depth').addEventListener('input', ev => { stopPlay(); stopAnim(); pushReset(); setD(-parseFloat(ev.target.value)); });

  /* ---------- pointer, wheel and keys ---------- */
  const ptrs = new Map();
  let drag = null, pinch = null;
  function angAt(x, y) { return Math.atan2(x - geo.cx, -(y - geo.cy)); }
  function nearest(x, y, slop) {
    let best = null, bd = Infinity;
    for (const h of HIT) {
      const d = Math.hypot(h.x - x, h.y - y) - h.rad;
      if (d < slop && d < bd) { bd = d; best = h; }
    }
    return best;
  }
  function local(ev) { const b = cv.getBoundingClientRect(); return [ev.clientX - b.left, ev.clientY - b.top]; }
  cv.addEventListener('pointerdown', ev => {
    stopPlay(); stopAnim();
    const [x, y] = local(ev);
    ptrs.set(ev.pointerId, { x, y, x0: x, y0: y });
    if (ev.pointerType === 'mouse') { try { cv.setPointerCapture(ev.pointerId); } catch (err) { /* ignore */ } }
    if (ptrs.size === 1) drag = { id: ev.pointerId, a: angAt(x, y), moved: false, type: ev.pointerType };
    else if (ptrs.size === 2) {
      drag = null;
      const [p1, p2] = Array.from(ptrs.values());
      pinch = { d0: Math.hypot(p1.x - p2.x, p1.y - p2.y), D0: S.D, done: false };
    }
  });
  cv.addEventListener('pointermove', ev => {
    const [x, y] = local(ev);
    const p = ptrs.get(ev.pointerId);
    if (!p) {
      if (ev.pointerType === 'mouse') {
        const h = nearest(x, y, 9);
        const id = h ? h.id : null;
        if (id !== S.hover) { S.hover = id; cv.classList.toggle('over', !!id); requestDraw(); }
      }
      return;
    }
    p.x = x; p.y = y;
    if (pinch && ptrs.size >= 2) {
      if (pinch.done) return;     // this pinch already turned the spiral round
      const [p1, p2] = Array.from(ptrs.values());
      const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (pinch.d0 > 10) {
        const target = pinch.D0 - Math.log(d / pinch.d0) / LG;
        if (target >= DMIN) { if (S.push) pushReset(); setD(target); }
        else if (!canTurn()) { setD(DMIN); atStop(); }
        else {
          // a pinch carries its pressure with it: spreading the fingers further past the floor adds to it
          setD(DMIN);
          S.push = Math.min(1, (DMIN - target) / PUSH);
          clearTimeout(pushTimer);
          headtag(); requestDraw();
          if (S.push >= 1) { pinch.done = true; turnRound(); }
        }
      }
      return;
    }
    if (drag && drag.id === ev.pointerId) {
      if (!drag.moved && Math.hypot(x - p.x0, y - p.y0) > 6) { drag.moved = true; cv.classList.add('dragging'); }
      if (drag.moved) {
        const a = angAt(x, y);
        let da = a - drag.a;
        if (da > Math.PI) da -= TWO_PI; else if (da < -Math.PI) da += TWO_PI;
        drag.a = a;
        // turning the spiral by hand never turns it round: the floor is a plain stop for dragging
        if (Math.hypot(x - geo.cx, y - geo.cy) > 16) setD(S.D + (S.ahead ? -1 : 1) * da / TWO_PI);
      }
    }
  });
  function endPointer(ev) {
    const p = ptrs.get(ev.pointerId);
    ptrs.delete(ev.pointerId);
    if (ptrs.size < 2) { if (pinch && !pinch.done) pushReset(); pinch = null; }
    if (drag && drag.id === ev.pointerId) {
      if (!drag.moved && ev.type === 'pointerup' && p) {
        const h = nearest(p.x, p.y, drag.type === 'mouse' ? 9 : 16);
        if (h) select(h.id);
      }
      drag = null;
      cv.classList.remove('dragging');
    }
  }
  cv.addEventListener('pointerup', endPointer);
  cv.addEventListener('pointercancel', endPointer);
  cv.addEventListener('pointerleave', ev => {
    if (ev.pointerType === 'mouse' && S.hover) { S.hover = null; cv.classList.remove('over'); requestDraw(); }
  });
  cv.addEventListener('wheel', ev => {
    ev.preventDefault();
    stopPlay();
    const now = performance.now();
    if (now < quietUntil) { quietUntil = now + 250; return; }   // the tail of the gesture that turned the spiral round
    stopAnim();
    let dy = ev.deltaY;
    if (ev.deltaMode === 1) dy *= 16; else if (ev.deltaMode === 2) dy *= 400;
    const k = ev.ctrlKey ? 0.006 : 0.0016;
    if (dy < 0) inward(-dy * k); else if (dy > 0) outward(dy * k);
  }, { passive: false });
  cv.addEventListener('keydown', ev => {
    const k = ev.key;
    if (k === 'ArrowRight') { stopPlay(); step(1); }
    else if (k === 'ArrowLeft') { stopPlay(); step(-1); }
    else if (k === 'ArrowUp' || k === '+' || k === '=') {
      stopPlay(); stopAnim();
      // at the floor, two presses in a row turn the spiral round
      if (S.D <= DMIN + 1e-6 && canTurn()) pressure(PUSH / 2 + 1e-6, 1600);
      else inward(0.08, 1600);
    }
    else if (k === 'ArrowDown' || k === '-' || k === '_') { stopPlay(); stopAnim(); outward(0.08); }
    else if (k === ' ' || k === 'Spacebar') togglePlay();
    else if (k === 'Home') { stopPlay(); pushReset(); flyTo(DMAX); }
    else if (k === 'End') { stopPlay(); pushReset(); flyTo(DMIN); }
    else return;
    ev.preventDefault();
  });

  /* ---------- size and theme ---------- */
  function resize() {
    const b = cv.getBoundingClientRect();
    if (!b.width || !b.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    geo.W = b.width; geo.H = b.height; geo.dpr = dpr;
    cv.width = Math.round(b.width * dpr); cv.height = Math.round(b.height * dpr);
    geo.cx = geo.W / 2; geo.cy = geo.H / 2;
    geo.Rmax = Math.min(geo.W, geo.H) / 2 - 6;
    geo.R0 = geo.Rmax * 0.6;
    draw();
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(cv);
  window.addEventListener('resize', resize);
  const themeChanged = () => { readPalette(); requestDraw(); };
  if (window.matchMedia) {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', themeChanged); else if (mq.addListener) mq.addListener(themeChanged);
  }
  new MutationObserver(themeChanged).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestDraw());

  /* ---------- start ---------- */
  window.__vanishing = {
    state: S, hits: () => HIT.slice(),
    range: () => ({ DMIN, DMAX, T, LNOW, FLOOR, ahead: S.ahead, now: NOW_MS }),
    geo: () => ({ cx: geo.cx, cy: geo.cy, R0: geo.R0, Rmax: geo.Rmax, W: geo.W, H: geo.H, grow: GROW, lanes: LANE_D.slice() }),
    forecasts: () => FC.map(f => ({ id: f.id, status: f._st, lane: THREADS[f.th].lane, ring: f._t.ring, made: f._t.made, pos: FPOS[f.id] ? Object.assign({}, FPOS[f.id]) : null }))
  };
  function fromHash() {
    const h = (location.hash || '').replace(/^#/, '');
    return h && (BY_ID[h] || FBY[h]) ? h : null;
  }
  window.addEventListener('hashchange', () => { const id = fromHash(); if (id && id !== S.sel) select(id); });

  readPalette();
  document.querySelectorAll('[data-count="all"]').forEach(n => { n.textContent = EVENTS.length; });
  document.querySelectorAll('[data-count="key"]').forEach(n => { n.textContent = EVENTS.filter(e => e.w === 3).length; });
  document.querySelectorAll('[data-count="models"]').forEach(n => { n.textContent = EVENTS.filter(e => e.th === 'model').length; });
  document.querySelectorAll('[data-count="forecasts"]').forEach(n => { n.textContent = FC.length; });
  setCentre('now');
  vpSel.value = S.vp;
  renderLaneChips();
  renderLabChips();
  renderPace();
  renderBody();
  renderEras();
  renderFList();
  const first = fromHash() || LATEST;
  if (isF(first)) {
    S.sel = first;
    renderList();
    selectF(first, { quiet: true, fly: false });
    if (FPOS[first]) setD(FPOS[first].Ld);
  } else {
    S.sel = first;
    renderList();
    renderCard(BY_ID[first]);
    setD(POS[first].Ld);
  }
  resize();
})();
