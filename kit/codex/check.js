/* Checks for Codex: node codex/check.js [page or engine file]
   Runs the engine exactly as shipped: by default the <script id="codex-engine"> inside out/codex.html
   (run python3 build.py first), or codex/engine.js if there is no build. Every pass line was fixed
   before the engine was written:
   1. LifeWiki's benchmarks: R-pentomino 116 cells at generation 1103 with 6 gliders, acorn 633 at 5206
      with 13, die hard gone at 130; a row of 10 is the period-15 pentadecathlon; a glider is a ship.
   2. The zone code against codex/reference.json (written by codex/reference.py, in Python): every
      code's B/S pair, Conway's Life at 135 and 136, 26,244 distinct physics, no code for HighLife,
      Seeds or Day & Night, and the stepper itself on all 512 blocks for a sample of codes.
   3. AQ against Numogram Lab's own values() (numolab/logic.js) and the Python reference.
   4. Populations against codex/lifelib_pops.json (lifelib, an independent engine) at every
      generation through 500 for 20 words, under their own law and under Conway's.
   test.py runs this; it exits 1 on any failure. */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const rd = f => fs.readFileSync(path.isAbsolute(f) ? f : path.join(ROOT, f), 'utf8');

const built = path.join(ROOT, 'out', 'codex.html');
const target = process.argv[2] || (fs.existsSync(built) ? built : path.join(ROOT, 'codex', 'engine.js'));
const src = rd(target);
const m = src.match(/<script id="codex-engine">([\s\S]*?)<\/script>/);
// Evaluated in the main context: a vm sandbox's global lookups slow the typed-array engine about 17 times.
vm.runInThisContext(m ? m[1] : src);
const E = globalThis.CodexEngine;
if (!E) { console.log('codex/check.js: no CodexEngine in ' + path.relative(ROOT, target)); process.exit(1); }

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok });
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? '  — ' + detail : ''));
}
function parseRLE(rle) {
  const cells = [];
  let x = 0, y = 0, num = '';
  for (const ch of rle) {
    if (ch >= '0' && ch <= '9') { num += ch; continue; }
    const n = num ? parseInt(num, 10) : 1;
    num = '';
    if (ch === 'b') x += n;
    else if (ch === 'o') { for (let i = 0; i < n; i++) cells.push([x + i, y]); x += n; }
    else if (ch === '$') { y += n; x = 0; }
    else if (ch === '!') break;
  }
  return cells;
}
const LIFE_B = 1 << 3, LIFE_S = (1 << 2) | (1 << 3);
const fate = cells => { const a = new E.Analysis(cells, LIFE_B, LIFE_S); a.run(Infinity); return a.result; };
const t0 = Date.now();

/* ---------- 1. LifeWiki ---------- */
const r = fate(parseRLE('b2o$2o$bo!'));
check('R-pentomino settles at generation 1103 with 116 cells and 6 gliders (LifeWiki)',
  r.kind === 'escapes' && r.from === 1103 && r.pop === 116 && r.escapes === 6 && r.sizes.every(s => s === 5), JSON.stringify(r));
const a = fate(parseRLE('bo5b$3bo3b$2o2b3o!'));
check('Acorn settles at generation 5206 with 633 cells and 13 gliders (LifeWiki)',
  a.kind === 'escapes' && a.from === 5206 && a.pop === 633 && a.escapes === 13 && a.sizes.every(s => s === 5), JSON.stringify(a));
const d = fate(parseRLE('6bo$2o$bo3b3o!'));
check('Die hard vanishes at generation 130 (LifeWiki)', d.kind === 'dies' && d.gen === 130, JSON.stringify(d));
const row = []; for (let i = 0; i < 10; i++) row.push([i, 0]);
const p = fate(row);
check('A row of 10 becomes the period-15 pentadecathlon', p.kind === 'osc' && p.period === 15, JSON.stringify(p));
const g = fate(parseRLE('bo$2bo$3o!'));
check('A glider is a period-4 ship moving one cell diagonally', g.kind === 'ship' && g.period === 4 && Math.abs(g.dx) === 1 && Math.abs(g.dy) === 1, JSON.stringify(g));

