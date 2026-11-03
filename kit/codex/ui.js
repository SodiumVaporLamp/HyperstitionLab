(function () {
  'use strict';
  const E = window.CodexEngine;
  const LIFE_B = 1 << 3, LIFE_S = (1 << 2) | (1 << 3);
  const POP_CAP = 25000;
  const OPTS = { maxGen: 10000, popCap: POP_CAP, budgetMs: 15000 };
  const PRESETS = ['CONWAY', 'HYPERSTITION', 'GLIDER', 'TIME', 'DEATH', 'MURRUMUR', 'NUMOGRAM', 'CCRU'];
  const $ = function (id) { return document.getElementById(id); };
  const fmt = function (n) { return Number(n).toLocaleString('en-US'); };
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function region(z) { return (z === 3 || z === 6) ? 'warp' : ((z === 0 || z === 9) ? 'plex' : 'tc'); }
  const ACT = ['void', 'hold', 'ignite'];
  function nums(mask) { const a = []; for (let n = 0; n <= 8; n++) if ((mask >> n) & 1) a.push(n); return a; }
  function list(a) { return a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]; }
  function plain(B, S) {
    const b = nums(B), s = nums(S);
    const born = b.length ? 'An empty cell is born with ' + list(b) + ' live neighbour' + (b.length === 1 && b[0] === 1 ? '' : 's') : 'Nothing is ever born';
    const surv = s.length ? 'a live cell survives with ' + list(s) : 'every live cell dies';
    return born + '; ' + surv + '.';
  }
  function notesFor(aqv, d) {
    const out = [];
    const tw = E.twins(d.code).filter(function (c) { return c !== d.code; });
    if (d.B === LIFE_B && d.S === LIFE_S) out.push('This is Conway’s Life, so both dishes run the same law.');
    if (tw.length) out.push(tw.join(' and ') + (tw.length === 1 ? ' runs' : ' run') + ' the same physics (see Twins below).');
    if (d.B & 1) {
      out.push(((d.S >> 8) & 1 ? 'Zone 0 ignites and zone 9 holds, so empty space lights at generation 1 and stays lit.'
        : 'Zone 0 ignites, so every empty cell with no live neighbours is born and the whole background flips each generation.') +
        ' The dish shows only the cells that differ from the background.');
    } else if (d.B & 2) {
      out.push('Zone 1 ignites, so any empty cell touching exactly one live cell is born. Nothing here can stop growing: its outermost corners advance a cell every generation.');
    }
    if (!d.B) out.push('No zone ignites, so nothing is ever born and this universe can only lose cells.');
    if (d.code !== aqv) out.push('The total wraps: ' + fmt(aqv) + ' mod 59,049 = ' + fmt(d.code) + '.');
    return out;
  }
  function fateText(r, opts) {
    if (!r) return 'Working out its fate…';
    const g = function (n) { return 'generation ' + fmt(n); };
    switch (r.kind) {
      case 'dies':
        return r.gen === 0 ? 'Nothing to run.' : (opts.b0 ? 'Dissolves into the background at ' + g(r.gen) + '.' : 'Dies out at ' + g(r.gen) + '.');
      case 'still':
        return r.from === 0 ? 'Never changes: the body is already a still life.' : 'Freezes into a still life of ' + fmt(r.pop) + ' cells at ' + g(r.from) + '.';
      case 'osc':
        return 'Settles at ' + g(r.from) + ' into a cycle that repeats every ' + r.period + ' generations.';
      case 'ship':
        return (opts.life && r.pop === 5 && r.period === 4) ? 'Becomes a single glider at ' + g(r.from) + '.'
          : 'Becomes a single traveller at ' + g(r.from) + ', repeating every ' + r.period + ' generations as it moves.';
      case 'escapes': {
        const gl = opts.life && r.sizes.every(function (s) { return s === 5; });
        const noun = gl ? (r.escapes === 1 ? 'glider' : 'gliders') : (r.escapes === 1 ? 'moving object' : 'moving objects');
        return 'Throws off ' + r.escapes + ' ' + noun + ' and settles by ' + g(r.from) + ', with ' + fmt(r.pop) + ' cells counting ' + (r.escapes === 1 ? 'it' : 'them') + '.';
      }
      case 'explodes':
        return 'Explodes, passing ' + fmt(POP_CAP) + ' cells at ' + g(r.gen) + '.';
      default:
        return r.why === 'range' ? 'Outgrows the simulated plane at ' + g(r.gen) + '.' : 'Still changing after ' + fmt(r.gen) + ' generations.';
    }
  }

  /* ---------- colors from the theme tokens ---------- */
  let colors = { bg: '#E9ECEB', ink: '#15181A', rule: '#C6CDCE' };
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    colors = { bg: cs.getPropertyValue('--bg').trim() || colors.bg, ink: cs.getPropertyValue('--ink').trim() || colors.ink, rule: cs.getPropertyValue('--rule').trim() || colors.rule };
    dishes.forEach(function (d) { d.dirty = true; });
  }

  /* ---------- the core of a pattern, ignoring objects that have flown off ---------- */
  function coreBounds(live) {
    const n = live.length;
    if (!n) return null;
    if (n > 6000) {
      const b = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
      for (let j = 0; j < n; j++) { const k = live[j], x = (k >> 15) - 16384, y = (k & 32767) - 16384; if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x; if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y; }
      return b;
    }
    const buckets = new Map();
    for (let j = 0; j < n; j++) {
      const k = live[j], x = (k >> 15) - 16384, y = (k & 32767) - 16384, bx = x >> 3, by = y >> 3;
      const key = (bx + 4096) * 8192 + (by + 4096);
      let b = buckets.get(key);
      if (!b) { b = { bx: bx, by: by, n: 0, x0: x, x1: x, y0: y, y1: y }; buckets.set(key, b); }
      b.n++;
      if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x; if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y;
    }
    const arr = Array.from(buckets.values());
    const index = new Map();
    arr.forEach(function (b, i) { index.set((b.bx + 4096) * 8192 + (b.by + 4096), i); });
    const parent = arr.map(function (_, i) { return i; });
    const find = function (a) { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
    arr.forEach(function (b, i) {
      for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
        const o = index.get((b.bx + dx + 4096) * 8192 + (b.by + dy + 4096));
        if (o !== undefined) { const p = find(i), q = find(o); if (p !== q) parent[p] = q; }
      }
    });
    const groups = new Map();
    arr.forEach(function (b, i) {
      const r = find(i);
      let gr = groups.get(r);
      if (!gr) { gr = { n: 0, x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1 }; groups.set(r, gr); }
      gr.n += b.n;
      gr.x0 = Math.min(gr.x0, b.x0); gr.x1 = Math.max(gr.x1, b.x1); gr.y0 = Math.min(gr.y0, b.y0); gr.y1 = Math.max(gr.y1, b.y1);
    });
    let best = null;
    groups.forEach(function (gr) { if (!best || gr.n > best.n) best = gr; });
    return best;
  }
  function fit(b, margin, aspect) {
    let w = b.x1 - b.x0 + 1 + 2 * margin, h = b.y1 - b.y0 + 1 + 2 * margin;
    const cx = (b.x0 + b.x1 + 1) / 2, cy = (b.y0 + b.y1 + 1) / 2;
    if (w / h < aspect) w = h * aspect; else h = w / aspect;
    return { x: cx - w / 2, y: cy - h / 2, w: w, h: h };
  }
  function union(a, b, aspect) {
    const x0 = Math.min(a.x, b.x), y0 = Math.min(a.y, b.y), x1 = Math.max(a.x + a.w, b.x + b.w), y1 = Math.max(a.y + a.h, b.y + b.h);
    let w = x1 - x0, h = y1 - y0;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    if (w / h < aspect) w = h * aspect; else h = w / aspect;
    return { x: cx - w / 2, y: cy - h / 2, w: w, h: h };
  }

  /* ---------- a dish ---------- */
  const ASPECT = 4 / 3;
  function Dish(id) {
    this.cv = $('cv-' + id);
    this.ctx = this.cv.getContext('2d');
    this.countEl = $(id + '-count');
    this.fateEl = $(id + '-fate');
    this.u = null; this.view = null; this.target = null;
    this.dirty = true; this.frozen = false; this.b0 = false; this.life = id === 'life';
    this.W = 0; this.H = 0; this.cs = 1;
    const self = this;
    if (window.ResizeObserver) new ResizeObserver(function () { self.resize(); }).observe(this.cv);
    this.resize();
  }
  Dish.prototype.resize = function () {
    const r = this.cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 3);
    const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.width / ASPECT));
    if (W === this.W && H === this.H) return;
    this.W = W; this.H = H;
    this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.dirty = true;
  };
  Dish.prototype.load = function (cells, B, S) {
    this.u = new E.Universe(cells, B, S);
    this.b0 = !!(B & 1);
    this.frozen = false;
    const b = this.u.box || { x0: -8, x1: 8, y0: -6, y1: 6 };
    const margin = Math.max(6, Math.round(0.3 * Math.max(b.x1 - b.x0 + 1, b.y1 - b.y0 + 1)));
    this.base = fit(b, margin, ASPECT);
    this.target = this.base;
    this.view = Object.assign({}, this.base);
    this.dirty = true;
    this.updateCount();
  };
  Dish.prototype.step = function () {
    if (!this.u || this.frozen) return 0;
    this.u.step();
    if (this.u.live.length > POP_CAP || this.u.outOfRange) this.frozen = true;
    if (this.u.gen % 4 === 0 || this.u.live.length > 2000) {
      const c = coreBounds(this.u.live);
      if (c) this.target = union(this.target, fit(c, 4, ASPECT), ASPECT);
    }
    this.dirty = true;
    this.updateCount();
    return this.u.changed * this.cs * this.cs;
  };
  Dish.prototype.updateCount = function () {
    if (!this.u) { this.countEl.textContent = ''; return; }
    const pop = this.u.live.length;
    let s = 'gen ' + fmt(this.u.gen) + ' · ' + fmt(pop) + (pop === 1 ? ' cell' : ' cells');
    if (this.b0) s += ' off the background';
    if (this.frozen) s += this.u.outOfRange ? ' · stopped at the edge' : ' · stopped at ' + fmt(POP_CAP) + ' cells';
    this.countEl.textContent = s;
  };
  Dish.prototype.ease = function () {
    if (!this.view) return;
    const v = this.view, t = this.target;
    let moved = false;
    ['x', 'y', 'w', 'h'].forEach(function (k) {
      const d = t[k] - v[k];
      if (Math.abs(d) > 0.02) { v[k] += d * (reduceMotion ? 1 : 0.18); moved = true; } else v[k] = t[k];
    });
    if (moved) this.dirty = true;
  };
  Dish.prototype.draw = function () {
    if (!this.dirty) return;
    this.dirty = false;
    const ctx = this.ctx, W = this.W, H = this.H;
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, W, H);
    if (!this.u) return;
    const v = this.view, cs = Math.min(W / v.w, H / v.h);
    this.cs = cs;
    const ox = (W - v.w * cs) / 2 - v.x * cs, oy = (H - v.h * cs) / 2 - v.y * cs;
    if (cs >= 9) {
      ctx.strokeStyle = colors.rule;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const gx0 = Math.floor(v.x), gx1 = Math.ceil(v.x + v.w), gy0 = Math.floor(v.y), gy1 = Math.ceil(v.y + v.h);
      for (let x = gx0; x <= gx1; x++) { const px = Math.round(ox + x * cs) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
      for (let y = gy0; y <= gy1; y++) { const py = Math.round(oy + y * cs) + 0.5; ctx.moveTo(0, py); ctx.lineTo(W, py); }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = colors.ink;
    const inset = cs >= 5 ? Math.min(1.5, cs * 0.14) : 0, sz = Math.max(cs - inset, 1);
    ctx.beginPath();
    const live = this.u.live;
    for (let j = 0; j < live.length; j++) {
      const k = live[j], x = (k >> 15) - 16384, y = (k & 32767) - 16384;
      ctx.rect(ox + x * cs + inset / 2, oy + y * cs + inset / 2, sz, sz);
    }
    ctx.fill();
  };

  const dishes = [new Dish('own'), new Dish('life')];
  const own = dishes[0], life = dishes[1];

  /* ---------- fates, worked out off the main thread ---------- */
  const ENGINE_SRC = $('codex-engine').textContent;
  let workerURL = null;
  try {
    workerURL = URL.createObjectURL(new Blob([ENGINE_SRC, '\n;self.onmessage=function(e){var d=e.data,a=new self.CodexEngine.Analysis(d.cells,d.B,d.S,d.opts);while(!a.run(250)){}self.postMessage({token:d.token,result:a.result});};'], { type: 'text/javascript' }));
  } catch (err) { workerURL = null; }
  let jobs = [];
  let token = 0;
  function cancelJobs() { jobs.forEach(function (j) { j.cancelled = true; if (j.worker) j.worker.terminate(); }); jobs = []; }
  function analyse(cells, B, S, done) {
    const job = { cancelled: false, worker: null };
    const t = ++token;
    jobs.push(job);
    const here = function () {
      const a = new E.Analysis(cells, B, S, OPTS);
      (function tick() {
        if (job.cancelled) return;
        if (a.run(8)) done(a.result); else setTimeout(tick, 0);
      })();
    };
    if (workerURL) {
      try {
        const w = new Worker(workerURL);
        job.worker = w;
        w.onmessage = function (e) { if (!job.cancelled && e.data.token === t) { done(e.data.result); w.terminate(); } };
        w.onerror = function (e) { e.preventDefault(); w.terminate(); job.worker = null; if (!job.cancelled) here(); };
        w.postMessage({ token: t, cells: cells, B: B, S: S, opts: OPTS });
        return;
      } catch (err) { job.worker = null; }
    }
    here();
  }

  /* ---------- the word ---------- */
  const zonesEl = $('zones');
  const ORDER = [0, 1, 2, 3, 4, 9, 8, 7, 6, 5];
  ORDER.forEach(function (z) {
    const el = document.createElement('div');
    el.className = 'z ' + region(z);
    el.innerHTML = '<span class="zn"><i class="dot" aria-hidden="true"></i>' + z + '</span><span class="za"></span>';
    el.dataset.zone = String(z);
    zonesEl.appendChild(el);
  });
  const presetsEl = $('presets');
  PRESETS.forEach(function (w) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = w; b.dataset.word = w;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { $('word').value = w; setWord(w); });
    presetsEl.appendChild(b);
  });

  let current = null;
  function setWord(text) {
    const glyphs = E.glyphs(text);
    const key = glyphs.map(function (g) { return g.ch; }).join('');
    presetsEl.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.word === key)); });
    if (current && current.key === key) return;
    cancelJobs();
    const aqv = E.aq(text);
    const d = E.decode(aqv);
    current = { key: key, aqv: aqv, d: d };
    try { localStorage.setItem('codex-word', text); } catch (err) { /* storage unavailable */ }

    const sumEl = $('sum');
    if (!glyphs.length) {
      sumEl.textContent = 'Type a word with at least one letter or digit.';
      $('readout').innerHTML = '<span>AQ 0</span>';
    } else {
      sumEl.innerHTML = glyphs.map(function (g) { return g.ch + '&nbsp;' + g.v; }).join(' + ') + ' = <b>' + fmt(aqv) + '</b>';
    }
    const isLife = d.B === LIFE_B && d.S === LIFE_S;
    const bsr = E.bs(d.B, d.S);
    if (glyphs.length) $('readout').innerHTML = '<span>AQ ' + fmt(aqv) + '</span><span>' + bsr + '</span>' + (isLife ? '<span class="on">Conway’s Life</span>' : '');
    $('trits').textContent = 'base 3, zone 0 first: ' + d.trits.join('');
    zonesEl.querySelectorAll('.z').forEach(function (el) {
      const z = +el.dataset.zone, a = ACT[d.trits[z]];
      el.classList.remove('void', 'hold', 'ignite');
      el.classList.add(a);
      el.querySelector('.za').textContent = a;
    });
    zonesEl.setAttribute('aria-label', 'Zone table: ' + ORDER.slice().sort().map(function (z) { return 'zone ' + z + ' ' + ACT[d.trits[z]]; }).join(', '));
    $('bsr').textContent = bsr;
    $('plain').textContent = plain(d.B, d.S);
    $('notes').innerHTML = '';
    notesFor(aqv, d).forEach(function (t) { const li = document.createElement('li'); li.textContent = t; $('notes').appendChild(li); });
    $('own-law').textContent = bsr + (isLife ? ' · same as Conway’s' : '');

    const cells = E.body(text);
    own.load(cells, d.B, d.S);
    life.load(cells, LIFE_B, LIFE_S);
    current.cells = cells;
    [own, life].forEach(function (dish) { dish.fateEl.textContent = glyphs.length ? fateText(null) : ''; dish.fateEl.classList.add('pending'); });
    if (!glyphs.length) return;
    const show = function (dish, r) {
      dish.fateEl.textContent = fateText(r, { life: dish.life || isLife, b0: dish.b0 });
      dish.fateEl.classList.remove('pending');
      dish.cv.setAttribute('aria-label', (dish.life ? 'Under Conway’s law: ' : 'Under its own law: ') + dish.fateEl.textContent);
    };
    if (isLife) analyse(cells, d.B, d.S, function (r) { show(own, r); show(life, r); });
    else {
      analyse(cells, d.B, d.S, function (r) { show(own, r); });
      analyse(cells, LIFE_B, LIFE_S, function (r) { show(life, r); });
    }
  }

  /* ---------- playback ---------- */
  let playing = !reduceMotion, speed = 10, nextAt = 0, holdUntil = 0, lastFlash = -1e9;
  const playBtn = $('play');
  function setPlaying(p) { playing = p; playBtn.textContent = p ? 'Pause' : 'Play'; }
  setPlaying(playing);
  playBtn.addEventListener('click', function () { setPlaying(!playing); });
  $('step').addEventListener('click', function () { setPlaying(false); stepAll(performance.now()); });
  $('restart').addEventListener('click', function () {
    if (!current || !current.cells) return;
    own.load(current.cells, current.d.B, current.d.S);
    life.load(current.cells, LIFE_B, LIFE_S);
  });
  document.querySelectorAll('[data-speed]').forEach(function (b) {
    b.addEventListener('click', function () {
      speed = +b.dataset.speed;
      document.querySelectorAll('[data-speed]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
    });
  });
  function stepAll(now) {
    let flashy = false;
    dishes.forEach(function (dish) {
      const area = dish.step(), safe = Math.min(21824, 0.25 * dish.W * dish.H);
      if (area > safe) flashy = true;
    });
    if (flashy) { holdUntil = now + 340; lastFlash = now; }
    if (own.frozen && life.frozen) setPlaying(false);
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (playing && now >= nextAt && now >= holdUntil) {
      stepAll(now);
      nextAt = now + 1000 / speed;
    }
    $('flash-note').hidden = now - lastFlash > 2000;
    dishes.forEach(function (d) { d.ease(); d.draw(); });
  }

  /* ---------- start ---------- */
  readColors();
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', readColors);
  }
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
  let timer = 0;
  $('word').addEventListener('input', function (e) { clearTimeout(timer); const v = e.target.value; timer = setTimeout(function () { setWord(v); }, 250); });
  let first = 'CONWAY';
  const h = (location.hash || '').slice(1);
  if (/^[A-Za-z0-9]{1,40}$/.test(h)) first = h.toUpperCase();
  else { try { const s = localStorage.getItem('codex-word'); if (s && E.glyphs(s).length) first = s; } catch (err) { /* storage unavailable */ } }
  $('word').value = first;
  setWord(first);
  requestAnimationFrame(frame);
})();
