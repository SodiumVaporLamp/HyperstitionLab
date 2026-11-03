/* ================= Time-Sorcery engine ================= */

/* ---------- letters and ciphers ---------- */
function lettersOf(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
}
function digitSum(s) {
  let t = 0;
  for (const ch of String(s || '')) if (ch >= '0' && ch <= '9') t += ch.charCodeAt(0) - 48;
  return t;
}
/* AQ: digits keep their face value, A = 10 ... Z = 35 (Land, "Qabbala 101", n. 4) */
function aqLetter(c) { return c.charCodeAt(0) - 87; }
function aqOf(s) {
  const t = lettersOf(s);
  let v = digitSum(s);
  for (let i = 0; i < t.length; i++) v += aqLetter(t[i]);
  return v;
}
function aqTiles(s) {
  const out = [];
  for (const ch of String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')) {
    if (/[a-z]/i.test(ch)) out.push({ ch: ch.toUpperCase(), v: aqLetter(ch.toLowerCase()) });
    else if (/[0-9]/.test(ch)) out.push({ ch, v: +ch });
  }
  return out;
}
/* Primitive Numerization: letters per word */
function pnShape(s) {
  return String(s || '').split(/[^A-Za-z0-9À-ɏ]+/).map(w => lettersOf(w).length + digitCount(w)).filter(n => n > 0);
}
function digitCount(w) { return (String(w).match(/[0-9]/g) || []).length; }

/* ---------- reduction ---------- */
function dr(n) { n = Math.abs(Math.round(n)); return n === 0 ? 0 : 1 + (n - 1) % 9; }
function plexSteps(n) {
  const out = [n]; let x = n;
  while (x > 9) { x = String(x).split('').reduce((a, c) => a + (+c), 0); out.push(x); }
  return out;
}

/* ---------- numogram ---------- */
function region(z) { return (z === 3 || z === 6) ? 'warp' : ((z === 9 || z === 0) ? 'plex' : 'tc'); }
const REGION_NAME = { tc: 'Time-Circuit', warp: 'Warp', plex: 'Plex' };
const SYZ = {
  '9::0': { demon: 'Uttunul', current: 'Plex', to: 9 },
  '8::1': { demon: 'Murrumur', current: 'Surge', to: 7 },
  '7::2': { demon: 'Oddubb', current: 'Hold', to: 5 },
  '6::3': { demon: 'Djynxx', current: 'Warp', to: 3 },
  '5::4': { demon: 'Katak', current: 'Sink', to: 1 }
};
function twinOf(z) { return 9 - z; }
function syzKey(z) { const t = 9 - z; return Math.max(z, t) + '::' + Math.min(z, t); }
function tractorOf(z) { return SYZ[syzKey(z)].to; }
function gateNum(z) { return z * (z + 1) / 2; }
function gateTo(z) { return z === 0 ? 0 : dr(gateNum(z)); }
function gateLabel(z) { return 'Gt-' + String(gateNum(z)).padStart(2, '0'); }
/* the three ways a rite moves: cross a syzygy, ride its current, take a gate */
function movesFrom(z) {
  return [
    { to: twinOf(z), kind: 'twin' },
    { to: tractorOf(z), kind: 'current' },
    { to: gateTo(z), kind: 'gate' }
  ];
}
/* which move kinds connect a to b (there can be two: 4 -> 1 is both a gate and a current) */
function kindsBetween(a, b) { return movesFrom(a).filter(m => m.to === b).map(m => m.kind); }
function walk(path) {
  const steps = [];
  for (let i = 0; i + 1 < path.length; i++) {
    const k = kindsBetween(path[i], path[i + 1]);
    if (!k.length) return null;
    steps.push({ from: path[i], to: path[i + 1], kinds: k });
  }
  return steps;
}
function digitsOf(p) { return String(p).split('').map(Number); }
/* all shortest simple passages from a to b */
function shortestPassages(a, b) {
  if (a === b) return [];
  const out = []; let q = [[a]], found = 0;
  while (q.length && !found) {
    const nq = [];
    for (const p of q) {
      const z = p[p.length - 1];
      for (const m of movesFrom(z)) {
        if (p.includes(m.to)) continue;
        const np = p.concat(m.to);
        if (m.to === b) { found = np.length; if (!out.some(x => x.join('') === np.join(''))) out.push(np); }
        else nq.push(np);
      }
    }
    q = nq;
  }
  return out.map(p => p.join(''));
}
function reachableFrom(a) {
  const seen = new Set([a]), st = [a];
  while (st.length) { const z = st.pop(); for (const m of movesFrom(z)) if (!seen.has(m.to)) { seen.add(m.to); st.push(m.to); } }
  return seen;
}

