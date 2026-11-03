/* ---------- cipher core ---------- */
const CIPHERS6 = ['ord', 'red', 'aq', 'rev', 'rred', 'sat'];
const CIPHER_SHORT = { ord: 'Ord', red: 'Red', aq: 'AQ', rev: 'Rev', rred: 'RRed', sat: 'Sat' };
const CIPHER_LONG = { ord: 'Ordinal', red: 'Reduction', aq: 'AQ', rev: 'Reverse', rred: 'Reverse reduction', sat: 'Satanic' };

function lettersOf(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
}
function digitSum(s) {
  let t = 0;
  for (const ch of String(s || '')) if (ch >= '0' && ch <= '9') t += ch.charCodeAt(0) - 48;
  return t;
}
/* Ordinal A=1..Z=26, Reverse Z=1..A=26, Reduction 1-9 repeating, Satanic A=36..Z=61,
   AQ A=10..Z=35 with digits 0-9 at face value. */
function values(s) {
  const t = lettersOf(s);
  let ord = 0, red = 0, rred = 0;
  for (let i = 0; i < t.length; i++) {
    const p = t.charCodeAt(i) - 96;
    ord += p; red += (p - 1) % 9 + 1; rred += (26 - p) % 9 + 1;
  }
  const n = t.length, d = digitSum(s);
  return { n, ord, rev: 27 * n - ord, red, rred, sat: ord + 35 * n, aq: ord + 9 * n + d, digits: d };
}
function dr(n) { n = Math.abs(Math.round(n)); return n === 0 ? 0 : 1 + (n - 1) % 9; }
function plexSteps(n) {
  const out = [n]; let x = n;
  while (x > 9) { x = String(x).split('').reduce((a, c) => a + (+c), 0); out.push(x); }
  return out;
}

/* ---------- numogram structure (Ccru glossary) ---------- */
function region(z) { return (z === 3 || z === 6) ? 'warp' : ((z === 9 || z === 0) ? 'plex' : 'tc'); }
const REGION_NAME = { tc: 'Time-Circuit', warp: 'Warp', plex: 'Plex' };
const SYZYGIES = {
  '9::0': { demon: 'Uttunul', current: 'Plex', to: 9 },
  '8::1': { demon: 'Murrumur', current: 'Surge', to: 7 },
  '7::2': { demon: 'Oddubb', current: 'Hold', to: 5 },
  '6::3': { demon: 'Djynxx', current: 'Warp', to: 3 },
  '5::4': { demon: 'Katak', current: 'Sink', to: 1 }
};
function syzOf(z) {
  const t = 9 - z, a = Math.max(z, t), b = Math.min(z, t), key = a + '::' + b;
  return Object.assign({ key, a, b, twin: t }, SYZYGIES[key]);
}
function gateOf(z) {
  const g = z * (z + 1) / 2;
  return { n: g, label: 'Gt-' + String(g).padStart(2, '0'), to: g === 0 ? 0 : dr(g) };
}
/* zone a phrase lands in under each cipher */
function cipherZones(v) {
  const z = {};
  for (const c of CIPHERS6) z[c] = dr(v[c]);
  return z;
}

