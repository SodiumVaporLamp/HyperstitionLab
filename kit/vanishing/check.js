/* Vanishing Point data check:  node vanishing/check.js [--now YYYY-MM-DD]
   Errors stop the build being trusted (exit code 1). Warnings are worth a look.
   Prints the counts SVL's README quotes: milestones and forecasts are counted separately.
   --now checks the forecasts as of another day, to see which will close without a verdict.
   --forecasts FILE checks another copy of forecasts.js (test.py uses it to prove the checks bite). */
const path = require('path');
const { THREADS, THREAD_ORDER, LABS, EVENTS, BODY } = require(path.join(__dirname, 'data.js'));
const fk = process.argv.indexOf('--forecasts');   // test.py points this at deliberately broken copies
const { FORECASTS } = require(fk > 0 ? path.resolve(process.argv[fk + 1]) : path.join(__dirname, 'forecasts.js'));
const { parseD, VPS, fcTimes, fcStatus, fcHorizon, endMs } = require(path.join(__dirname, 'logic.js'));

const FIELDS = new Set(['id', 'd', 'dl', 't', 'short', 'th', 'lab', 'org', 'w', 'f', 'x', 'q', 'qc', 'o', 's', 'see', 'tag']);
const TEXT = ['t', 'short', 'dl', 'x', 'q', 'qc', 'o'];
/* American spellings, outside names and titles listed in NAMES */
const NAMES = /Center for AI Safety|Behavior, Purpose and Teleology|The Organization of Behavior|Lewis Research Center/g;
const US = /\b(center|centered|color|behavior|favorite|analyze[sd]?|organiz(e|ed|ing)|formaliz(e|ed|ing)|recogniz(e|ed)|realiz(e|ed)|labeled|modeling|catalog)\b/i;
const errors = [], warnings = [];
const err = (e, m) => errors.push(`${e.id || '?'}: ${m}`);
const warn = (e, m) => warnings.push(`${e.id || '?'}: ${m}`);