/* ---------- Pandemonium ---------- */
const DEMONS = [[1,0,'Lurgo'],[2,0,'Duoddod'],[2,1,'Doogu'],[3,0,'Ixix'],[3,1,'Ixigool'],[3,2,'Ixidod'],[4,0,'Krako'],[4,1,'Sukugool'],[4,2,'Skoodu'],[4,3,'Skarkix'],[5,0,'Tokhatto'],[5,1,'Tukkamu'],[5,2,'Kuttadid'],[5,3,'Tikkitix'],[5,4,'Katak'],[6,0,'Tchu'],[6,1,'Djungo'],[6,2,'Djuddha'],[6,3,'Djynxx'],[6,4,'Tchakki'],[6,5,'Tchattuk'],[7,0,'Puppo'],[7,1,'Bubbamu'],[7,2,'Oddubb'],[7,3,'Pabbakis'],[7,4,'Ababbatok'],[7,5,'Papatakoo'],[7,6,'Bobobja'],[8,0,'Minommo'],[8,1,'Murrumur'],[8,2,'Nammamad'],[8,3,'Mummumix'],[8,4,'Numko'],[8,5,'Muntuk'],[8,6,'Mommoljo'],[8,7,'Mombbo'],[9,0,'Uttunul'],[9,1,'Tutagool'],[9,2,'Unnunddo'],[9,3,'Ununuttix'],[9,4,'Ununak'],[9,5,'Tukutu'],[9,6,'Unnutchi'],[9,7,'Nuttubab'],[9,8,'Ummnu']];
const TC = new Set([1, 2, 4, 5, 7, 8]);
function demonBetween(za, zb) {
  if (za === zb) return null;
  const a = Math.max(za, zb), b = Math.min(za, zb), r = DEMONS.find(d => d[0] === a && d[1] === b);
  const x = TC.has(a), y = TC.has(b);
  const cls = x && y ? 'chronodemon' : (!x && !y ? 'xenodemon' : 'amphidemon');
  return { a, b, key: a + '::' + b, name: r[2], mesh: a * (a - 1) / 2 + b, cls, syzygetic: a + b === 9 };
}

/* ---------- K-Time ---------- */
/* "Native calendar of cyberspace ... beginning from zero (= 00) = AD 1900" (Ccru glossary) */
function kYear(year, binomic) {
  const k = year - 1900;
  return binomic ? ((k % 100) + 100) % 100 : k;
}
function kLabel(k, binomic) { return 'K-' + (binomic || k < 100 ? String(k).padStart(2, '0') : String(k)); }

/* ---------- Tic Xenotation ---------- */
/* ':' is 2, juxtaposition multiplies, (x) is the x-th prime */
const SIEVE_N = 200000;
let PRIMES = null, PRIME_INDEX = null;
function ensurePrimes() {
  if (PRIMES) return;
  const comp = new Uint8Array(SIEVE_N + 1); PRIMES = []; PRIME_INDEX = new Map();
  for (let i = 2; i <= SIEVE_N; i++) {
    if (!comp[i]) { PRIMES.push(i); PRIME_INDEX.set(i, PRIMES.length); for (let j = i * i; j <= SIEVE_N; j += i) comp[j] = 1; }
  }
}
function factorize(n) {
  const f = []; let x = n;
  for (let p = 2; p * p <= x; p++) while (x % p === 0) { f.push(p); x /= p; }
  if (x > 1) f.push(x);
  return f;
}
/* tree: array of items; item = 'tic' | {inner: tree} */
function txTree(n) {
  ensurePrimes();
  if (n <= 1) return [];
  return factorize(n).map(p => p === 2 ? 'tic' : { inner: txTree(PRIME_INDEX.get(p)), p });
}
function txString(tree) { return tree.map(it => it === 'tic' ? ':' : '(' + txString(it.inner) + ')').join(''); }
function tx(n) { return n === 0 ? null : txString(txTree(n)); }
function ticCount(s) { return s ? (s.match(/:/g) || []).length : 0; }
function txDepth(tree) { let d = 0; for (const it of tree) if (it !== 'tic') d = Math.max(d, 1 + txDepth(it.inner)); return d; }

/* ---------- Land's own examples (Qabbala 101) ---------- */
const NUMERAL_NAMES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const LAND_NINES = ['CODE', 'MEANING', 'REASON', 'AGAINST NUMEROLOGY', 'SIGNIFICANCE', 'SIGNIFICATION'];
const LAND_UNITY = [['UNITY', 1], ['OPPOSITION', 2], ['CONJUNCTION', 3], ['COMPLETION', 4]];

/* ---------- the whole reading ---------- */
function reading(seed, year, binomic) {
  const aq = aqOf(seed), steps = plexSteps(aq), z = steps[steps.length - 1];
  const k = kYear(year, binomic), kz = dr(k);
  const demon = demonBetween(z, kz);
  const back = shortestPassages(kz, z), fwd = shortestPassages(z, kz);
  const rites = demon ? (RITES[demon.key] || []) : [];
  const riteDir = rites.map(r => {
    if (!/^[0-9]+$/.test(r.p)) return Object.assign({ dir: 'none' }, r);
    const d = digitsOf(r.p), first = d[0], last = d[d.length - 1];
    const dir = (first === kz && last === z) ? 'counter' : ((first === z && last === kz) ? 'chrono' : 'other');
    return Object.assign({ dir }, r);
  });
  const txSeed = tx(aq), txK = tx(k);
  return {
    seed, aq, steps, z, region: region(z), shape: pnShape(seed),
    year, binomic, k, kLabel: kLabel(k, binomic), kz, kRegion: region(kz),
    demon, back, fwd, rites: riteDir,
    publishedBack: riteDir.filter(r => r.dir === 'counter').map(r => r.p),
    txSeed, txK, ticsSeed: ticCount(txSeed), ticsK: ticCount(txK)
  };
}

if (typeof module !== 'undefined') module.exports = {
  lettersOf, aqOf, aqTiles, pnShape, dr, plexSteps, region, twinOf, tractorOf, gateTo, gateLabel, movesFrom, kindsBetween,
  walk, shortestPassages, reachableFrom, demonBetween, kYear, kLabel, txTree, tx, ticCount, txDepth, reading, syzKey, SYZ,
  NUMERAL_NAMES, LAND_NINES, LAND_UNITY
};