/* ---------- Pandemonium Matrix ---------- */
const DEMON_TABLE = [[1,0,'Lurgo'],[2,0,'Duoddod'],[2,1,'Doogu'],[3,0,'Ixix'],[3,1,'Ixigool'],[3,2,'Ixidod'],[4,0,'Krako'],[4,1,'Sukugool'],[4,2,'Skoodu'],[4,3,'Skarkix'],[5,0,'Tokhatto'],[5,1,'Tukkamu'],[5,2,'Kuttadid'],[5,3,'Tikkitix'],[5,4,'Katak'],[6,0,'Tchu'],[6,1,'Djungo'],[6,2,'Djuddha'],[6,3,'Djynxx'],[6,4,'Tchakki'],[6,5,'Tchattuk'],[7,0,'Puppo'],[7,1,'Bubbamu'],[7,2,'Oddubb'],[7,3,'Pabbakis'],[7,4,'Ababbatok'],[7,5,'Papatakoo'],[7,6,'Bobobja'],[8,0,'Minommo'],[8,1,'Murrumur'],[8,2,'Nammamad'],[8,3,'Mummumix'],[8,4,'Numko'],[8,5,'Muntuk'],[8,6,'Mommoljo'],[8,7,'Mombbo'],[9,0,'Uttunul'],[9,1,'Tutagool'],[9,2,'Unnunddo'],[9,3,'Ununuttix'],[9,4,'Ununak'],[9,5,'Tukutu'],[9,6,'Unnutchi'],[9,7,'Nuttubab'],[9,8,'Ummnu']];
const TCSET = new Set([1, 2, 4, 5, 7, 8]);
function meshOf(a, b) { return a * (a - 1) / 2 + b; }
function demonClass(a, b) {
  const x = TCSET.has(a), y = TCSET.has(b);
  return x && y ? 'chrono' : (!x && !y ? 'xeno' : 'amphi');
}
function demonName(a, b, spelling) {
  if (a === 8 && b === 1) return spelling === 'murmur' ? 'Mur Mur' : 'Murrumur';
  const r = DEMON_TABLE.find(d => d[0] === a && d[1] === b);
  return r ? r[2] : '?';
}
function demonBetween(za, zb, spelling) {
  if (za === zb) return null;
  const a = Math.max(za, zb), b = Math.min(za, zb);
  return { a, b, name: demonName(a, b, spelling), mesh: meshOf(a, b), cls: demonClass(a, b), syzygetic: a + b === 9 };
}
function landsHome(a, b, z) { return z === a || z === b || (z === 9 && b === 0); }
function demonsWithHome(spelling) {
  return DEMON_TABLE.map(([a, b]) => {
    const name = demonName(a, b, spelling), v = values(name), z = dr(v.aq);
    return { a, b, name, mesh: meshOf(a, b), cls: demonClass(a, b), syzygetic: a + b === 9, aq: v.aq, zone: z, home: landsHome(a, b, z) };
  }).sort((p, q) => p.mesh - q.mesh);
}
function expectedHome() {
  let e = 0;
  for (const [a, b] of DEMON_TABLE) {
    const s = new Set([a === 0 ? 9 : a, b === 0 ? 9 : b]);
    e += s.size / 9;
  }
  return e;
}
function maxWindow(hitMeshes, w) {
  const s = new Set(hitMeshes); let best = 0, at = 0;
  for (let st = 0; st + w <= 45; st++) {
    let c = 0; for (let i = st; i < st + w; i++) if (s.has(i)) c++;
    if (c > best) { best = c; at = st; }
  }
  return { count: best, start: at };
}
function windowOdds(k, observed, w, trials, seed) {
  let a = seed || 12345;
  const rnd = () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let hit = 0;
  for (let t = 0; t < trials; t++) {
    const pick = new Set();
    while (pick.size < k) pick.add(Math.floor(rnd() * 45));
    if (maxWindow([...pick], w).count >= observed) hit++;
  }
  return hit / trials;
}

/* ---------- alphabet ---------- */
function aqLetter(c) { return c.charCodeAt(0) - 87; }
function atbash(s) {
  return String(s).replace(/[a-z]/gi, ch => {
    const lo = ch.toLowerCase(), m = String.fromCharCode(219 - lo.charCodeAt(0));
    return ch === lo ? m : m.toUpperCase();
  });
}