const seen = new Set();
const k = process.argv.indexOf('--now');
const now = k > 0 ? Date.parse(process.argv[k + 1] + 'T12:00:00Z') : Date.now();
if (Number.isNaN(now)) { console.log('--now wants a date: YYYY-MM-DD'); process.exit(2); }
const doom = VPS.doomsday.ms;
const style = (e, k, v, verbatim) => {
  if (v == null) return;
  if (typeof v !== 'string') { err(e, `${k} must be text`); return; }
  if (/['"]/.test(v)) warn(e, `${k} has a straight quote; the house style uses ’ “ ”`);
  if (/ {2}|^\s|\s$/.test(v)) warn(e, `${k} has stray spaces`);
  if (verbatim) return;   // a quotation keeps its own spelling
  const m = US.exec(v.replace(NAMES, ''));
  if (m) warn(e, `${k}: "${m[0]}" (house spelling is British unless it is a name; add names to NAMES)`);
};
for (const e of EVENTS) {
  for (const k of Object.keys(e)) if (!FIELDS.has(k)) err(e, `unknown field "${k}"`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(e.id || '')) err(e, 'id must be lowercase letters, digits and hyphens');
  if (seen.has(e.id)) err(e, 'duplicate id'); seen.add(e.id);
  let p = null;
  try { p = parseD(e.d); } catch (x) { err(e, `bad date "${e.d}"`); }
  if (p && ((p.M && p.M > 12) || (p.D && new Date(Date.UTC(p.Y, p.M - 1, p.D)).getUTCDate() !== p.D))) { err(e, `no such date "${e.d}"`); p = null; }
  if (!THREADS[e.th]) err(e, `unknown lane "${e.th}"`);
  if (![1, 2, 3].includes(e.w)) err(e, 'w must be 1, 2 or 3');
  if (e.f !== undefined && !['road', 'verdict'].includes(e.f)) err(e, `f must be "road" or "verdict"`);
  if (!e.t || typeof e.t !== 'string') err(e, 'missing title t');
  if (!e.x || typeof e.x !== 'string') err(e, 'missing account x');
  if (!!e.q !== !!e.qc) err(e, 'q (a quotation) and qc (its citation) go together');
  if (!Array.isArray(e.s)) err(e, 's must be a list of [label, url]');
  else {
    if (!e.s.length) warn(e, 'no sources');
    for (const s of e.s) if (!Array.isArray(s) || s.length !== 2 || !/^https?:\/\//.test(s[1] || '')) err(e, `bad source ${JSON.stringify(s)}`);
  }
  if (e.th === 'model') {
    const labs = e.lab ? (Array.isArray(e.lab) ? e.lab : [e.lab]) : [];
    if (!labs.length) err(e, 'model releases need lab');
    for (const l of labs) if (!LABS[l]) err(e, `unknown lab "${l}"`);
    if (labs.some(l => l === 'other' || l === 'china') && !e.org) warn(e, 'lab "other"/"china" usually names the maker in org');
  } else {
    if (e.lab) err(e, 'lab is only for the Models lane');
    if (e.org) warn(e, 'org is only used on the Models lane');
  }
  if (e.tag && !(Array.isArray(e.tag) && e.tag.every(t => t === 'demon'))) err(e, 'tag must be ["demon"]');
  for (const k of TEXT) {
    const v = e[k];
    if (v == null) continue;
    if (/['"]/.test(v)) warn(e, `${k} has a straight quote; the house style uses ’ “ ”`);
    if (/ {2}|^\s|\s$/.test(v)) warn(e, `${k} has stray spaces`);
    const m = US.exec(v.replace(NAMES, ''));
    if (m) warn(e, `${k}: "${m[0]}" (house spelling is British unless it is a name; add names to NAMES)`);
  }
  if (p) {
    const ms = p.D ? Date.UTC(p.Y, p.M - 1, p.D) : null;
    if (ms && ms > now) warn(e, 'dated in the future');
    if (ms && ms >= doom) warn(e, 'dated on or after 13 Nov 2026: under the Doomsday centre it is squeezed against the centre');
  }
}
/* see: links to other milestones, shown both ways under "Elsewhere on the spiral" */
const IDS = new Set(EVENTS.map(e => e.id));
const links = new Map();
for (const e of EVENTS) {
  if (e.see === undefined) continue;
  if (!Array.isArray(e.see) || !e.see.length) { err(e, 'see must be a non-empty list of milestone ids'); continue; }
  for (const id of e.see) {
    if (!IDS.has(id)) err(e, `see names "${id}", which is not a milestone id`);
    if (id === e.id) err(e, 'see names the card itself');
    const pair = [e.id, id].sort().join(' ');
    if (links.has(pair)) err(e, `see repeats the link with "${id}" (one side is enough; the page draws it both ways)`);
    links.set(pair, true);
  }
}
const seeCount = new Map();
for (const pair of links.keys()) for (const id of pair.split(' ')) seeCount.set(id, (seeCount.get(id) || 0) + 1);
for (const [id, n] of seeCount) if (n > 5) warnings.push(`${id}: ${n} links under “Elsewhere on the spiral”; more than five crowds the card`);

/* ---------- forecasts ---------- */
const FFIELDS = new Set(['id', 'who', 'group', 'made', 'th', 't', 'short', 'type', 'at', 'due', 'from', 'to', 'p10', 'p50', 'prob',
  'say', 'sayc', 'event', 'decide', 'read', 'outcome', 'x', 's', 'card']);
const OFIELDS = new Set(['is', 'on', 'judge', 'say', 'sayc', 's', 'after']);
const TARGETS = { date: ['at'], deadline: ['due'], bet: ['due'], window: ['from', 'to'], spread: ['p50', 'p10'] };
const GROUPS = ['pioneer', 'lab', 'survey', 'bet', 'land'];
const OUTCOMES = ['met', 'late', 'claimed', 'disputed', 'missed', 'none'];
const validDate = (e, k, d) => {
  if (typeof d !== 'string') { err(e, `${k} must be a date string`); return null; }
  let p = null;
  try { p = parseD(d); } catch (x) { err(e, `${k}: bad date "${d}"`); return null; }
  if ((p.M && p.M > 12) || (p.D && new Date(Date.UTC(p.Y, p.M - 1, p.D)).getUTCDate() !== p.D)) { err(e, `${k}: no such date "${d}"`); return null; }
  if (d[0] === '~') { err(e, `${k}: a forecast's dates can't be circa`); return null; }
  return p;
};
const goodSource = s => Array.isArray(s) && s.length === 2 && typeof s[0] === 'string' && s[0] && /^https?:\/\//.test(s[1] || '');
const fseen = new Set();
const closedNoVerdict = [];
for (const f of FORECASTS) {
  for (const key of Object.keys(f)) if (!FFIELDS.has(key)) err(f, `unknown forecast field "${key}"`);
  if (!/^f-[a-z0-9][a-z0-9-]*$/.test(f.id || '')) err(f, 'forecast ids are "f-" then lowercase letters, digits and hyphens');
  if (fseen.has(f.id)) err(f, 'duplicate forecast id'); fseen.add(f.id);
  if (seen.has(f.id)) err(f, 'shares an id with a milestone');
  for (const key of ['who', 't', 'say', 'sayc', 'event', 'decide', 'x']) if (!f[key] || typeof f[key] !== 'string') err(f, `missing ${key}`);
  if (!GROUPS.includes(f.group)) err(f, `group must be one of ${GROUPS.join(', ')}`);
  if (!THREADS[f.th] || f.th === 'model') err(f, `unknown lane "${f.th}" (forecasts don't go in the Models lane)`);
  if (f.card && !EVENTS.some(e => e.id === f.card)) err(f, `card "${f.card}" is not a milestone id`);
  const made = validDate(f, 'made', f.made);
  if (made && Date.UTC(made.Y, Math.max(0, made.M - 1), made.D || 1) > now) err(f, 'said in the future');
  // the target: exactly the fields its type names
  const need = TARGETS[f.type];
  if (!need) err(f, `type must be one of ${Object.keys(TARGETS).join(', ')}`);
  else {
    for (const key of ['at', 'due', 'from', 'to', 'p10', 'p50']) {
      const wanted = need.includes(key);
      if (f[key] != null && !wanted) err(f, `a ${f.type} has no ${key}`);
      if (f[key] == null && wanted && key !== 'p10') err(f, `a ${f.type} needs ${key}`);
      if (f[key] != null) validDate(f, key, f[key]);
    }
  }
  let t = null;
  try { t = fcTimes(f); } catch (x) { err(f, `can't place it: ${x.message}`); }
  if (t && made) {
    if (t.ring <= t.made) err(f, 'the date named is not after the date said');
    if (f.type === 'window' && t.a >= t.b) err(f, 'the window ends before it starts');
    if (t.p10 != null && t.p10 > t.ring) err(f, 'p10 is after p50');
  }
  // every claim carries its quotation, its citation and a source; an archived copy is expected
  if (!Array.isArray(f.s) || !f.s.length) err(f, 'no sources');
  else {
    for (const src of f.s) if (!goodSource(src)) err(f, `bad source ${JSON.stringify(src)}`);
    if (!f.s.some(src => /web\.archive\.org\/web\//.test(src[1] || ''))) warn(f, 'no archived copy among the sources');
  }
  if (f.sayc && !/\d/.test(f.sayc)) warn(f, 'sayc gives no page, date or timestamp');
  const o = f.outcome;
  if (o != null) {
    if (typeof o !== 'object') err(f, 'outcome must be an object');
    else {
      for (const key of Object.keys(o)) if (!OFIELDS.has(key)) err(f, `unknown outcome field "${key}"`);
      if (!OUTCOMES.includes(o.is)) err(f, `outcome.is must be one of ${OUTCOMES.join(', ')}`);
      if (!o.judge) err(f, 'an outcome names who judged it (outcome.judge)');
      if (o.on) validDate(f, 'outcome.on', o.on);
      if (o.after) validDate(f, 'outcome.after', o.after);
      if (!!o.say !== !!o.sayc) err(f, 'a verdict quotation (outcome.say) goes with its citation (outcome.sayc)');
      if (o.s && !goodSource(o.s)) err(f, `bad outcome source ${JSON.stringify(o.s)}`);
      if (o.say && !o.s) err(f, 'a quoted verdict needs its source (outcome.s)');
      if (['met', 'late', 'claimed', 'disputed'].includes(o.is) && !o.say) warn(f, `"${o.is}" without the judge's own words`);
      if (t && t.closes == null && !o.after) warn(f, 'a spread never closes; an outcome on it is unusual');
      style(f, 'outcome.judge', o.judge); style(f, 'outcome.sayc', o.sayc); style(f, 'outcome.say', o.say, true);
    }
  }
  for (const key of ['who', 't', 'short', 'x', 'decide', 'read', 'sayc', 'prob']) style(f, key, f[key]);
  for (const key of ['say', 'event']) style(f, key, f[key], true);
  if (t) {
    const st = fcStatus(f, now);
    if (st === 'closed') {
      const when = new Date(t.closes - 1).toISOString().slice(0, 10);
      warn(f, `its ${f.type === 'window' ? 'window' : 'time'} closed on ${when} with no outcome recorded: add outcome { is, on, judge, … }`);
      closedNoVerdict.push(f.id);
    } else if (st === 'open' && t.closes != null && t.closes - now < 45 * 86400000 && !(o && o.after)) {
      warn(f, `closes within 45 days (${new Date(t.closes - 1).toISOString().slice(0, 10)}); line up its verdict`);
    }
  }
}

/* the body of the machine (BODY in data.js): whole numbers, consecutive years, shares that match, a source for each series */
const bodyLine = [];
if (!BODY || !BODY.msft || !BODY.ireland) errors.push('BODY: data.js must define BODY.msft and BODY.ireland for the Notes panel');
else {
  for (const [key, ser] of Object.entries(BODY)) {
    const tag = { id: 'BODY.' + key };
    if (!Array.isArray(ser.rows) || ser.rows.length < 2) { err(tag, 'needs at least two rows'); continue; }
    if (!Array.isArray(ser.s) || !ser.s.length || ser.s.some(x => !Array.isArray(x) || !/^https:\/\//.test(x[1] || ''))) err(tag, 'every series needs sources as [label, https URL]');
    ser.s && ser.s.forEach(x => style(tag, 'source label', x[0]));
    ser.rows.forEach((r, i) => {
      if (!Number.isInteger(r.v) || r.v <= 0) err(tag, `${r.k}: v must be a positive whole number`);
      const y = Number(String(r.k).replace(/^FY/, '')), y0 = Number(String(ser.rows[0].k).replace(/^FY/, ''));
      if (y !== y0 + i) err(tag, `${r.k}: years must run one after another, oldest first`);
      if (key === 'msft' && !/^FY\d{4}$/.test(r.k)) err(tag, `${r.k}: fiscal years are written FY2026`);
      if (key === 'msft' && r.end !== `30 June ${y}`) err(tag, `${r.k}: end should be "30 June ${y}"`);
      if (key === 'ireland') {
        if (!Number.isInteger(r.total) || r.total <= r.v) err(tag, `${r.k}: total must be a whole number above v`);
        else if (Math.abs(100 * r.v / r.total - r.pct) > 0.5) err(tag, `${r.k}: published share ${r.pct}% does not match ${r.v} of ${r.total} (${(100 * r.v / r.total).toFixed(2)}%)`);
      }
    });
  }
  const M = BODY.msft.rows, I = BODY.ireland.rows, m1 = M[M.length - 1];
  bodyLine.push(`body of the machine: Microsoft ${M[0].k}–${m1.k}, ${m1.k} ${(m1.v / M[0].v).toFixed(3)}× ${M[0].k} and +${(100 * (m1.v / M[M.length - 2].v - 1)).toFixed(1)}% on ${M[M.length - 2].k}` +
    ` · Ireland ${I[0].k}–${I[I.length - 1].k}, ${(I[I.length - 1].v / I[0].v).toFixed(3)}×, share ${I[0].pct}% → ${I[I.length - 1].pct}%`);
}

const by = (f) => EVENTS.reduce((a, e) => { const k = f(e); a[k] = (a[k] || 0) + 1; return a; }, {});
const latest = EVENTS.slice().sort((a, b) => parseD(b.d).y - parseD(a.d).y)[0];
const clipped = EVENTS.filter(e => (e.short || e.t).length > 32).map(e => e.id);
console.log(`${EVENTS.length} milestones · ${EVENTS.filter(e => e.w === 3).length} key · ${EVENTS.filter(e => e.th === 'model').length} model releases · ${EVENTS.filter(e => e.q).length} with Land/Ccru quotes`);
const lanes = by(e => e.th);
console.log('lanes, rim to centre:', THREAD_ORDER.map(k => `${THREADS[k].name} ${lanes[k] || 0}`).join(', '));
console.log(`latest: ${latest.d} ${latest.id}`);
console.log(`${EVENTS.filter(e => parseD(e.d).Y < 1900).length} before 1900 · ${links.size} links under “Elsewhere on the spiral”, shown on ${seeCount.size} cards`);
if (clipped.length) console.log(`titles over 32 characters get an ellipsis on the spiral unless they have short: ${clipped.join(', ')}`);
const fst = FORECASTS.reduce((a, f) => { try { const st = fcStatus(f, now); a[st] = (a[st] || 0) + 1; } catch (x) { /* reported above */ } return a; }, {});
const open = fst.open || 0, closed = fst.closed || 0;
console.log(`${FORECASTS.length} forecasts, counted apart from the milestones · ${open} open · ${FORECASTS.length - open - closed} resolved` +
  (closed ? ` · ${closed} closed with no verdict yet` : '') + ` · as of ${new Date(now).toISOString().slice(0, 10)}`);
const fclip = FORECASTS.filter(f => (f.short || f.t || '').length > 32).map(f => f.id);
if (fclip.length) console.log(`forecast labels over 32 characters get an ellipsis on the spiral: ${fclip.join(', ')}`);
bodyLine.forEach(l => console.log(l));
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ` + warnings.join('\n  '));
if (errors.length) { console.log(`\n${errors.length} error(s):\n  ` + errors.join('\n  ')); process.exit(1); }
console.log('\nno errors');
