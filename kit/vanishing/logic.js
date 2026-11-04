/* ================= Vanishing Point: time and geometry ================= */

const YEAR_MS = 365.2425 * 86400000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function decYearFromMs(ms) {
  const d = new Date(ms), y = d.getUTCFullYear();
  const t0 = Date.UTC(y, 0, 1), t1 = Date.UTC(y + 1, 0, 1);
  return y + (ms - t0) / (t1 - t0);
}
/* '1936-05-28' | '1936-05' | '1936' | '~1305' | '-3300' */
function parseD(d) {
  const circa = d[0] === '~';
  const m = /^(-?\d+)(?:-(\d\d))?(?:-(\d\d))?$/.exec(circa ? d.slice(1) : d);
  if (!m) throw new Error('bad date ' + d);
  const Y = +m[1], M = m[2] ? +m[2] : 0, D = m[3] ? +m[3] : 0;
  let y;
  if (!M) y = Y + 0.5;
  else if (!D) y = Y + (M - 0.5) / 12;
  else y = decYearFromMs(Date.UTC(Y, M - 1, D, 12));
  return { y, Y, M, D, circa };
}
function yearLabel(Y, circa) {
  const s = Y < 0 ? (-Y) + ' BCE' : String(Y);
  return (circa ? 'c. ' : '') + s;
}
function fmtDate(e) {
  if (e.dl) return e.dl;
  const p = e._p;
  if (p.D) return p.D + ' ' + MONTHS_LONG[p.M - 1] + ' ' + p.Y;
  if (p.M) return MONTHS_LONG[p.M - 1] + ' ' + p.Y;
  return yearLabel(p.Y, p.circa);
}
function kLabelFor(Y) {
  if (Y < 1900) return null;
  const k = Y - 1900;
  return 'K-' + (k < 100 ? String(k).padStart(2, '0') : String(k));
}

/* ---------- vanishing points ---------- */
const VPS = {
  now: { name: 'Now', when: '', ms: null },
  k2045: { name: '2045', when: '1 January 2045', ms: Date.UTC(2045, 0, 1) }
};
function vpYear(key, nowMs) {
  const v = VPS[key];
  return decYearFromMs(v.ms == null ? nowMs : v.ms);
}

/* ---------- log time ---------- */
const MIN_TAU = 1 / 365.2425;            // one day
function logTau(T, y) { return Math.log10(Math.max(T - y, MIN_TAU)); }

/* Spread events that share a lane so no two sit closer than `gap` decades of log time.
   Isotonic regression (pool adjacent violators) on p_i - i*gap gives the least-squares
   placement that keeps the order and the minimum gap. Angles on the spiral are proportional
   to log time, so the spacing holds at every zoom. */
function spreadLane(ps, gap) {
  const n = ps.length, q = ps.map((p, i) => p - i * gap);
  const blocks = [];
  for (let i = 0; i < n; i++) {
    blocks.push({ s: i, e: i, sum: q[i], n: 1 });
    while (blocks.length > 1) {
      const b = blocks[blocks.length - 1], a = blocks[blocks.length - 2];
      if (a.sum / a.n <= b.sum / b.n) break;
      a.e = b.e; a.sum += b.sum; a.n += b.n; blocks.pop();
    }
  }
  const out = new Array(n);
  for (const b of blocks) { const m = b.sum / b.n; for (let i = b.s; i <= b.e; i++) out[i] = m + i * gap; }
  return out;
}
function layoutEvents(events, threads, T, gap) {
  const pos = {};
  const byLane = {};
  for (const e of events) {
    const L = logTau(T, e._p.y);
    pos[e.id] = { L, Ld: L, lane: threads[e.th].lane };
    (byLane[e.th] = byLane[e.th] || []).push(e.id);
  }
  for (const th in byLane) {
    const ids = byLane[th].sort((a, b) => pos[a].L - pos[b].L);
    const g = typeof gap === 'number' ? gap : (gap[th] != null ? gap[th] : gap.default);
    const placed = spreadLane(ids.map(id => pos[id].L), g);
    ids.forEach((id, i) => { pos[id].Ld = placed[i]; });
  }
  return pos;
}