/* ---------- number names and the attractor ---------- */
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function numName(n, and) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
  if (n < 1000) {
    const r = n % 100;
    return ONES[Math.floor(n / 100)] + ' hundred' + (r ? (and ? ' and ' : ' ') + numName(r, and) : '');
  }
  for (const [v, w] of [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']]) {
    if (n >= v) {
      const q = Math.floor(n / v), r = n % v;
      return numName(q, and) + ' ' + w + (r ? ((and && r < 100) ? ' and ' : ' ') + numName(r, and) : '');
    }
  }
  return '';
}
function nameValue(n, cipher, and) {
  const v = values(numName(n, and));
  return cipher === 'aq' ? v.aq : (cipher === 'sat' ? v.sat : v.ord);
}
function orbitOf(n, cipher, and) {
  const seen = new Map(), path = []; let x = n;
  while (!seen.has(x) && path.length < 600) { seen.set(x, path.length); path.push(x); x = nameValue(x, cipher, and); }
  const i = seen.has(x) ? seen.get(x) : path.length;
  return { path, entry: i, cycle: path.slice(i), tail: path.slice(0, i), next: x };
}
function rotateToMin(c) {
  let m = 0; for (let i = 1; i < c.length; i++) if (c[i] < c[m]) m = i;
  return c.slice(m).concat(c.slice(0, m));
}
function basins(cipher, and, N) {
  N = N || 9999;
  const memo = new Map(), counts = new Map(), cycles = new Map();
  for (let s = 1; s <= N; s++) {
    let x = s; const path = [], local = new Map();
    while (!memo.has(x) && !local.has(x)) { local.set(x, path.length); path.push(x); x = nameValue(x, cipher, and); }
    let key;
    if (memo.has(x)) key = memo.get(x);
    else { const cyc = rotateToMin(path.slice(local.get(x))); key = cyc.join(','); cycles.set(key, cyc); }
    for (const p of path) memo.set(p, key);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].map(([key, count]) => ({ key, cycle: cycles.get(key), count })).sort((p, q) => q.count - p.count);
}

/* ---------- cipher-hop loops ---------- */
const LOOP_CIPHERS = ['ord', 'rev', 'sat', 'aq'];
const FEATURED_CATS = new Set(['ccru', 'lovecraft', 'thelema', 'faust', 'occult', 'bible', 'philo', 'ai', 'greek', 'sphinxph']);
function lexiconList(lex) {
  const out = [], cat = new Map();
  for (const [k, arr] of Object.entries(lex)) for (const p of arr) { out.push(p); cat.set(p, k); }
  return { list: out, cat };
}
function findLoops(start, list, maxLen, cap) {
  maxLen = maxLen || 4; cap = cap || 500;
  const pool = list.some(p => p === start) ? list : list.concat([start]);
  const V = new Map(), idx = new Map();
  for (const p of pool) {
    const v = values(p); if (v.n === 0) continue;
    V.set(p, v);
    for (const c of LOOP_CIPHERS) { const k = v[c]; let a = idx.get(k); if (!a) { a = []; idx.set(k, a); } a.push([p, c]); }
  }
  if (!V.has(start)) return [];
  const twinKey = p => { const v = V.get(p); return v.n + '|' + v.ord; };
  const out = [];
  for (const cin of LOOP_CIPHERS) {
    const path = [[start, cin]], hops = [];
    const dfs = () => {
      if (out.length >= cap) return;
      const [p, ci] = path[path.length - 1], v = V.get(p);
      for (const co of LOOP_CIPHERS) {
        if (co === ci) continue;
        const val = v[co], list2 = idx.get(val) || [];
        for (const [q, cq] of list2) {
          if (q === start) {
            if (cq === cin && path.length >= 2) {
              out.push(path.map(([pp, cc], i) => ({ p: pp, cin: cc, cout: i < hops.length ? hops[i][0] : co })));
            }
            continue;
          }
          if (path.length >= maxLen) continue;
          if (path.some(([pp]) => pp === q || twinKey(pp) === twinKey(q))) continue;
          path.push([q, cq]); hops.push([co, val]);
          dfs();
          path.pop(); hops.pop();
          if (out.length >= cap) return;
        }
      }
    };
    dfs();
  }
  return out;
}
function loopHops(loop) {
  return loop.map((node, i) => {
    const nxt = loop[(i + 1) % loop.length];
    const a = values(node.p)[node.cout], b = values(nxt.p)[nxt.cin];
    return { from: node.p, fromC: node.cout, to: nxt.p, toC: nxt.cin, val: a, ok: a === b && node.cin !== node.cout };
  });
}
const CAT_LABELS = {
  ccru: 'Ccru and Nick Land', lovecraft: 'Lovecraft', thelema: 'Crowley and Thelema', faust: 'Faust',
  occult: 'Occult and esoteric', bible: 'Biblical', philo: 'Philosophy', ai: 'AI and cybernetics',
  greek: 'Greek myth', sphinxph: 'Sphinx phrases', extra: 'Literature, film, music and more esoterica',
  words: 'Single words', nums: 'Number names'
};
const CAT_ORDER = ['ccru', 'lovecraft', 'thelema', 'faust', 'occult', 'bible', 'philo', 'ai', 'greek', 'sphinxph', 'extra', 'words', 'nums'];
function catWeight(k) { return FEATURED_CATS.has(k) ? 3 : ((k === 'words' || k === 'nums') ? -2 : 0); }
function scoreParts(loop, cat) {
  const ciphers = new Set(); let theme = 0;
  for (const n of loop) { ciphers.add(n.cin); ciphers.add(n.cout); theme += catWeight(cat.get(n.p)); }
  const c = ciphers.size * 2, len = -loop.length;
  return { theme, ciphers: c, length: len, total: theme + c + len };
}
function scoreLoop(loop, cat) { return scoreParts(loop, cat).total; }

