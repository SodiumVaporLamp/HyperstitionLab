/* Checks for the two companion pages: node shared/check.js
   1. shared/demons.js: one description per demon, in mesh order, keyed to the same net-spans as the
      arithmetic's own tables, in house style, and never naming a demon (so no spelling can leak in).
   2. The claims the pages state as rules, tested against the pages' own functions:
      Numogram Lab's cross-cipher note, and Time-Sorcery's zone-0 years.
   test.py runs this, and also runs it on broken copies of demons.js (--demons FILE); it exits 1 on any failure. */
const vm = require('vm'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
function load(files, extra) {
  const ctx = { module: { exports: {} } };
  vm.createContext(ctx);
  vm.runInContext(files.map(rd).join('\n') + '\n' + extra, ctx);
  return ctx.module.exports;
}
const k = process.argv.indexOf('--demons');   // test.py points this at broken copies to show the checks bite
const DEMONS_FILE = k > 0 ? path.relative(ROOT, path.resolve(process.argv[k + 1])) : 'shared/demons.js';
const D = load([DEMONS_FILE], 'module.exports = { DEMON_LORE, PANDEMONIUM_URL, demonLore, demonAka };');
const L = load(['numolab/lexicon.js', 'numolab/logic.js'], 'module.exports.LEXICON = LEXICON;');
const T = load(['timesorcery/data.js', 'timesorcery/logic.js'], 'module.exports.DEMONS = DEMONS; module.exports.RITES = RITES;');
const bad = [], say = m => bad.push(m);

/* ---------- 1. the descriptions ---------- */
const AMERICAN = /\b(color|center|centered|analyze|realize|organize|colonize|recognize|gray|labor|behavior|favor|honor|fiber|meter)\b/i;
const names = new Set();
for (const [a, b, n] of L.DEMON_TABLE) names.add(n.toLowerCase());
for (const e of D.DEMON_LORE) { names.add(e.nm.toLowerCase()); }
if (D.DEMON_LORE.length !== 45) say(`DEMON_LORE has ${D.DEMON_LORE.length} entries, not 45`);
D.DEMON_LORE.forEach((e, i) => {
  const [a, b] = e.k.split('::').map(Number), id = `mesh ${String(i).padStart(2, '0')} (${e.k})`;
  if (e.m !== i) say(`${id}: m is ${e.m}; entries must be in mesh order`);
  if (a * (a - 1) / 2 + b !== i) say(`${id}: net-span ${e.k} is mesh ${a * (a - 1) / 2 + b}`);
  const lab = L.DEMON_TABLE.find(d => d[0] === a && d[1] === b), ts = T.DEMONS.find(d => d[0] === a && d[1] === b);
  if (!lab || !ts) say(`${id}: no such demon in the Lab's or Time-Sorcery's table`);
  if (lab && lab[2] !== e.nm && !(e.k === '8::1' && e.nm === 'Mur Mur')) say(`${id}: Matrix name ${e.nm} differs from the table's ${lab[2]}`);
  for (const f of ['t', 'r']) {
    const s = e[f];
    if (typeof s !== 'string' || !s.trim()) { say(`${id}: ${f} is empty`); continue; }
    if (!/[.]$/.test(s)) say(`${id}: ${f} should end with a full stop`);
    if (/['"]/.test(s)) say(`${id}: ${f} has a straight quote or apostrophe`);
    if (AMERICAN.test(s)) say(`${id}: ${f} has an American spelling: ${s.match(AMERICAN)[0]}`);
    const words = s.toLowerCase().match(/[a-z’()-]+/g) || [];
    for (const n of names) if (n.length > 2 && words.some(w => w.replace(/[()’]/g, '') === n.replace(/[()’ ]/g, ''))) say(`${id}: ${f} names a demon (${n})`);
    if (/mur ?mur|murrumur/i.test(s)) say(`${id}: ${f} spells out the 8::1 name`);
  }
  if (e.t.length > 100) say(`${id}: t runs to ${e.t.length} characters; the pair card has room for about 100`);
  if (e.r.length > 175) say(`${id}: r runs to ${e.r.length} characters`);
  const marked = (T.RITES[e.k] || []).some(r => r.p === '?');
  if (marked !== /question mark in place of a route/.test(e.r)) say(`${id}: r ${marked ? 'should say' : 'says'} the Matrix gives its rite a question mark`);
  if (!Array.isArray(e.aka)) say(`${id}: aka should be a list`);
});

/* ---------- 2. the stated rules ---------- */
const { list } = L.lexiconList(L.LEXICON);
const twin = z => z === 9 ? 9 : 9 - z;   // a digital root writes zone 0 as 9
let lettersOnly = 0;
for (const p of list.concat(['Numogram Lab', 'Übermensch', 'Machine Intelligence'])) {
  const v = L.values(p);
  if (v.digits) continue;
  lettersOnly++;
  const z = L.dr(v.aq);
  if (L.dr(v.ord) !== z || L.dr(v.red) !== z) say(`Lab note: “${p}” has AQ zone ${z} but Ordinal ${L.dr(v.ord)}, Reduction ${L.dr(v.red)}`);
  if (L.dr(v.rev) !== twin(z) || L.dr(v.rred) !== twin(z)) say(`Lab note: “${p}” Reverse ciphers do not land in the twin of ${z}`);
  if (L.dr(v.sat) !== L.dr(((v.ord - v.n) % 9 + 9) % 9 || 9)) say(`Lab note: “${p}” Satanic is not ${v.n} steps back`);
}
const g = L.values('GPT6');
if (!(g.aq === 76 && L.dr(g.aq) === 4 && g.ord === 43 && L.dr(g.ord) === 7)) say('Lab note: the GPT6 example no longer reads AQ 76 → 4, Ordinal 43 → 7');
let digitSplits = 0;
for (let n = 0; n <= 9; n++) { const v = L.values('Machine' + n); if (L.dr(v.aq) !== L.dr(v.ord)) digitSplits++; }
if (digitSplits === 0) say('Lab note: digits never split AQ from Ordinal, so the note’s exception is wrong');
const zero = bin => { const o = []; for (let y = 1900; y <= 2999; y++) if (T.dr(T.kYear(y, bin)) === 0) o.push(y); return o; };
const zr = zero(false), zb = zero(true);
if (zr.join() !== '1900') say(`Time-Sorcery: in the running count the zone-0 years are ${zr.join(', ')}`);
if (zb.length !== 11 || !zb.every(y => y % 100 === 0)) say(`Time-Sorcery: in two digits the zone-0 years are ${zb.join(', ')}`);

if (bad.length) { console.log(`${bad.length} problem(s) in the companion pages:\n  ` + bad.join('\n  ')); process.exit(1); }
console.log(`companion pages: 45 demon descriptions in order and in house style; the cross-cipher rules hold for ${lettersOnly} letter-only phrases and digits break them; zone 0 is 1900 alone in the running count and the 11 century years in two digits`);