/* ---------- formatting distances ---------- */
function fmtTau(tau) {
  if (tau >= 2) return Math.round(tau).toLocaleString('en-US') + ' years';
  const days = tau * 365.2425;
  if (days >= 60) return Math.round(days / 30.44) + ' months';
  if (days >= 1.5) return Math.round(days) + ' days';
  return 'less than a day';
}
/* the date at a given log distance from the centre, formatted for its scale;
   sign -1 counts back from T (the history views), +1 counts forward (looking ahead) */
function fmtAt(T, L, sign) {
  const tau = Math.pow(10, L), y = T + (sign || -1) * tau;
  if (tau > 1200) { const r = Math.round(y / 100) * 100; return r <= 0 ? 'c. ' + (1 - r) + ' BCE' : 'c. ' + r; }
  if (tau > 4) return y < 0 ? Math.round(-y + 1) + ' BCE' : String(Math.floor(y));
  const ms = Date.UTC(1970, 0, 1) + (y - 1970) * YEAR_MS;
  const d = new Date(ms);
  if (tau > 0.35) return MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
}

/* ---------- forecasts ----------
   A date names a period: a day, a month or a year. A forecast's ring sits at the middle of a
   point date ('at'), and at the end of the period for a deadline, a bet, a window's end or a
   spread's 50% year ('by 2028' means by the end of 2028). */
const FLOOR = Math.log10(MIN_TAU);       // log time stops at one day either side of today
function startMs(d) { const p = parseD(d); return Date.UTC(p.Y, p.M ? p.M - 1 : 0, p.D || 1); }
function endMs(d) {
  const p = parseD(d);
  if (p.D) return Date.UTC(p.Y, p.M - 1, p.D + 1);
  if (p.M) return Date.UTC(p.Y, p.M, 1);
  return Date.UTC(p.Y + 1, 0, 1);
}
/* the times a forecast names, in decimal years: made; a..b, the span it covers (a deadline runs from
   the day it was said); ring, where its mark sits; p10 for spreads; closes, in ms (null: never) */
function fcTimes(f) {
  const made = parseD(f.made).y, yr = decYearFromMs;
  let a, b, ring, p10 = null, closes = null;
  if (f.type === 'date') { ring = parseD(f.at).y; a = b = ring; closes = endMs(f.at); }
  else if (f.type === 'deadline' || f.type === 'bet') { ring = yr(endMs(f.due)); a = made; b = ring; closes = endMs(f.due); }
  else if (f.type === 'window') { a = yr(startMs(f.from)); b = yr(endMs(f.to)); ring = b; closes = endMs(f.to); }
  else if (f.type === 'spread') { ring = yr(endMs(f.p50)); p10 = f.p10 ? yr(endMs(f.p10)) : null; a = p10 == null ? ring : p10; b = ring; }
  else throw new Error('unknown forecast type ' + f.type);
  return { made, a, b, ring, p10, closes };
}
/* open | closed (its time has passed with no verdict recorded) | the recorded outcome */
function fcStatus(f, nowMs) {
  const o = f.outcome;
  if (o && (!o.after || nowMs >= startMs(o.after))) return o.is;
  const t = fcTimes(f);
  return t.closes != null && nowMs >= t.closes ? 'closed' : 'open';
}
/* horizon in years from the day it was said: [nearest, furthest] of what it names */
function fcHorizon(f) {
  const t = fcTimes(f);
  if (f.type === 'window') return [t.a - t.made, t.b - t.made];
  if (f.type === 'spread') return [t.p10 == null ? t.ring - t.made : t.p10 - t.made, t.ring - t.made];
  return [t.ring - t.made, t.ring - t.made];
}

if (typeof module !== 'undefined') module.exports = {
  parseD, fmtDate, kLabelFor, VPS, vpYear, logTau, spreadLane, layoutEvents, fmtTau, fmtAt, decYearFromMs,
  MIN_TAU, FLOOR, startMs, endMs, fcTimes, fcStatus, fcHorizon
};