/* ---------- curated content ---------- */
const CURATED_LOOPS = [
  { id: 'two', label: '2 steps', title: 'Will to Ice and the Great Old Ones', nodes: [
    { p: 'Will to Ice', cin: 'rev', cout: 'aq' }, { p: 'Great Old Ones', cin: 'rev', cout: 'ord' }] },
  { id: 'three', label: '3 steps', title: 'The Beast in the Numogram', nodes: [
    { p: 'Number of the Beast', cin: 'ord', cout: 'rev' }, { p: 'Oddubb', cin: 'sat', cout: 'aq' }, { p: 'Numogram', cin: 'ord', cout: 'aq' }] },
  { id: 'four', label: '4 steps', title: 'The 333 chain, closed', nodes: [
    { p: 'Will to Ice', cin: 'ord', cout: 'aq' }, { p: 'Eloquent Miracles', cin: 'ord', cout: 'aq' }, { p: 'Xenocosmography', cin: 'aq', cout: 'ord' }, { p: 'Ubermensch', cin: 'aq', cout: 'ord' }] },
  { id: 'sphinx', label: '6 steps', title: 'Through the Sphinx', nodes: [
    { p: 'Will to Ice', cin: 'rev', cout: 'aq' }, { p: 'Eloquent Miracles', cin: 'ord', cout: 'aq' }, { p: 'Xenocosmography', cin: 'aq', cout: 'ord' }, { p: 'Dionysus', cin: 'aq', cout: 'rev' }, { p: 'Sphinx', cin: 'ord', cout: 'rev' }, { p: 'Cthelll', cin: 'ord', cout: 'aq' }] },
  { id: 'arc', label: '6 steps', title: 'Land’s arc', soft: true, nodes: [
    { p: 'Will to Ice', cin: 'rev', cout: 'aq' }, { p: 'Eloquent Miracles', cin: 'ord', cout: 'aq' }, { p: 'Xenocosmography', cin: 'aq', cout: 'ord' }, { p: 'Schizoanalysis', cin: 'rev', cout: 'ord' }, { p: 'Dark Enlightenment', cin: 'ord', cout: 'rev' }, { p: 'Anglossic Qabbala', cin: 'aq', cout: 'ord' }] }
];
const EXAMPLE_PAIRS = [
  ['Man', 'Machine'], ['Gematria', 'Machine Learning'], ['Training', 'Inference'], ['Synchronicity', 'Chance'],
  ['Inside', 'Outside'], ['Angel', 'Demon'], ['Letter', 'Number'], ['Human', 'Machine'],
  ['Safety', 'Danger'], ['Signal', 'Noise'], ['God', 'Machine'], ['Claude', 'Nick Land'],
  ['Xenocosmography', 'Eloquent Miracles'], ['Claude Opus', 'Alan Turing']
];

if (typeof module !== 'undefined') module.exports = {
  values, dr, plexSteps, region, syzOf, gateOf, cipherZones, demonBetween, demonsWithHome, expectedHome,
  maxWindow, windowOdds, atbash, aqLetter, numName, orbitOf, basins, findLoops, loopHops, scoreLoop, scoreParts, catWeight, CAT_LABELS,
  lexiconList, CURATED_LOOPS, EXAMPLE_PAIRS, DEMON_TABLE
};
