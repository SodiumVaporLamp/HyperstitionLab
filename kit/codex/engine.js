/* Codex engine: AQ, the ternary zone code, word bodies, a sparse unbounded Life-like engine
   with Golly-style B0 emulation, and a fate classifier. Pure JS, no DOM; exposes CodexEngine. */
(function (root) {
  'use strict';

  /* ---------- AQ ----------
     Ccru glossary, "Alphanumeric Qabbala": a continuous decimal-alphabetic system, A = 10 ... Z = 35.
     Digits keep their face value. Accents are dropped first, as Numogram Lab does. */
  function glyphs(text) {
    const out = [];
    for (const ch of String(text == null ? '' : text).normalize('NFD')) {
      const c = ch.codePointAt(0);
      if (c >= 48 && c <= 57) out.push({ ch: ch, v: c - 48 });
      else if (c >= 65 && c <= 90) out.push({ ch: ch, v: c - 55 });
      else if (c >= 97 && c <= 122) out.push({ ch: ch.toUpperCase(), v: c - 87 });
    }
    return out;
  }
  function aq(text) {
    let t = 0;
    for (const g of glyphs(text)) t += g.v;
    return t;
  }

  /* ---------- the ternary zone code ----------
     Zone k = number of live cells in a cell's 3x3 block (itself and its eight neighbours), 0..9.
     Trit k of the code (little-endian base 3) says what zone k does: 0 void, 1 hold, 2 ignite. */
  const NCODES = 59049;
  function norm(code) {
    const c = Math.floor(Number(code) || 0) % NCODES;
    return c < 0 ? c + NCODES : c;
  }
  function trits(code) {
    let n = norm(code);
    const t = new Array(10);
    for (let k = 0; k < 10; k++) { t[k] = n % 3; n = (n - t[k]) / 3; }
    return t;
  }
  function fromTrits(t) {
    let c = 0;
    for (let k = 9; k >= 0; k--) c = c * 3 + t[k];
    return c;
  }
  // A dead cell with n live neighbours has block sum n; a live one has block sum n + 1.
  function decode(code) {
    const t = trits(code);
    let B = 0, S = 0;
    for (let n = 0; n <= 8; n++) {
      if (t[n] === 2) B |= 1 << n;
      if (t[n + 1] >= 1) S |= 1 << n;
    }
    return { code: norm(code), trits: t, B: B, S: S };
  }
  function bs(B, S) {
    let b = 'B', s = '/S';
    for (let n = 0; n <= 8; n++) {
      if ((B >> n) & 1) b += n;
      if ((S >> n) & 1) s += n;
    }
    return b + s;
  }
  // Codes with identical physics: zone 0 only ever sees dead cells (void = hold there),
  // zone 9 only ever sees live cells (hold = ignite there).
  function twins(code) {
    const t = trits(code);
    const z0 = t[0] === 2 ? [2] : [0, 1];
    const z9 = t[9] === 0 ? [0] : [1, 2];
    const out = [];
    for (const a of z0) for (const b of z9) {
      const u = t.slice();
      u[0] = a; u[9] = b;
      out.push(fromTrits(u));
    }
    return out.sort(function (a, b) { return a - b; });
  }
  // The code (if any) for a Life-like rule given as masks; null when a zone would need a "flip".
  function encode(B, S) {
    const t = new Array(10).fill(0);
    for (let s = 0; s <= 9; s++) {
      const dead = s <= 8 ? (B >> s) & 1 : 0;           // dead cell, block sum s, next state
      const live = s >= 1 ? (S >> (s - 1)) & 1 : 1;     // live cell, block sum s, next state
      if (s === 0) t[0] = dead ? 2 : 0;
      else if (s === 9) t[9] = live ? 1 : 0;
      else if (dead && live) t[s] = 2;
      else if (!dead && live) t[s] = 1;
      else if (!dead && !live) t[s] = 0;
      else return null;                                  // born when dead, dies when alive: a flip
    }
    return fromTrits(t);
  }

  /* ---------- the body ----------
     Each letter or digit becomes a horizontal bar of AQ(char) cells starting at x = -floor(L/2),
     one bar per row with one empty row between bars; a 0 digit leaves its row empty. */
  function body(text) {
    const cells = [];
    glyphs(text).forEach(function (g, i) {
      const L = g.v, x0 = -Math.floor(L / 2), y = 2 * i;
      for (let x = x0; x < x0 + L; x++) cells.push([x, y]);
    });
    return cells;
  }

  /* ---------- sparse engine ---------- */
  const OFF = 16384, SH = 15, LIM = 15900;
  function pack(x, y) { return ((x + OFF) << SH) | (y + OFF); }
  function ux(k) { return (k >> SH) - OFF; }
  function uy(k) { return (k & 32767) - OFF; }
  const ROW = 1 << SH;
  const D9 = [-ROW - 1, -ROW, -ROW + 1, -1, 0, 1, ROW - 1, ROW, ROW + 1];

  // Open-addressing table of block sums; bit 4 of a value marks a live cell.
  function Table() { this.alloc(12); }
  Table.prototype.alloc = function (bits) {
    this.bits = bits; this.cap = 1 << bits; this.mask = this.cap - 1; this.shift = 32 - bits;
    this.keys = new Int32Array(this.cap).fill(-1);
    this.vals = new Uint8Array(this.cap);
    this.used = new Int32Array(this.cap);
    this.n = 0;
  };
  Table.prototype.reset = function (expected) {
    let bits = this.bits;
    while ((1 << bits) < expected * 2) bits++;
    if (bits !== this.bits) { this.alloc(bits); return; }
    const keys = this.keys, vals = this.vals, used = this.used;
    for (let i = 0; i < this.n; i++) { keys[used[i]] = -1; vals[used[i]] = 0; }
    this.n = 0;
  };

  function stepList(live, Bm, Sm, T) {
    const n = live.length;
    T.reset(n * 9 + 16);
    const keys = T.keys, vals = T.vals, used = T.used, mask = T.mask, shift = T.shift;
    let cnt = 0;
    for (let j = 0; j < n; j++) {
      const k0 = live[j];
      for (let d = 0; d < 9; d++) {
        const k = k0 + D9[d];
        let i = Math.imul(k, -1640531535) >>> shift;
        for (;;) {
          const kk = keys[i];
          if (kk === k) break;
          if (kk === -1) { keys[i] = k; used[cnt++] = i; break; }
          i = (i + 1) & mask;
        }
        vals[i] += d === 4 ? 17 : 1;
      }
    }
    T.n = cnt;
    const out = new Int32Array(cnt);
    let m = 0, changed = 0;
    for (let u = 0; u < cnt; u++) {
      const i = used[u], v = vals[i], alive = v >> 4, nb = (v & 15) - alive;
      const nxt = alive ? (Sm >> nb) & 1 : (Bm >> nb) & 1;
      if (nxt) out[m++] = keys[i];
      if (nxt !== alive) changed++;
    }
    return { live: out.slice(0, m), changed: changed };
  }

  function bbox(live) {
    if (!live.length) return null;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let j = 0; j < live.length; j++) {
      const k = live[j], x = (k >> SH) - OFF, y = (k & 32767) - OFF;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    return { x0: x0, x1: x1, y0: y0, y1: y1 };
  }

  const comp = function (m) { return (~m) & 511; };
  const rev = function (m) { let r = 0; for (let n = 0; n <= 8; n++) if ((m >> n) & 1) r |= 1 << (8 - n); return r; };

  /* A universe stores the cells that differ from the background. Rules with B0 are emulated as
     Golly does: without S8 the background flips every generation, and the stored pattern is run by
     NOT(rule) on even generations and REVERSE(rule) on odd ones; with S8 the background lights once
     at generation 1 and stays lit. */
  function Universe(cellsXY, B, S) {
    this.B = B; this.S = S;
    this.mode = (B & 1) ? (((S >> 8) & 1) ? 'flipped' : 'alternating') : 'plain';
    if (this.mode === 'plain') this.rules = [[B, S]];
    else if (this.mode === 'alternating') this.rules = [[comp(B), comp(S)], [rev(S), rev(B)]];
    else this.rules = [[comp(B), comp(S)], [comp(rev(S)), comp(rev(B))]];
    const seen = new Set(), arr = [];
    for (const c of cellsXY) {
      const k = pack(c[0], c[1]);
      if (!seen.has(k)) { seen.add(k); arr.push(k); }
    }
    this.live = Int32Array.from(arr);
    this.gen = 0;
    this.changed = 0;
    this.T = new Table();
    this.box = bbox(this.live);
    this.outOfRange = false;
  }
  Universe.prototype.ruleIndex = function (g) {
    if (this.mode === 'plain') return 0;
    if (this.mode === 'alternating') return g & 1;
    return g === 0 ? 0 : 1;
  };
  Universe.prototype.background = function (g) {
    if (g === undefined) g = this.gen;
    if (this.mode === 'plain') return 0;
    if (this.mode === 'alternating') return g & 1;
    return g === 0 ? 0 : 1;
  };
  Universe.prototype.step = function () {
    if (this.outOfRange) return false;
    const r = this.rules[this.ruleIndex(this.gen)];
    const res = stepList(this.live, r[0], r[1], this.T);
    this.live = res.live;
    this.changed = res.changed;
    this.gen++;
    this.box = bbox(this.live);
    const b = this.box;
    if (b && (b.x0 < -LIM || b.x1 > LIM || b.y0 < -LIM || b.y1 > LIM)) this.outOfRange = true;
    return true;
  };
  Universe.prototype.cells = function () {
    const out = new Array(this.live.length);
    for (let j = 0; j < this.live.length; j++) out[j] = [ux(this.live[j]), uy(this.live[j])];
    return out;
  };

  /* ---------- fate classifier ---------- */
  function mix(v, seed) {
    let h = Math.imul(v ^ seed, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
  }
  function shapeKey(live, b) {
    let h1 = 0, h2 = 0;
    for (let j = 0; j < live.length; j++) {
      const k = live[j];
      const v = ((ux(k) - b.x0) << 15) | (uy(k) - b.y0);
      h1 = (h1 + mix(v, 0x2c1b3c6d)) >>> 0;
      h2 = (h2 + mix(v, 0x297a2d39)) >>> 0;
    }
    return h1 + ':' + h2 + ':' + live.length;
  }
  // Groups of cells within Chebyshev distance 2 of each other.
  function components(live) {
    const idx = new Map();
    for (let j = 0; j < live.length; j++) idx.set(live[j], j);
    const parent = new Int32Array(live.length);
    for (let j = 0; j < parent.length; j++) parent[j] = j;
    const find = function (a) { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
    for (let j = 0; j < live.length; j++) {
      const k = live[j];
      for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
        if (!dx && !dy) continue;
        const o = idx.get(k + dx * ROW + dy);
        if (o !== undefined) { const a = find(j), c = find(o); if (a !== c) parent[a] = c; }
      }
    }
    const groups = new Map();
    for (let j = 0; j < live.length; j++) {
      const r = find(j), x = ux(live[j]), y = uy(live[j]);
      let g = groups.get(r);
      if (!g) { g = { n: 0, x0: x, x1: x, y0: y, y1: y }; groups.set(r, g); }
      g.n++;
      if (x < g.x0) g.x0 = x; if (x > g.x1) g.x1 = x;
      if (y < g.y0) g.y0 = y; if (y > g.y1) g.y1 = y;
    }
    return Array.from(groups.values());
  }

  const DEFAULTS = { maxGen: 10000, popCap: 25000, window: 600, maxPeriod: 120, budgetMs: Infinity };

  function Analysis(cellsXY, B, S, opts) {
    this.opts = Object.assign({}, DEFAULTS, opts || {});
    this.u = new Universe(cellsXY, B, S);
    this.pops = [this.u.live.length];
    this.seen = new Map();
    this.snaps = [];
    this.result = null;
    this.spent = 0;
    this.examine();
  }
  Analysis.prototype.phase = function () { return this.u.background(); };
  Analysis.prototype.examine = function () {
    const u = this.u, g = u.gen, pop = u.live.length, o = this.opts;
    if (pop === 0) { this.result = { kind: 'dies', gen: g }; return; }
    if (pop > o.popCap) { this.result = { kind: 'explodes', gen: g, pop: pop }; return; }
    if (u.outOfRange) { this.result = { kind: 'unsettled', gen: g, pop: pop, why: 'range' }; return; }
    if (g % 100 === 0) {
      this.snaps.push([g, u.live]);
      if (this.snaps.length > 8) this.snaps.shift();
    }
    const key = shapeKey(u.live, u.box) + ':' + this.phase();
    const prev = this.seen.get(key);
    if (prev) {
      const p = g - prev[0], dx = u.box.x0 - prev[1], dy = u.box.y0 - prev[2];
      if (!dx && !dy) this.result = { kind: p === 1 ? 'still' : 'osc', from: prev[0], period: p, pop: pop };
      else this.result = { kind: 'ship', from: prev[0], period: p, dx: dx, dy: dy, pop: pop };
      return;
    }
    this.seen.set(key, [g, u.box.x0, u.box.y0]);
    if (g >= o.window + 100 && g % 50 === 0) {
      const per = this.popPeriod();
      if (per) {
        const esc = this.escapes();
        if (esc.count > 0) {
          let t = g - per;
          while (t >= 0 && this.pops[t] === this.pops[t + per]) t--;
          const T = t + 1;
          this.result = { kind: 'escapes', from: T, period: per, pop: this.pops[T], escapes: esc.count, sizes: esc.sizes };
          return;
        }
      }
    }
    if (g >= o.maxGen) this.result = { kind: 'unsettled', gen: g, pop: pop, why: 'horizon' };
  };
  Analysis.prototype.popPeriod = function () {
    const P = this.pops, g = P.length - 1, W = this.opts.window;
    for (let q = 1; q <= this.opts.maxPeriod; q++) {
      let ok = true;
      for (let t = g; t > g - W; t--) if (P[t] !== P[t - q]) { ok = false; break; }
      if (ok) return q;
    }
    return 0;
  };
  // Objects whose neighbourhood was empty 200+ generations ago are moving: escaping ships.
  Analysis.prototype.escapes = function () {
    const g = this.u.gen;
    let snap = null;
    for (let i = this.snaps.length - 1; i >= 0; i--) if (g - this.snaps[i][0] >= 200) { snap = this.snaps[i]; break; }
    if (!snap) return { count: 0, sizes: [] };
    const old = new Set(snap[1]);
    const sizes = [];
    for (const c of components(this.u.live)) {
      let hit = false;
      for (let x = c.x0 - 2; x <= c.x1 + 2 && !hit; x++)
        for (let y = c.y0 - 2; y <= c.y1 + 2; y++) if (old.has(pack(x, y))) { hit = true; break; }
      if (!hit) sizes.push(c.n);
    }
    return { count: sizes.length, sizes: sizes.sort(function (a, b) { return a - b; }) };
  };
  Analysis.prototype.run = function (budgetMs) {
    const clock = (typeof performance !== 'undefined' && performance.now) ? function () { return performance.now(); } : Date.now;
    const t0 = clock();
    while (!this.result) {
      this.u.step();
      this.pops.push(this.u.live.length);
      this.examine();
      if (this.u.gen % 16 === 0) {
        const el = clock() - t0;
        if (el > budgetMs) { this.spent += el; break; }
      }
    }
    if (this.result) this.spent += clock() - t0;
    if (!this.result && this.spent > this.opts.budgetMs)
      this.result = { kind: 'unsettled', gen: this.u.gen, pop: this.u.live.length, why: 'time' };
    return !!this.result;
  };

  root.CodexEngine = {
    glyphs: glyphs, aq: aq, NCODES: NCODES, norm: norm, trits: trits, fromTrits: fromTrits,
    decode: decode, encode: encode, bs: bs, twins: twins, body: body,
    Universe: Universe, Analysis: Analysis, components: components, pack: pack, ux: ux, uy: uy
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