/* ---------- 2. the zone code ---------- */
const ref = JSON.parse(rd('codex/reference.json'));
const keys = [];
for (let c = 0; c < E.NCODES; c++) { const k = E.decode(c); keys.push(k.B + k.S * 512); }
const sha = crypto.createHash('sha256').update(keys.join(',')).digest('hex');
check('the decoder matches the Python reference on all 59,049 codes', ref.decoder_ok && sha === ref.keys_sha256, sha.slice(0, 12));
const life = keys.map((k, c) => k === LIFE_B + LIFE_S * 512 ? c : -1).filter(c => c >= 0);
check('Conway’s Life is 135 and 136, and nothing else', JSON.stringify(life) === '[135,136]' && JSON.stringify(ref.life_codes) === '[135,136]', JSON.stringify(life));
check('26,244 distinct physics', new Set(keys).size === 26244 && ref.distinct === 26244, String(new Set(keys).size));
let rt = 0;
for (let c = 0; c < E.NCODES; c++) { const k = E.decode(c), e = E.encode(k.B, k.S); if (e === null || E.twins(c).indexOf(e) < 0) rt++; }
check('every code’s twins share its physics, and encode() inverts decode()', rt === 0, rt + ' failures');
const noCode = E.encode(1 << 3 | 1 << 6, LIFE_S) === null && E.encode(1 << 2, 0) === null &&
  E.encode(1 << 3 | 1 << 6 | 1 << 7 | 1 << 8, 1 << 3 | 1 << 4 | 1 << 6 | 1 << 7 | 1 << 8) === null;
check('HighLife, Seeds and Day & Night have no code', noCode && !ref.reachable['HighLife B36/S23'] && !ref.reachable['Seeds B2/S']);
check('read the other way round, Conway’s Life is 1701', parseInt(E.trits(135).slice().join(''), 3) === 1701);
let semBad = 0;
for (let c = 0; c < E.NCODES; c += 97) {
  const k = E.decode(c);
  if (k.B & 1) continue;   // B0 needs the emulation; the lifelib runs cover it
  for (let nb = 0; nb < 512; nb++) {
    const cells = [];
    for (let i = 0; i < 9; i++) if ((nb >> i) & 1) cells.push([(i % 3) - 1, Math.floor(i / 3) - 1]);
    const u = new E.Universe(cells, k.B, k.S);
    u.step();
    const alive = Array.prototype.indexOf.call(u.live, E.pack(0, 0)) >= 0 ? 1 : 0;
    const act = k.trits[cells.length], c0 = (nb >> 4) & 1;
    if (alive !== (act === 0 ? 0 : act === 1 ? c0 : 1)) semBad++;
  }
}
check('the stepper obeys void, hold and ignite on all 512 blocks (every 97th code without B0)', semBad === 0, semBad + ' mismatches');

/* ---------- 3. AQ ---------- */
const lab = {};
vm.createContext(lab);
vm.runInContext(rd('numolab/lexicon.js') + '\n' + rd('numolab/logic.js') + '\nthis.values = values;', lab);
const bad = [];
for (const [w, v] of Object.entries(ref.aq_test_words)) {
  if (E.aq(w) !== v || lab.values(w).aq !== v) bad.push(`${w}: page ${E.aq(w)}, Numogram Lab ${lab.values(w).aq}, Python ${v}`);
}
check(`AQ matches Numogram Lab and the Python reference on ${Object.keys(ref.aq_test_words).length} strings`, !bad.length, bad.join('; '));

/* ---------- 4. lifelib ---------- */
const L = JSON.parse(rd('codex/lifelib_pops.json'));
const bodyBad = L.words.filter(w => E.body(w).map(c => c.join(',')).sort().join(' ') !== L.bodies[w].map(c => c.join(',')).sort().join(' ') || E.aq(w) !== L.aq[w]);
check(`word bodies match the independent Python encoding for all ${L.words.length} words`, !bodyBad.length, bodyBad.join(', '));
const diff = [];
for (const [key, run] of Object.entries(L.runs)) {
  const [w, which] = key.split('|');
  const k = which === 'own' ? E.decode(E.aq(w)) : { B: LIFE_B, S: LIFE_S };
  if (E.bs(k.B, k.S).toLowerCase().replace('/', '') !== run.rule) { diff.push(`${key}: rule ${E.bs(k.B, k.S)} vs ${run.rule}`); continue; }
  const u = new E.Universe(E.body(w), k.B, k.S);
  for (let i = 0; i < run.pops.length; i++) {
    while (u.gen < i * run.step) u.step();
    if (u.live.length !== run.pops[i]) { diff.push(`${key}: generation ${i * run.step}, page ${u.live.length}, lifelib ${run.pops[i]}`); break; }
  }
}
const nRuns = Object.keys(L.runs).length;
check(`populations match lifelib at every generation through ${L.gens}: ${L.words.length} words, ${nRuns} runs`, !diff.length, diff.slice(0, 3).join('; '));

const failed = results.filter(x => !x.ok).length;
console.log(`codex: ${results.length - failed} of ${results.length} checks passed in ${((Date.now() - t0) / 1000).toFixed(0)} s (${path.relative(ROOT, target)})`);
process.exit(failed ? 1 : 0);
