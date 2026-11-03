(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const NOW_YEAR = new Date().getFullYear();
  const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
  const andText = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
  /* the years the page accepts that land in zone 0 under a count: worked out, not written in */
  const YEAR_MIN = 1900, YEAR_MAX = 2999;
  function zeroYears(bin) {
    const out = [];
    for (let y = YEAR_MIN; y <= YEAR_MAX; y++) if (dr(kYear(y, bin)) === 0) out.push(y);
    return out;
  }
  function zeroText(bin) {
    const ys = zeroYears(bin);
    if (ys.length === 1) return `${ys[0]} is the only year that lands in zone 0 in this count.`;
    const centuries = ys.every(y => y % 100 === 0);
    return `In this count ${ys.length} of the years from ${YEAR_MIN} to ${YEAR_MAX} land in zone 0` +
      (centuries ? `: every year ending in 00, from ${ys[0]} to ${ys[ys.length - 1]}.` : `: ${andText(ys.map(String))}.`);
  }
  function zeroShort(bin) {
    const ys = zeroYears(bin);
    return ys.length < 3 ? andText(ys.map(String)) : `${ys[0]}, ${ys[1]} … ${ys[ys.length - 1]}`;
  }

  const state = { seed: 'Machine Intelligence', year: 2030, binomic: false, sel: null };
  let R = null;

  const EXAMPLES = [['Machine Intelligence', 2030], ['The Singularity', 2045], ['Will to Ice', 2026], ['Year Zero', 2000], ['Hyperstition', 2030]];
  const SOURCES = {
    futures: () => FUTURES,
    q101: () => Q101_WORDS,
    lab: () => Object.values(LAB_LEXICON).flat()
  };

  function rchip(z) { const r = region(z); return `<span class="rchip"><i class="dot ${r}"></i>zone ${z} · ${REGION_NAME[r]}</span>`; }
  function plexText(steps) { return steps.join(' → '); }
  function plexWorked(n) {
    const out = []; let x = n;
    while (x > 9) { const ds = String(x).split(''); const s = ds.reduce((a, c) => a + (+c), 0); out.push(`${ds.join(' + ')} = ${s}`); x = s; }
    return out;
  }
  function riteName(demonName, r) { return `${demonName} Rt-${r.n}`; }
  function isCrossing(p) { return !!(R.demon && R.demon.syzygetic && p && p.length === 2); }
  function publishedMatch(p) {
    if (!R.demon) return null;
    if (isCrossing(p)) return R.rites.find(x => x.p === 'X') || null;
    const r = R.rites.find(x => x.p === p);
    return r ? r : null;
  }

  /* ---------- passage choice ---------- */
  function defaultPassage() {
    if (!R.demon) return null;
    const pubShort = R.back.find(p => R.publishedBack.includes(p));
    if (pubShort) return pubShort;
    if (R.publishedBack.length) return R.publishedBack[0];
    if (R.back.length) return R.back[0];
    if (R.fwd.length) return R.fwd[0];
    return null;
  }
  function passageLine() {
    if (!R.demon) return 'none needed: same zone';
    const p = state.sel;
    if (!p) return 'no passage connects these zones';
    const d = p.split('').map(Number);
    const dir = (d[0] === R.kz && d[d.length - 1] === R.z) ? 'year → phrase' : 'phrase → year';
    const m = publishedMatch(p);
    if (isCrossing(p)) return `[${p}] ${dir} · ${R.demon.name} Rt-0, the crossing itself`;
    return `[${p}] ${dir}${m ? ` · ${riteName(R.demon.name, m)}` : ''}`;
  }

  /* ---------- the reading in one sentence ---------- */
  function verdict() {
    const P = `“${R.seed}”`, Y = R.year;
    if (!R.demon) return `${P} and ${Y} share zone ${R.z}. No demon stands between them.`;
    const D = R.demon.name, p = state.sel;
    if (!p) return `${D} stands between ${Y} and ${P}, but no passage joins the ${REGION_NAME[R.kRegion]} and the ${REGION_NAME[R.region]}.`;
    const d = p.split('').map(Number), back = d[0] === R.kz;
    const m = publishedMatch(p), via = isCrossing(p) ? `crossing the syzygy it carries, its Rt-0` : (m ? `its rite Rt-${m.n} [${p}]` : `the passage [${p}]`);
    if (back) return `From ${Y}, ${D} reaches ${P} in the ${REGION_NAME[R.region]} by ${via}.`;
    return `Nothing returns from ${Y}. ${D} carries ${P} out to it by ${via}.`;
  }

  /* ---------- summary card ---------- */
  function renderSummary() {
    const shape = R.shape.length ? R.shape.join(' + ') : '0';
    $('#verdict').textContent = verdict().replace(/Rt-/g, 'Rt\u2011');
    $('#sum').innerHTML =
      `<dt>Phrase</dt><dd>${esc(R.seed)} <span class="mono">· ${shape} letters</span></dd>` +
      `<dt>Total</dt><dd><span class="mono">AQ ${plexText(R.steps)}</span><br>${rchip(R.z)}</dd>` +
      `<dt>Year</dt><dd><span class="mono">${R.year} · ${R.kLabel} → ${R.kz}</span><br>${rchip(R.kz)}</dd>` +
      `<dt>Demon</dt><dd>${R.demon ? `${esc(R.demon.name)} <span class="mono">· ${R.demon.key}</span>` : 'none, same zone'}</dd>` +
      `<dt>Passage</dt><dd class="mono">${esc(passageLine()).replace(/Rt-/g, 'Rt&#8209;')}</dd>` +
      `<dt>TX</dt><dd class="mono">${R.txSeed ? esc(R.txSeed) : '—'} · ${R.ticsSeed} tic${R.ticsSeed === 1 ? '' : 's'}</dd>`;
  }

  /* ---------- spiral ---------- */
  const SP = { C: 220, RMAX: 186, R0: 8 };
  function spiralGeom() {
    const bin = state.binomic, kNow = kYear(NOW_YEAR, bin);
    let maxK;
    if (bin) maxK = 99;
    else maxK = Math.min(405, Math.ceil(Math.max(207, R.k + 1, kNow + 1) / 9) * 9);
    const step = (SP.RMAX - SP.R0) / maxK;
    const pos = k => { const th = (-90 + k * 40) * Math.PI / 180, r = k === 0 ? 0 : SP.R0 + k * step; return [SP.C + r * Math.cos(th), SP.C + r * Math.sin(th), th]; };
    return { bin, kNow, maxK, step, pos };
  }
  function drawSpiral() {
    const g = spiralGeom(), { C, RMAX, R0 } = SP;
    let h = '';
    for (let z = 1; z <= 9; z++) {
      const th = (-90 + z * 40) * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
      h += `<line class="spoke" x1="${(C + R0 * c).toFixed(1)}" y1="${(C + R0 * s).toFixed(1)}" x2="${(C + (RMAX + 6) * c).toFixed(1)}" y2="${(C + (RMAX + 6) * s).toFixed(1)}"/>`;
    }
    let d = '';
    for (let t = 0; t <= g.maxK; t += 0.125) { const [x, y] = g.pos(t === 0 ? 0.0001 : t); d += (t ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
    h += `<path class="spline" d="${d}"/>`;
    if (R.k > 0 && R.k <= g.maxK) {
      const k0 = R.k - ((R.k - 1) % 9), k1 = Math.min(k0 + 8, g.maxK);
      let a = '';
      for (let t = k0; t <= k1 + 1e-9; t += 0.125) { const [x, y] = g.pos(Math.min(t, k1)); a += (t === k0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1); }
      h += `<path class="sarm" id="sarm" d="${a}"/>`;
    }
    if (R.z >= 1) {
      const th = (-90 + R.z * 40) * Math.PI / 180;
      h += `<line class="pspoke ${region(R.z)}" x1="${(C + R0 * Math.cos(th)).toFixed(1)}" y1="${(C + R0 * Math.sin(th)).toFixed(1)}" x2="${(C + (RMAX + 6) * Math.cos(th)).toFixed(1)}" y2="${(C + (RMAX + 6) * Math.sin(th)).toFixed(1)}"/>`;
    }
    const ring = g.step * 9, dotR = Math.max(1.5, Math.min(3.4, ring * 0.3));
    for (let k = 1; k <= g.maxK; k++) {
      const [x, y] = g.pos(k), z = dr(k);
      h += `<circle class="sd ${region(z)}" data-k="${k}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotR.toFixed(2)}"><title>${1900 + k} · ${kLabel(k, g.bin)} · zone ${z}</title></circle>`;
    }
    for (let z = 1; z <= 9; z++) {
      const th = (-90 + z * 40) * Math.PI / 180, x = C + (RMAX + 21) * Math.cos(th), y = C + (RMAX + 21) * Math.sin(th);
      h += `<g class="slab ${region(z)}${z === R.z ? ' mine' : ''}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}">${z}</text>${z === R.z ? '<title>Your phrase’s zone</title>' : ''}</g>`;
    }
    h += `<g class="origin"><circle cx="${C}" cy="${C}" r="7.5"/><text x="${C}" y="${C + 3.5}">0</text><title>${zeroShort(g.bin)} · K-00 · zone 0</title></g>`;
    for (const [yr, text] of ANCHORS) {
      const k = kYear(yr, g.bin);
      if (k < 1 || k > g.maxK) continue;
      const [x, y] = g.pos(k);
      h += `<circle class="ring-anchor" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(dotR + 3).toFixed(1)}"><title>${yr} · ${esc(text)}</title></circle>`;
    }
    const label = (k, txt, cls, r) => {
      const [x, y, th] = g.pos(k);
      const lx = k === 0 ? x + 14 : x + Math.cos(th) * (r + 6), ly = k === 0 ? y - 12 : y + Math.sin(th) * (r + 6) + 4;
      const anchor = k === 0 ? 'start' : (Math.cos(th) > 0.25 ? 'start' : (Math.cos(th) < -0.25 ? 'end' : 'middle'));
      return `<text class="${cls} ht" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">${txt}</text>`;
    };
    if (g.kNow >= 0 && g.kNow <= g.maxK && !(g.kNow === R.k)) {
      const [x, y] = g.pos(g.kNow);
      h += `<circle class="ring-now" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(dotR + 5).toFixed(1)}"/>`;
      h += label(g.kNow, `now · ${NOW_YEAR}`, 'nlabel', dotR + 5);
    }
    if (R.demon && R.k > 0 && R.k <= g.maxK && R.z >= 1) {
      const [, , tht] = g.pos(R.k), rt = SP.R0 + R.k * g.step - Math.min(10, g.step * 4.5);
      const a0 = tht * 180 / Math.PI, a1 = -90 + R.z * 40;
      let delta = ((a1 - a0) % 360 + 540) % 360 - 180;
      const sweep = delta > 0 ? 1 : 0, e = a1 * Math.PI / 180;
      const sx = C + rt * Math.cos(tht), sy = C + rt * Math.sin(tht), ex = C + rt * Math.cos(e), ey = C + rt * Math.sin(e);
      h += `<path class="darc" d="M${sx.toFixed(1)},${sy.toFixed(1)} A${rt.toFixed(1)},${rt.toFixed(1)} 0 0 ${sweep} ${ex.toFixed(1)},${ey.toFixed(1)}"/>`;
      const mid = (a0 + delta / 2) * Math.PI / 180, lr = rt + 13;
      const lx = C + lr * Math.cos(mid), ly = C + lr * Math.sin(mid) + 4;
      const anc = Math.cos(mid) > 0.3 ? 'start' : (Math.cos(mid) < -0.3 ? 'end' : 'middle');
      h += `<text class="dlabel ht" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anc}">${esc(R.demon.name)}</text>`;
    }
    if (R.k <= g.maxK) {
      const [x, y] = g.pos(R.k), rr = R.k === 0 ? 11 : dotR + 6;
      h += `<circle class="ring-target" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}"/>`;
      h += label(R.k, `${R.year} · ${R.kLabel}`, 'tlabel', rr);
    }
    $('#spiral').innerHTML = h;
    const arm = $('#sarm');
    if (arm && !reduceMotion && arm.getTotalLength) {
      const L = arm.getTotalLength();
      arm.style.strokeDasharray = `${L} ${L}`;
      arm.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: Math.min(1400, 300 + L * 0.35), easing: 'cubic-bezier(.3,.6,.2,1)' });
    }
    let cap = 'The K-Time spiral. 1900 sits at the centre as K-00, and every later year winds outward, one turn per nine years, on the spoke of its zone. The dark arc is the turn your year falls in, the filled number marks your phrase’s zone, and the dotted arc from your year to that spoke is the demon. Tap a year to read it.';
    if (g.bin) cap = `Counted in two digits, K-Time runs out at 99 and falls back to 00. ${R.year} becomes ${R.kLabel}, in the place of ${1900 + R.k}. The filled number marks your phrase’s zone, and the arc is the demon between them. Tap a year to read it.`;
    else if (R.k > g.maxK) cap += ` ${R.year} lies past the edge of this drawing.`;
    $('#spiral-cap').textContent = cap;
    $('#anchors').innerHTML = ANCHORS.map(([yr, text]) => {
      const k = kYear(yr, g.bin);
      return `<li><span class="y"><button type="button" data-year="${yr}">${yr}</button></span><span class="k">${kLabel(k, g.bin)} → ${dr(k)}</span><span>${esc(text)}</span></li>`;
    }).join('');
  }

  /* ---------- step 1 ---------- */
  function renderI1() {
    const tile = (w, ours) => {
      const v = aqOf(w), st = plexSteps(v);
      return `<div class="nine${ours ? ' ours' : ''}"><span class="w">${esc(w)}</span><span class="v">${plexText(st)}</span></div>`;
    };
    $('#i1').innerHTML = `<div class="nines">${LAND_NINES.map(w => tile(w)).join('')}${tile('CLAUDE OPUS', true)}</div>` +
      '<p class="note">The six solid tiles are Land’s own examples, each totalled in AQ (pp. 284–85). The dashed one is ours: CLAUDE OPUS, the model that built this page, also totals 207, the same as SIGNIFICANCE.</p>';
  }

  /* ---------- step 2 ---------- */
  function tally(n, side) { let s = ''; for (let i = 0; i < Math.min(n, 24); i++) s += '<i></i>'; return `<span class="tally${side === 'l' ? ' l' : ''}" aria-hidden="true">${s}</span>`; }
  function renderI2() {
    const P = [[9, 0], [8, 1], [7, 2], [6, 3], [5, 4]];
    const rows = P.map(([a, b]) => {
      const A = NUMERAL_NAMES[a], B = NUMERAL_NAMES[b];
      return `<div class="pair"><span class="nm r">${A.toUpperCase()}</span>${tally(A.length, 'l')}<span class="plus">+</span>${tally(B.length)}<span class="nm">${B.toUpperCase()}</span><span class="eq">= ${A.length + B.length}</span></div>`;
    }).join('');
    const words = R.seed.split(/[^A-Za-z0-9À-ɏ]+/).filter(w => lettersOf(w).length + (w.match(/[0-9]/g) || []).length > 0).slice(0, 12);
    const shape = words.map(w => {
      const n = lettersOf(w).length + (w.match(/[0-9]/g) || []).length;
      return `<div class="wd">${tally(n)}<span>${esc(w)} · ${n}</span></div>`;
    }).join('');
    const total = R.shape.reduce((a, b) => a + b, 0);
    let extra = '';
    if (R.shape.join(',') === '4,2,3') extra = ' Four, two, three: a Sphinx phrase, like WHAT IS MAN?';
    $('#i2').innerHTML = `<div class="pairs" role="img" aria-label="Each syzygy pair of digit names totals eight letters.">${rows}</div>` +
      `<p class="note">Each pair: three of the nine length combinations (3 + 5, 4 + 4, 5 + 3) make eight. All five pairs: (3/9)<sup>5</sup> = 1/243.</p>` +
      `<div class="shape" aria-label="Letters per word in your phrase">${shape}</div>` +
      `<p class="big">${R.shape.join(' + ') || '0'}${R.shape.length > 1 ? ` = ${total}` : ''} letters</p>` + (extra ? `<p class="note">${extra.trim()}</p>` : '');
  }

  /* ---------- step 3 ---------- */
  function renderI3() {
    const tiles = aqTiles(R.seed);
    const shown = tiles.slice(0, 60);
    $('#i3').innerHTML = `<div class="tiles">${shown.map(t => `<div class="tile"><b>${esc(t.ch)}</b><span>${t.v}</span></div>`).join('')}${tiles.length > 60 ? '<div class="tile"><b>…</b><span></span></div>' : ''}</div>` +
      `<p class="big">${tiles.length <= 12 ? tiles.map(t => t.v).join(' + ') + ' = ' : ''}${R.aq}</p>`;
  }

  /* ---------- step 4 ---------- */
  function renderI4() {
    const s = syzKey(R.z), sy = SYZ[s], tw = twinOf(R.z);
    const worked = plexWorked(R.aq);
    const land = LAND_UNITY.map(([w, n]) => {
      const v = aqOf(w), st = plexSteps(v), p = st[st.length - 1];
      const rel = { UNITY: 'the twin of 1', OPPOSITION: 'twice 2, and the twin of 5', CONJUNCTION: 'confirms 3', COMPLETION: 'the twin of 4' }[w];
      return `<tr><td>${w}</td><td>${n}</td><td>${v}</td><td>${plexText(st)}</td><td class="wrap">${rel}</td></tr>`;
    }).join('');
    $('#i4').innerHTML = `<p class="big">${R.aq}${worked.length ? ' → ' + worked.join(' → ') : ''}</p>` +
      `<p>${rchip(R.z)}</p>` +
      `<p class="note">Syzygy ${s}, carried by ${sy.demon}; its twin is zone ${tw}. The ${sy.current} current runs from this pair to zone ${sy.to}.</p>` +
      `<div class="tbl-wrap"><table><thead><tr><th>Land’s word</th><th>Numerology</th><th>AQ</th><th>Plexed</th><th>His reading</th></tr></thead><tbody>${land}</tbody></table></div>`;
  }

  /* ---------- step 5 ---------- */
  function renderI5() {
    const kFull = kYear(R.year, false), kBin = kYear(R.year, true);
    const zf = dr(kFull), zb = dr(kBin);
    const kNow = kYear(NOW_YEAR, state.binomic), zNow = dr(kNow);
    const pos = kNow === 0 ? 'the origin' : (zNow === 9 ? 'the last year of a turn' : (zNow === 1 ? 'the first year of a turn' : `year ${zNow} of its turn`));
    $('#i5').innerHTML =
      `<div class="tbl-wrap"><table><thead><tr><th>Count</th><th>${R.year}</th><th>Plexed</th><th>Zone</th></tr></thead><tbody>` +
      `<tr${!state.binomic ? ' class="cur"' : ''}><td>Running count</td><td>${kLabel(kFull, false)}</td><td>${plexText(plexSteps(kFull))}</td><td>${rchip(zf)}</td></tr>` +
      `<tr${state.binomic ? ' class="cur"' : ''}><td>Two digits</td><td>${kLabel(kBin, true)}</td><td>${plexText(plexSteps(kBin))}</td><td>${rchip(zb)}</td></tr>` +
      `</tbody></table></div>` +
      `<p class="note">The bold row is the count in use; switch it under the spiral. This year, ${NOW_YEAR}, is ${kLabel(kNow, state.binomic)}: ${pos}. ${zeroText(state.binomic)}</p>`;
  }

  /* ---------- step 6 ---------- */
  function turnYears() {
    const k = R.k;
    if (k === 0) return Array.from({ length: 9 }, (_, i) => R.year + i);
    const p = (k - 1) % 9;
    return Array.from({ length: 9 }, (_, i) => R.year - p + i);
  }
  function renderI6() {
    let card;
    if (!R.demon) {
      card = `<div class="demon"><p class="name">no demon</p><p>Your phrase and your year share zone ${R.z}, so there is no distance to name.</p></div>`;
    } else {
      const d = R.demon;
      const cls = { chronodemon: 'a chronodemon: both zones lie on the Time-Circuit', amphidemon: 'an amphidemon: one zone on the Time-Circuit, one Outside', xenodemon: 'a xenodemon: both zones lie Outside' }[d.cls];
      const lore = demonLore(d.a, d.b), aka = lore ? demonAka(lore, d.name) : [];
      const why = `It stands between zone ${R.z}, your phrase’s, and zone ${R.kz}, your year’s.`;
      card = `<div class="demon"><p class="name">${esc(d.name)}</p><p class="mono">${d.key} · mesh ${pad(d.mesh)}</p>` +
        (lore ? `<p class="lore">${esc(lore.t)} ${esc(lore.r)}</p>` : '') +
        `<p>${why} ${cap1(cls)}.${d.syzygetic ? ` The two zones sum to nine, so ${esc(d.name)} carries a syzygy.` : ''}${d.key === '8::1' ? ' The Ccru’s Zone-8 page calls this demon “the nethermost denizen of time.”' : ''}</p>` +
        (lore ? `<p class="note">${aka.length ? `The Matrix also calls it ${esc(andText(aka))}. ` : ''}Paraphrased from the <a href="${PANDEMONIUM_URL}" target="_blank" rel="noopener">Pandemonium Matrix</a>, mesh ${pad(d.mesh)}.</p>` : '') +
        '</div>';
    }
    const rows = turnYears().map(y => {
      if (y < 1900 || y > 2999) return '';
      const k = kYear(y, state.binomic), zz = dr(k), dm = demonBetween(R.z, zz);
      const back = dm ? shortestPassages(zz, R.z) : [];
      const pubs = dm ? (RITES[dm.key] || []).map(r => r.p) : [];
      const hit = back.find(p => pubs.includes(p));
      const pass = !dm ? '—' : (back.length ? `[${hit || back[0]}]${hit ? ' published' : ''}` : 'none back');
      return `<tr${y === R.year ? ' class="cur"' : ''}><td>${y}</td><td>${kLabel(k, state.binomic)}</td><td><span class="rchip"><i class="dot ${region(zz)}"></i>${zz}<span class="rn"> · ${REGION_NAME[region(zz)]}</span></span></td><td>${dm ? esc(dm.name) : 'same zone'}</td><td>${pass}</td></tr>`;
    }).join('');
    $('#i6').innerHTML = card +
      `<h3 class="ctl-label" style="margin:6px 0 0;font-weight:500">The turn around ${R.year}</h3>` +
      `<div class="tbl-wrap"><table><thead><tr><th>Year</th><th>K</th><th>Zone</th><th>Demon</th><th>Passage back</th></tr></thead><tbody>${rows}</tbody></table></div>` +
      `<p class="note">Nine years pass through all nine zones once. Each row pairs the year with your phrase; “passage back” is the shortest walk from the year’s zone to the phrase’s, marked published when it matches one of that demon’s rites.</p>`;
  }

  /* ---------- step 7: numogram ---------- */
  const ZP = { 6: [150, 92], 3: [250, 92], 7: [118, 262], 2: [56, 262], 8: [282, 262], 1: [344, 262], 5: [168, 402], 4: [232, 402], 9: [150, 532], 0: [250, 532] };
  const CURD = { '8::1': 'M313,258 C270,200 170,190 134,246', '7::2': 'M87,266 C84,330 104,392 146,400', '5::4': 'M200,406 C230,470 352,440 345,285', '6::3': 'M200,90 C206,52 246,48 250,70', '9::0': 'M200,535 C196,576 156,580 150,554' };
  const GATED = { 0: 'M269,524 C300,500 302,566 270,541', 1: 'M363,252 C392,236 392,288 363,272', 2: 'M60,241 C70,170 200,150 238,110', 3: 'M244,110 Q200,142 156,110', 4: 'M251,392 C290,370 318,330 331,279', 5: 'M172,381 C196,300 184,170 156,113', 6: 'M150,113 Q200,176 250,113', 7: 'M136,274 C200,330 280,330 326,276', 8: 'M291,282 C322,420 220,460 162,512', 9: 'M130,524 C98,500 98,566 131,541' };
  const KIND_ORDER = ['twin', 'gate', 'current'];
  function segD(a, b, kind) {
    const [ax, ay] = ZP[a], [bx, by] = ZP[b];
    if (kind === 'twin') return `M${ax},${ay} L${bx},${by}`;
    const src = kind === 'current' ? CURD[syzKey(a)] : GATED[a];
    const m = src.match(/^M\s*([\d.]+),([\d.]+)\s*(.*)$/);
    return `M${ax},${ay} L${m[1]},${m[2]} ${m[3]} L${bx},${by}`;
  }
  function moveText(st) {
    const parts = st.kinds.map(k => k === 'twin' ? `cross the ${syzKey(st.from)} syzygy` : (k === 'current' ? `ride the ${SYZ[syzKey(st.from)].current} current` : `take ${gateLabel(st.from)}`));
    return parts.join(', or ');
  }
  const anim = { raf: 0, path: null, len: 0, visible: true };
  function stopAnim() { if (anim.raf) cancelAnimationFrame(anim.raf); anim.raf = 0; }
  function startAnim() {
    stopAnim();
    const tr = $('#traveler');
    if (reduceMotion || !anim.path || !anim.len || !tr || !anim.visible) return;
    const dur = Math.max(1400, anim.len * 4.2);
    let t0 = null;
    const tick = ts => {
      if (t0 === null) t0 = ts;
      const f = ((ts - t0) % (dur + 700)) / dur;
      const p = anim.path.getPointAtLength(Math.min(1, f) * anim.len);
      tr.setAttribute('cx', p.x.toFixed(1)); tr.setAttribute('cy', p.y.toFixed(1));
      anim.raf = requestAnimationFrame(tick);
    };
    anim.raf = requestAnimationFrame(tick);
  }
  function drawNumo(sel) {
    let h = '<rect class="band warp" x="40" y="44" width="320" height="96" rx="14"/><rect class="band tc" x="16" y="184" width="368" height="276" rx="14"/><rect class="band plex" x="76" y="488" width="248" height="92" rx="14"/>';
    for (const k of Object.keys(CURD)) h += `<path class="base-cur ${region(+k.split('::')[0])}" d="${CURD[k]}"/>`;
    for (const z of [2, 3, 4, 5, 6, 7, 8]) h += `<path class="base-gate" d="${GATED[z]}"/>`;
    for (const [a, b] of [[6, 3], [7, 2], [8, 1], [5, 4], [9, 0]]) h += `<line class="bar" x1="${ZP[a][0]}" y1="${ZP[a][1]}" x2="${ZP[b][0]}" y2="${ZP[b][1]}"/>`;
    let full = '';
    const ends = new Set();
    if (sel) {
      const d = sel.split('').map(Number), w = walk(d);
      ends.add(d[0]); ends.add(d[d.length - 1]);
      if (w) for (const st of w) {
        const kind = KIND_ORDER.find(k => st.kinds.includes(k));
        const sd = segD(st.from, st.to, kind);
        h += `<path class="seg ${kind}" d="${sd}"/>`;
        full += sd + ' ';
      }
    }
    h += '<circle class="traveler" id="traveler" r="6" cx="-20" cy="-20"/>';
    for (let z = 0; z <= 9; z++) {
      const [x, y] = ZP[z];
      h += `<g class="zone ${region(z)}${ends.has(z) ? ' end' : ''}"><circle cx="${x}" cy="${y}" r="21"/><text x="${x}" y="${y + 6}">${z}</text></g>`;
    }
    const tag = (z, t) => { const [x, y] = ZP[z]; return `<text class="nlabel ht" x="${x}" y="${y - 29}" text-anchor="middle">${t}</text>`; };
    if (R.demon) { h += tag(R.kz, 'year'); h += tag(R.z, R.z === R.kz ? 'both' : 'phrase'); }
    h += `<path id="fullpath" d="${full.trim() || 'M0,0'}" fill="none" stroke="none"/>`;
    const svg = $('#numo');
    svg.innerHTML = h;
    anim.path = $('#fullpath');
    anim.len = full ? anim.path.getTotalLength() : 0;
    startAnim();
  }
  function renderI7() {
    const box = $('#i7');
    const legend = '<ul class="legend" aria-label="Moves"><li><svg viewBox="0 0 30 8" aria-hidden="true"><line class="seg twin" x1="2" y1="4" x2="28" y2="4" style="stroke-width:3"/></svg>cross a syzygy</li><li><svg viewBox="0 0 30 8" aria-hidden="true"><line class="seg current" x1="2" y1="4" x2="28" y2="4" style="stroke-width:3"/></svg>ride its current</li><li><svg viewBox="0 0 30 8" aria-hidden="true"><line class="seg gate" x1="2" y1="4" x2="28" y2="4" style="stroke-width:3"/></svg>take a gate</li></ul>';
    if (!R.demon) {
      state.sel = null;
      box.innerHTML = `<div class="numo-wrap"><svg id="numo" viewBox="0 20 400 580" role="img" aria-label="The Numogram with no passage drawn."></svg><div class="stack"><p>Phrase and year share zone ${R.z}. There is no distance, so there is nothing to walk.</p>${legend}</div></div>`;
      drawNumo(null); return;
    }
    const d = R.demon;
    const items = [];
    const pillFor = p => { const m = publishedMatch(p); return isCrossing(p) ? '= Rt-0, the crossing' : (m ? `= Rt-${m.n}` : 'not a published rite'); };
    for (const p of R.back) items.push({ p, label: 'Shortest from the year', pill: pillFor(p), on: !!publishedMatch(p) });
    if (!R.back.length) for (const p of R.fwd) items.push({ p, label: 'Shortest from the phrase', pill: pillFor(p), on: !!publishedMatch(p) });
    const riteRows = R.rites.map(r => {
      if (r.p === 'X') return `<li><button type="button" disabled><span class="p">Rt-${r.n} [X]</span><span class="m">the syzygy itself: a direct crossing</span></button></li>`;
      if (r.p === '?') return `<li><button type="button" disabled><span class="p">Rt-${r.n} [?]</span><span class="m">no known path</span></button></li>`;
      const dir = r.dir === 'counter' ? 'year → phrase' : (r.dir === 'chrono' ? 'phrase → year' : '');
      return `<li><button type="button" data-p="${r.p}" aria-pressed="false"><span class="p">Rt-${r.n} [${r.p}]</span><span class="m">${dir}</span></button></li>`;
    }).join('');
    const ours = items.map(it => `<li><button type="button" data-p="${it.p}" aria-pressed="false"><span class="p">[${it.p}]</span><span class="m">${it.label}</span><span class="pill${it.on ? ' on' : ''}">${it.pill}</span></button></li>`).join('');
    let why = '';
    if (!R.back.length && !R.fwd.length) why = `<p class="note">No passage connects zone ${R.kz} and zone ${R.z}. The Warp and the Plex each loop only into themselves, so once a walk enters one it never leaves.${R.rites.some(r => r.p === '?') ? ` The Pandemonium marks ${esc(d.name)}’s rite with a question mark.` : ''}</p>`;
    else if (!R.back.length) why = `<p class="note">Nothing leads back from the year: zone ${R.kz} is in the ${REGION_NAME[region(R.kz)]}, which loops only into itself. The walk from your phrase to the year still works.</p>`;
    else if (R.fwd.length === 0) why = `<p class="note">The walk only runs backwards here: your phrase sits in the ${REGION_NAME[region(R.z)]}, which can be entered but never left.</p>`;
    box.innerHTML = `<div class="numo-wrap"><svg id="numo" viewBox="0 20 400 580" role="img" aria-label="The Numogram with the selected passage drawn."></svg>` +
      `<div class="stack" style="display:grid;gap:12px;min-width:0">` +
      `<div><p class="ctl-label" style="margin:0 0 6px">Shortest passage</p><ul class="rites" id="ours">${ours || '<li class="note">none</li>'}</ul></div>` +
      `<div><p class="ctl-label" style="margin:0 0 6px">${esc(d.name)}’s published rites</p><ul class="rites" id="pub">${riteRows || '<li class="note">none listed</li>'}</ul></div>` +
      `<ol class="moves" id="moves"></ol>${legend}${why}</div></div>`;
    $$('#i7 .rites button[data-p]').forEach(b => b.addEventListener('click', () => selectPassage(b.dataset.p)));
    selectPassage(state.sel && validSel(state.sel) ? state.sel : defaultPassage(), true);
  }
  function validSel(p) {
    if (!p || !R.demon) return false;
    const d = p.split('').map(Number), a = d[0], b = d[d.length - 1];
    return (a === R.kz && b === R.z) || (a === R.z && b === R.kz);
  }
  function selectPassage(p, quiet) {
    state.sel = p || null;
    $$('#i7 .rites button[data-p]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === p)));
    drawNumo(p);
    const mv = $('#moves');
    if (mv) {
      if (p) {
        const w = walk(p.split('').map(Number)) || [];
        mv.innerHTML = w.map(st => `<li>${st.from} → ${st.to} <span class="c">${esc(moveText(st))}</span></li>`).join('');
      } else mv.innerHTML = '';
    }
    if (!quiet) { renderSummary(); renderTransmission(); }
  }

  /* ---------- step 8: tic xenotation ---------- */
  function txMeasure(tree) {
    if (!tree.length) return { r: 5, kids: [] };
    const kids = tree.map(it => {
      if (it === 'tic') return { tic: true, r: 3.6 };
      const m = txMeasure(it.inner);
      return { tic: false, r: m.r + 3.4, m };
    });
    if (kids.length === 1) { kids[0].x = 0; kids[0].y = 0; return { r: kids[0].r, kids }; }
    const n = kids.length, gap = 2.4, maxr = Math.max(...kids.map(k => k.r));
    const Rr = n === 2 ? (kids[0].r + kids[1].r + gap) / 2 : (maxr + gap / 2) / Math.sin(Math.PI / n);
    kids.forEach((k, i) => { const th = Math.PI + i * 2 * Math.PI / n; k.x = Rr * Math.cos(th); k.y = Rr * Math.sin(th); });
    return { r: Math.max(...kids.map(k => Math.hypot(k.x, k.y) + k.r)), kids };
  }
  function txDraw(m, cx, cy, depth) {
    let h = '';
    for (const k of m.kids) {
      const x = cx + k.x, y = cy + k.y;
      if (k.tic) h += `<circle class="tic" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${k.r}"/>`;
      else { h += `<circle class="cell d${Math.min(depth, 3)}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${k.r.toFixed(2)}"/>`; h += txDraw(k.m, x, y, depth + 1); }
    }
    return h;
  }
  function txFigure(n, label) {
    if (n === 0) return `<div class="tx"><span class="lbl">${label} · 0</span><p class="note">Zero has no tic-xenotation: there are no primes to multiply.</p></div>`;
    const tree = txTree(n), str = txString(tree), m = txMeasure(tree);
    const top = tree.length !== 1 ? `<circle class="cell top" cx="0" cy="0" r="${(m.r + 5).toFixed(2)}"/>` : '';
    const r = m.r + 8, vb = `${(-r).toFixed(1)} ${(-r).toFixed(1)} ${(2 * r).toFixed(1)} ${(2 * r).toFixed(1)}`;
    const tics = ticCount(str);
    return `<div class="tx"><span class="lbl">${label} · ${n}</span><svg viewBox="${vb}" role="img" aria-label="${n} in tic-xenotation: ${str || 'empty'}">${top}${txDraw(m, 0, 0, 0)}</svg><span class="str">${str ? esc(str) : '(empty)'}</span><span class="note">${n === 1 ? '1 is the empty mark' : `${tics} tic${tics === 1 ? '' : 's'}`}</span></div>`;
  }
  function renderI8() {
    const same = R.ticsSeed === R.ticsK && R.k > 1;
    $('#i8').innerHTML = `<div class="tx-pair">${txFigure(R.aq, 'Your total')}${txFigure(R.k, `Your year, ${R.kLabel}`)}</div>` +
      `<p class="txkey"><span>● a tic, the number 2</span><span>○ a prime, holding the xenotation of its place among the primes</span></p>` +
      (same ? `<p class="note">The total and the year carry the same number of tics.</p>` : '');
  }

  /* ---------- step 9 ---------- */
  function transmissionText() {
    const kf = kYear(NOW_YEAR, false);
    const line = $('#line').value.trim();
    const rows = [
      `TRANSMISSION · filed ${kLabel(kf, false)} (${NOW_YEAR})`,
      `PHRASE   ${R.seed}`,
      `TOTAL    AQ ${plexText(R.steps)} · zone ${R.z} · ${REGION_NAME[R.region]}`,
      `YEAR     ${R.year} · ${R.kLabel} → ${R.kz} · zone ${R.kz} · ${REGION_NAME[R.kRegion]}${state.binomic ? ' (two-digit count)' : ''}`,
      `DEMON    ${R.demon ? `${R.demon.name} ${R.demon.key} · mesh ${pad(R.demon.mesh)} · ${R.demon.cls}` : 'none · same zone'}`,
      `PASSAGE  ${passageLine()}`,
      `READING  ${verdict()}`,
      `TX       ${R.txSeed || '—'} / ${R.txK === null ? '—' : (R.txK || '(empty)')}`
    ];
    if (line) rows.push(`LINE     “${line}”`);
    rows.push('via Time-Sorcery');
    return rows.join('\n');
  }
  function renderTransmission() { $('#tm').textContent = transmissionText(); }

  /* ---------- update ---------- */
  function syncChips() {
    $$('#examples .chip').forEach(c => {
      const [s, y] = EXAMPLES[+c.dataset.i];
      c.setAttribute('aria-pressed', String(s.toLowerCase() === state.seed.trim().toLowerCase() && y === state.year));
    });
  }
  function update(keepSel) {
    const seedOk = lettersOf(state.seed).length + (state.seed.match(/[0-9]/g) || []).length > 0;
    const y = state.year;
    const err = $('#year-err');
    if (!seedOk) { err.textContent = 'Type a phrase with at least one letter or digit.'; err.hidden = false; return; }
    if (!Number.isInteger(y) || y < 1900 || y > 2999) { err.textContent = 'K-Time counts from 1900. Choose a year from 1900 to 2999.'; err.hidden = false; return; }
    err.hidden = true;
    R = reading(state.seed.trim(), y, state.binomic);
    if (!keepSel || !validSel(state.sel)) state.sel = defaultPassage();
    drawSpiral();
    renderI2(); renderI3(); renderI4(); renderI5(); renderI6(); renderI7();
    renderI8();
    renderSummary(); renderTransmission(); syncChips();
  }
  let timer = 0;
  function soon() { clearTimeout(timer); timer = setTimeout(() => update(false), 120); }
  function setReading(seed, year) {
    if (seed !== undefined) { state.seed = seed; $('#seed').value = seed; }
    if (year !== undefined) { state.year = year; $('#year').value = year; }
    update(false);
  }

  function init() {
    $('#examples').innerHTML = EXAMPLES.map(([s, y], i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="false">${esc(s)} · ${y}</button>`).join('');
    $('#examples').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; const [s, y] = EXAMPLES[+b.dataset.i]; setReading(s, y); });
    $('#seed-form').addEventListener('submit', e => e.preventDefault());
    $('#seed').addEventListener('input', () => { state.seed = $('#seed').value; soon(); });
    $('#year').addEventListener('input', () => { state.year = Math.floor(Number($('#year').value)); soon(); });
    $('#binomic').addEventListener('change', e => { state.binomic = e.target.checked; update(false); });
    $('#draw').addEventListener('click', () => {
      const list = SOURCES[$('#src').value]();
      const pick = list[Math.floor(Math.random() * list.length)];
      setReading(cap1(pick));
    });
    $('#ryear').addEventListener('click', () => setReading(undefined, 2027 + Math.floor(Math.random() * 73)));
    $('#spiral').addEventListener('click', e => {
      const c = e.target.closest('.sd'); if (c) { setReading(undefined, 1900 + Number(c.dataset.k)); return; }
      if (e.target.closest('.origin')) setReading(undefined, 1900);
    });
    $('#anchors').addEventListener('click', e => { const b = e.target.closest('button[data-year]'); if (b) setReading(undefined, Number(b.dataset.year)); });
    $('#line').addEventListener('input', renderTransmission);
    $('#copy').addEventListener('click', () => {
      const text = transmissionText(), msg = $('#copied');
      const fallback = () => {
        const r = document.createRange(); r.selectNodeContents($('#tm'));
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        msg.textContent = 'Selected. Press Ctrl+C or ⌘C to copy.';
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => { msg.textContent = 'Copied.'; }, fallback);
        else fallback();
      } catch (e) { fallback(); }
    });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { for (const en of es) { anim.visible = en.isIntersecting; if (anim.visible) startAnim(); else stopAnim(); } });
      io.observe($('#s7'));
    }
    renderI1();
    update(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
