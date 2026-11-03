/* The forecasts as one coded table:  node vanishing/codebook.js [--csv FILE] [--now YYYY-MM-DD]
   Prints the Markdown table that FORECASTS.md carries (regenerate it after changing forecasts.js),
   and with --csv also writes the same table as CSV for a spreadsheet. */
const path = require('path'), fs = require('fs');
const { FORECASTS } = require(path.join(__dirname, 'forecasts.js'));
const { fcTimes, fcStatus, fcHorizon } = require(path.join(__dirname, 'logic.js'));
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const now = arg('--now') ? Date.parse(arg('--now') + 'T12:00:00Z') : Date.now();
const ST = { open: 'open', met: 'came true', late: 'came true, late', claimed: 'claimed met (self-judged)', disputed: 'disputed',
             missed: 'missed', none: 'no verdict', closed: 'closed, no verdict yet' };
const target = f => f.type === 'date' ? f.at : f.type === 'window' ? `${f.from} to ${f.to}` :
  f.type === 'spread' ? (f.p10 ? `10% by ${f.p10}, ` : '') + `50% by ${f.p50}` : `by ${f.due}`;
const yrs = y => y >= 2 ? `${Math.round(y * 10) / 10} y` : y >= 1 / 6 ? `${Math.round(y * 12)} mo` : `${Math.round(y * 365.2425)} d`;
const rows = FORECASTS.map(f => {
  const h = fcHorizon(f), st = fcStatus(f, now), o = f.outcome;
  const applies = o && (st === o.is);
  return {
    id: f.id, who: f.who, claim: f.say, source: f.sayc, event: f.event, type: f.type, prob: f.prob || '',
    said: f.made, target: target(f), horizon: Math.abs(h[1] - h[0]) < 0.05 ? yrs(h[0]) : `${yrs(h[0])} to ${yrs(h[1])}`,
    decided: f.decide, outcome: ST[st] + (applies && o.on && st !== 'none' ? ` (${o.on})` : ''),
    judge: applies ? o.judge : (o && o.after ? `from ${o.after}: ${o.judge}` : '')
  };
});
const md = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const cols = [['id', 'id'], ['who', 'Forecaster'], ['claim', 'Verbatim claim'], ['source', 'Where (page, section or time)'], ['event', 'The event, in their terms'],
  ['type', 'Type'], ['prob', 'Probability or hedge'], ['said', 'Said'], ['target', 'Target'], ['horizon', 'Horizon'],
  ['decided', 'How the outcome is decided'], ['outcome', `Outcome (as of ${new Date(now).toISOString().slice(0, 10)})`], ['judge', 'Who judged']];
console.log('| ' + cols.map(c => c[1]).join(' | ') + ' |');
console.log('|' + cols.map(() => '---').join('|') + '|');
for (const r of rows) console.log('| ' + cols.map(c => md(r[c[0]])).join(' | ') + ' |');
const csv = arg('--csv');
if (csv) {
  const q = s => '"' + String(s).replace(/"/g, '""') + '"';
  fs.writeFileSync(csv, '﻿' + [cols.map(c => q(c[1])).join(',')].concat(rows.map(r => cols.map(c => q(r[c[0]])).join(','))).join('\r\n') + '\r\n');
  console.error(`wrote ${rows.length} rows to ${csv}`);
}
