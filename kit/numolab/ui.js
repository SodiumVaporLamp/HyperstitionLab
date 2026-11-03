(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const fmt = n => Number(n).toLocaleString('en-US');
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const LEX = lexiconList(LEXICON);
  const ALPHA = 'abcdefghijklmnopqrstuvwxyz';
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const sgn = n => n > 0 ? '+' + n : (n < 0 ? '\u2212' + Math.abs(n) : '0');

  /* ---------- masthead ---------- */
  function mast() {
    const v = values('Numogram Lab'), st = plexSteps(v.aq), z = st[st.length - 1], r = region(z);
    $('#mast-readout').innerHTML =
      `<span>AQ ${st.join(' → ')}</span>` +
      `<span class="rchip"><i class="dot ${r}"></i>zone ${z} · ${REGION_NAME[r]}</span>` +
      `<a href="#attractor" data-goto="attractor">${v.aq} also sits in the Ordinal loop every spelled-out number falls into</a>`;
  }

  /* ---------- tabs ---------- */
  const TABS = ['zones', 'alphabet', 'demons', 'loops', 'attractor'];
  const shown = {};
  const onShow = { alphabet: initAlphabet, demons: initDemons, loops: initLoops, attractor: initAttractor };
  function selectTab(t, fromUser) {
    if (!TABS.includes(t)) t = 'zones';
    for (const k of TABS) {
      const b = $('#tab-' + k), p = $('#p-' + k), on = k === t;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      p.hidden = !on;
    }
    if (fromUser) { try { history.replaceState(null, '', '#' + t); } catch (e) { /* view without history */ } }
    if (!shown[t] && onShow[t]) { shown[t] = true; onShow[t](); }
    if (t === 'loops') startTraveler(); else stopTraveler();
  }

  /* ---------- numogram geometry ---------- */
  const ZPOS = { 6: [150, 92], 3: [250, 92], 7: [118, 262], 2: [56, 262], 8: [282, 262], 1: [344, 262], 5: [168, 402], 4: [232, 402], 9: [150, 532], 0: [250, 532] };
  const PAIRS = [[6, 3], [7, 2], [8, 1], [5, 4], [9, 0]];
  const CUR = {
    '8::1': { d: 'M313,258 C270,200 170,190 134,246', at: [224, 194], name: 'Surge', r: 'tc' },
    '7::2': { d: 'M87,266 C84,330 104,392 146,400', at: [60, 356], name: 'Hold', r: 'tc' },
    '5::4': { d: 'M200,406 C230,470 352,440 345,285', at: [366, 372], name: 'Sink', r: 'tc' },
    '6::3': { d: 'M200,90 C206,52 246,48 250,70', at: [230, 42], name: 'Warp current', r: 'warp' },
    '9::0': { d: 'M200,535 C196,576 156,580 150,554', at: [236, 584], name: 'Plex current', r: 'plex' }
  };
  const DLBL = { '6::3': [200, 111, 'warp'], '7::2': [87, 226, 'tc'], '8::1': [330, 226, 'tc'], '5::4': [200, 369, 'tc'], '9::0': [200, 521, 'plex'] };
  const GATE = {
    0: { d: 'M269,524 C300,500 302,566 270,541', at: [322, 556, 'plex'] },
    1: { d: 'M363,252 C392,236 392,288 363,272', at: [370, 304, 'tc'] },
    2: { d: 'M60,241 C70,170 200,150 238,110', at: [132, 160, 'bg'] },
    3: { d: 'M244,110 Q200,142 156,110', at: [176, 137, 'warp'] },
    4: { d: 'M251,392 C290,370 318,330 331,279', at: [304, 356, 'tc'] },
    5: { d: 'M172,381 C196,300 184,170 156,113', at: [210, 300, 'tc'] },
    6: { d: 'M150,113 Q200,176 250,113', at: [238, 149, 'warp'] },
    7: { d: 'M136,274 C200,330 280,330 326,276', at: [244, 334, 'tc'] },
    8: { d: 'M291,282 C322,420 220,460 162,512', at: [258, 472, 'tc'] },
    9: { d: 'M130,524 C98,500 98,566 131,541', at: [90, 584, 'plex'] }
  };

  function buildNumogram() {
    const mk = ['tc', 'warp', 'plex', 'ink', 'muted'].map(k =>
      `<marker id="ar-${k}" class="mk mk-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0.8 L10,5 L0,9.2 z"/></marker>`).join('');
    let h = `<defs>${mk}</defs>`;
    h += '<rect class="band warp" x="12" y="26" width="376" height="124" rx="14"/>' +
         '<rect class="band tc" x="12" y="166" width="376" height="312" rx="14"/>' +
         '<rect class="band plex" x="12" y="494" width="376" height="98" rx="14"/>';
    const rl = (x, y, r, t) => `<circle class="rdot ${r}" cx="${x}" cy="${y - 3.5}" r="3.5"/><text class="rlabel" x="${x + 9}" y="${y}">${t}</text>`;
    h += rl(26, 46, 'warp', 'WARP') + rl(26, 186, 'tc', 'TIME-CIRCUIT') + rl(26, 514, 'plex', 'PLEX');
    h += '<g id="gates-all" hidden>' + Object.keys(GATE).map(z => {
      const g = GATE[z];
      return `<path class="gate" d="${g.d}" marker-end="url(#ar-muted)"/><text class="gate-lbl ht h-${g.at[2]}" x="${g.at[0]}" y="${g.at[1]}">${gateOf(+z).label}</text>`;
    }).join('') + '</g>';
    for (const k of Object.keys(CUR)) {
      const c = CUR[k];
      h += `<path class="current ${c.r}" data-k="${k}" d="${c.d}" marker-end="url(#ar-${c.r})"/><text class="lbl ht h-${c.r}" x="${c.at[0]}" y="${c.at[1]}">${c.name}</text>`;
    }
    for (const [a, b] of PAIRS) {
      const [x1, y1] = ZPOS[a], [x2, y2] = ZPOS[b];
      h += `<line class="bar" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
    for (const k of Object.keys(DLBL)) {
      const [x, y, r] = DLBL[k];
      h += `<text class="lbl dlbl ht h-${r}" x="${x}" y="${y}">${SYZYGIES[k].demon}</text>`;
    }
    for (let z = 0; z <= 9; z++) {
      const [x, y] = ZPOS[z];
      h += `<g class="zone ${region(z)}"><circle cx="${x}" cy="${y}" r="21"/><text x="${x}" y="${y + 6}">${z}</text></g>`;
    }
    h += '<g id="overlay"></g>';
    $('#numo').innerHTML = h;
  }

  function pill(x, y, t) {
    const w = t.length * 6.7 + 16;
    x = Math.min(400 - w / 2 - 4, Math.max(w / 2 + 4, x));
    return `<g class="pill"><rect x="${(x - w / 2).toFixed(1)}" y="${(y - 10).toFixed(1)}" width="${w.toFixed(1)}" height="20" rx="10"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}">${esc(t)}</text></g>`;
  }

  function overlay(za, zb) {
    $('#gates-all').hidden = !$('#all-gates').checked;
    $$('#numo .current').forEach(p => p.classList.remove('lit'));
    let h = '';
    const zs = [];
    if (za != null) zs.push(za);
    if (zb != null && zb !== za) zs.push(zb);
    for (const z of zs) {
      const g = GATE[z];
      h += `<path class="gate on" d="${g.d}" marker-end="url(#ar-ink)"/><text class="gate-lbl on ht h-${g.at[2]}" x="${g.at[0]}" y="${g.at[1]}">${gateOf(z).label}</text>`;
    }
    if (za != null && zb != null && za !== zb) {
      const d = demonBetween(za, zb, 'murrumur');
      const [x1, y1] = ZPOS[za], [x2, y2] = ZPOS[zb];
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      if (d.syzygetic) {
        h += `<line class="hot" x1="${(x1 + ux * 21).toFixed(1)}" y1="${(y1 + uy * 21).toFixed(1)}" x2="${(x2 - ux * 21).toFixed(1)}" y2="${(y2 - uy * 21).toFixed(1)}"/>`;
        const p = document.querySelector(`#numo .current[data-k="${d.a}::${d.b}"]`);
        if (p) p.classList.add('lit');
      } else {
        const sx = x1 + ux * 31, sy = y1 + uy * 31, ex = x2 - ux * 31, ey = y2 - uy * 31;
        h += `<line class="link" x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"/>`;
        h += pill((sx + ex) / 2, (sy + ey) / 2, `${d.name} ${d.a}::${d.b}`);
      }
    }
    if (za != null) {
      const [x, y] = ZPOS[za];
      h += `<circle class="halo" cx="${x}" cy="${y}" r="28"/>`;
    }
    if (zb != null) {
      const [x, y] = ZPOS[zb], same = za === zb;
      h += `<circle class="halo b" cx="${x}" cy="${y}" r="${same ? 34 : 28}"/>`;
    }
    $('#overlay').innerHTML = h;
  }

  /* ---------- zones: the pair card ---------- */
  const CLASS_TEXT = {
    chrono: 'a chronodemon, one of the distances inside the Time-Circuit',
    amphi: 'an amphidemon, a rupture in the Time-Circuit that opens onto the Outside',
    xeno: 'a xenodemon of the outer gulfs'
  };
  function reading(raw) {
    const text = String(raw || '').trim(), v = values(text);
    if (v.n === 0 && v.digits === 0) return null;
    const st = plexSteps(v.aq), z = st[st.length - 1];
    return { text, v, st, z, r: region(z), sz: syzOf(z), g: gateOf(z), cz: cipherZones(v) };
  }
  const andList = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
  /* A and B side by side. Rows that read the same for both span the two columns;
     cipher values the two phrases share are shaded in their zone's colour. */
  function pairTable(ra, rb) {
    const head = (r, k) => {
      const badge = `<span class="badge ${k}" aria-hidden="true">${k.toUpperCase()}</span>`;
      if (!r) return `<th scope="col"><span class="pc-id">${badge}<span class="pc-name empty">Type a phrase</span></span></th>`;
      return `<th scope="col"><span class="pc-id">${badge}<span class="pc-name">${esc(r.text)}</span></span>` +
        `<span class="pc-zone"><i class="dot ${r.r}"></i>zone ${r.z}<span class="pc-reg">${REGION_NAME[r.r]}</span></span></th>`;
    };
    const both = ra && rb;
    const shared = (label, f) => {
      if (both && f(ra) === f(rb)) return `<tr><th scope="row">${label}</th><td colspan="2" class="both">${f(ra)}</td></tr>`;
      return `<tr><th scope="row">${label}</th>${[ra, rb].map(r => r ? `<td>${f(r)}</td>` : '<td class="none">—</td>').join('')}</tr>`;
    };
    const numbers = (label, val, zoneOf, show, cls, withZone = true) => {
      const eq = both && val(ra) === val(rb);
      return `<tr${cls ? ` class="${cls}"` : ''}><th scope="row">${label}</th>${[ra, rb].map(r => {
        if (!r) return '<td class="none">—</td>';
        const z = zoneOf(r), reg = region(z);
        return `<td${eq ? ` class="eq ${reg}"` : ''}><span class="v">${show(r)}</span>` +
          (withZone ? `<span class="z"><i class="dot ${reg}"></i>zone ${z}</span>` : '') + '</td>';
      }).join('')}</tr>`;
    };
    let h = '<caption class="vh">Phrase A and phrase B, reading by reading</caption>' +
      `<colgroup><col class="c-lbl"><col><col></colgroup><thead><tr><td></td>${head(ra, 'a')}${head(rb, 'b')}</tr></thead><tbody>`;
    h += numbers('AQ', r => r.v.aq, r => r.z, r => r.st.join(' → '), 'aq', false);
    h += shared('Syzygy', r => `${r.sz.key} · ${r.sz.demon} · twin zone ${r.sz.twin}`);
    h += shared('Current', r => `${r.sz.current} → zone ${r.sz.to}`);
    h += shared('Gate', r => `${r.g.label} → zone ${r.g.to}`);
    ['ord', 'red', 'rev', 'rred', 'sat'].forEach((c, i) => {
      h += numbers(CIPHER_SHORT[c], r => r.v[c], r => r.cz[c], r => r.v[c], i === 0 ? 'first' : '');
    });
    return h + '</tbody>';
  }
  function between(ra, rb) {
    const el = $('#between');
    let h = '<h3>Between them</h3>';
    if (!ra || !rb) { el.innerHTML = h + '<p class="big">Waiting for two phrases</p>'; return; }
    const twins = ra.v.n === rb.v.n && ra.v.ord === rb.v.ord;
    const eq = CIPHERS6.filter(c => ra.v[c] === rb.v[c]);
    const shared = !twins && eq.length ? ` Equal in ${andList(eq.map(c => `${CIPHER_LONG[c]} (${ra.v[c]})`))}.` : '';
    if (ra.z === rb.z) {
      h += `<p class="big">Same zone · ${ra.z}</p><p>No demon stands between them.${twins ? ' They are exact twins too: the same in Ordinal, Reverse, Satanic and AQ.' : shared}</p>`;
    } else {
      const d = demonBetween(ra.z, rb.z, 'murrumur'), lore = demonLore(d.a, d.b);
      const s = syzOf(d.a);
      const twins = d.syzygetic ? ` <strong>Syzygy twins.</strong> Zones ${d.a} and ${d.b} sum to nine, and the ${s.current} current flows to zone ${s.to}.` : '';
      h += `<p class="big">${esc(d.name)} · ${d.a}::${d.b}</p>` + (lore ? `<p class="pc-lore">${esc(lore.t)}</p>` : '') +
        `<p>Mesh ${pad(d.mesh)}, ${CLASS_TEXT[d.cls]}.${twins}${shared}</p>`;
    }
    el.innerHTML = h;
  }
  /* the cross-cipher note, with its digit example worked out by the same functions the card uses */
  function cipherNote() {
    const ex = 'GPT6', v = values(ex);
    $('#cipher-note').textContent = 'For a phrase of letters alone, Ordinal, Reduction and AQ always agree on the zone. ' +
      'Reverse and Reverse reduction land in its syzygy twin; for a phrase on 9, that twin is 0, which a digital root also writes as 9. ' +
      'Satanic shifts the zone back one step for every letter. ' +
      `Digits break the pattern: AQ counts them at face value and the other ciphers skip them, so ${ex} is AQ ${v.aq} → zone ${dr(v.aq)} but Ordinal ${v.ord} → zone ${dr(v.ord)}. ` +
      'Values the two phrases share are shaded in the card.';
  }
  function buildChips() {
    const box = $('#pair-chips');
    box.innerHTML = EXAMPLE_PAIRS.map(([a, b], i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="false">${esc(a)} / ${esc(b)}</button>`).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      const [x, y] = EXAMPLE_PAIRS[+b.dataset.i];
      $('#in-a').value = x; $('#in-b').value = y; updateZones();
    });
  }
  function syncChips() {
    const a = $('#in-a').value.trim().toLowerCase(), b = $('#in-b').value.trim().toLowerCase();
    $$('#pair-chips .chip').forEach(c => {
      const [x, y] = EXAMPLE_PAIRS[+c.dataset.i];
      c.setAttribute('aria-pressed', String(x.toLowerCase() === a && y.toLowerCase() === b));
    });
  }
  function updateZones() {
    const ra = reading($('#in-a').value), rb = reading($('#in-b').value);
    $('#pair-table').innerHTML = pairTable(ra, rb);
    between(ra, rb);
    overlay(ra ? ra.z : null, rb ? rb.z : null);
    syncChips();
  }

  /* ---------- alphabet ---------- */
  const SYZ_CLASS = { '8::1': 'murrumur', '7::2': 'oddubb', '5::4': 'katak', '6::3': 'djynxx', '9::0': 'plexpair' };
  let ringSel = 6;
  function buildRing() {
    const cx = 200, cy = 200, R = 148, pos = [];
    for (let i = 0; i < 26; i++) {
      const th = (-90 + (i + 0.5) * 360 / 26) * Math.PI / 180;
      pos.push([cx + R * Math.cos(th), cy + R * Math.sin(th), th]);
    }
    let h = '';
    for (let i = 0; i < 13; i++) {
      const j = 25 - i, [x1, y1] = pos[i], [x2] = pos[j], z = dr(aqLetter(ALPHA[i]));
      h += `<line class="chord ${SYZ_CLASS[syzOf(z).key]}" data-p="${i}" x1="${(x1 - 14).toFixed(1)}" y1="${y1.toFixed(1)}" x2="${(x2 + 14).toFixed(1)}" y2="${y1.toFixed(1)}"/>`;
    }
    h += '<text class="ctr ht h-bg" x="200" y="189">G 16 + T 29</text><text class="ctr ht h-bg" x="200" y="219">= 45 = Gt-45</text>';
    for (let i = 0; i < 26; i++) {
      const [x, y, th] = pos[i], c = ALPHA[i], v = aqLetter(c), z = dr(v);
      const vx = cx + (R + 25) * Math.cos(th), vy = cy + (R + 25) * Math.sin(th);
      h += `<text class="lv" x="${vx.toFixed(1)}" y="${(vy + 3.5).toFixed(1)}">${v}</text>`;
      h += `<g class="lt ${region(z)}" data-i="${i}" tabindex="0" role="button" aria-label="${c.toUpperCase()}, AQ ${v}, zone ${z}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13"/><text x="${x.toFixed(1)}" y="${(y + 4.5).toFixed(1)}">${c.toUpperCase()}</text></g>`;
    }
    const svg = $('#ring');
    svg.innerHTML = h;
    const pick = e => { const g = e.target.closest('.lt'); if (!g) return; const i = +g.dataset.i; selectRing(i < 13 ? i : 25 - i); };
    svg.addEventListener('click', pick);
    svg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e); } });
  }
  function selectRing(p) {
    ringSel = p;
    const q = 25 - p;
    $$('#ring .chord').forEach(c => c.classList.toggle('on', +c.dataset.p === p));
    $$('#ring .lt').forEach(g => g.classList.toggle('on', +g.dataset.i === p || +g.dataset.i === q));
    const a = ALPHA[p], b = ALPHA[q], va = aqLetter(a), vb = aqLetter(b), za = dr(va), zb = dr(vb), s = syzOf(za);
    $('#ring-detail').textContent = `${a.toUpperCase()} ${va} (zone ${za}) + ${b.toUpperCase()} ${vb} (zone ${zb}) = 45. ` +
      (za === 9 ? 'Both letters plex to 9, which stands for Uttunul’s 9::0 syzygy: on the diagram the twins are 9 and 0, but a digital root writes 0 as 9.' : `Zones ${za} and ${zb} make ${s.demon}’s syzygy, ${s.key}.`);
  }
  function buildLegend() {
    const groups = ['8::1', '7::2', '5::4', '6::3', '9::0'];
    $('#ring-legend').innerHTML = groups.map(k => {
      const pairs = [];
      for (let i = 0; i < 13; i++) if (syzOf(dr(aqLetter(ALPHA[i]))).key === k) pairs.push(ALPHA[i].toUpperCase() + '/' + ALPHA[25 - i].toUpperCase());
      return `<li><svg viewBox="0 0 26 10" aria-hidden="true"><line class="chord ${SYZ_CLASS[k]}" x1="1" y1="5" x2="25" y2="5"/></svg>${SYZYGIES[k].demon} ${k} · ${pairs.join(', ')}</li>`;
    }).join('');
  }
  function renderZTable() {
    const by = z => ALPHA.split('').filter(c => dr(aqLetter(c)) === z).map(c => c.toUpperCase()).join(' ');
    let h = '<thead><tr><th>Zone</th><th>Letters</th><th>Twin</th><th>Letters</th><th>Syzygy</th></tr></thead><tbody>';
    for (const [a, b] of [[1, 8], [2, 7], [4, 5], [3, 6], [9, 0]]) {
      h += `<tr><td><span class="rchip"><i class="dot ${region(a)}"></i>${a}</span></td><td class="letters">${by(a)}</td>` +
           `<td><span class="rchip"><i class="dot ${region(b)}"></i>${b}</span></td><td class="letters">${b === 0 ? 'none' : by(b)}</td><td>${syzOf(a).demon}</td></tr>`;
    }
    $('#ztable').innerHTML = h + '</tbody>';
  }
  function renderMirror() {
    const t = lettersOf($('#mir-in').value).slice(0, 40), box = $('#mirror');
    if (!t) { box.innerHTML = '<p class="note">Type some letters to mirror.</p>'; return; }
    const m = atbash(t);
    const tiles = s => s.split('').map(c => { const v = aqLetter(c), z = dr(v); return `<div class="tile"><b>${c.toUpperCase()}</b><span>${v}</span><span><i class="dot ${region(z)}"></i>${z}</span></div>`; }).join('');
    const va = values(t).aq, vm = values(m).aq, za = dr(va), zm = dr(vm);
    box.innerHTML =
      `<div class="mirror-row"><div class="tiles">${tiles(t)}</div><div class="sum">AQ ${plexSteps(va).join(' → ')} <span class="rchip"><i class="dot ${region(za)}"></i>zone ${za}</span></div></div>` +
      `<div class="mirror-row"><div class="tiles">${tiles(m)}</div><div class="sum">Mirror AQ ${plexSteps(vm).join(' → ')} <span class="rchip"><i class="dot ${region(zm)}"></i>zone ${zm}</span></div></div>` +
      `<p class="note">${za === 9 ? 'Both totals plex to 9. In arithmetic mod 9, 9 and 0 are one number, so this is Uttunul’s 9::0 syzygy seen from the arithmetic side; on the diagram, 9’s twin is 0.' : `Zones ${za} and ${zm} sum to nine: ${syzOf(za).demon}’s syzygy.`} The two totals add to ${va + vm}, which is 45 × ${t.length}. ${cap(t)} scores ${values(t).rev} in Reverse Ordinal, the same as ${cap(m)} in Ordinal.</p>`;
  }
  function renderGates() {
    let h = '<thead><tr><th>From</th><th>Gate</th><th>Name in AQ</th><th>Plexes</th><th>Opens</th></tr></thead><tbody>';
    for (let z = 0; z <= 9; z++) {
      const g = gateOf(z), v = values(g.label).aq, p = dr(v), ok = p === g.to || (p === 9 && g.to === 0);
      h += `<tr><td>${z}</td><td>${g.label}</td><td>45+${pad(g.n).split('').join('+')} = ${v}</td><td>${p}</td><td>${g.to}${ok ? ' ✓' : ''}</td></tr>`;
    }
    $('#gtable').innerHTML = h + '</tbody>';
  }
  function initAlphabet() {
    buildRing(); buildLegend(); renderZTable(); renderGates();
    $('#mir-in').addEventListener('input', renderMirror);
    renderMirror(); selectRing(ringSel);
  }

  /* ---------- pandemonium ---------- */
  let SPELL = 'murrumur', PMSEL = '8::1';
  const oddsCache = {};
  function pmDetail(d) {
    const st = plexSteps(d.aq);
    let h = `<h3>Selected demon</h3><p class="big">${esc(d.name)} · ${d.a}::${d.b}</p>` +
      `<p>Mesh ${pad(d.mesh)} · home zones ${d.a} and ${d.b === 0 ? '0, written 9' : d.b}</p>` +
      `<p class="mono">AQ ${st.join(' → ')} · ${d.home ? `lands home in zone ${d.zone}` : `lands in zone ${d.zone}, away from ${d.a} and ${d.b}`}</p>`;
    const lore = demonLore(d.a, d.b);
    if (lore) {
      const aka = demonAka(lore, d.name);
      h += `<p>${esc(lore.t)} ${esc(lore.r)}</p>` +
        `<p class="note">${aka.length ? `The Matrix also calls it ${esc(andList(aka))}. ` : ''}Paraphrased from the <a href="${PANDEMONIUM_URL}" target="_blank" rel="noopener">Pandemonium Matrix</a>, mesh ${pad(d.mesh)}.</p>`;
    }
    if (d.a === 8 && d.b === 1) h += '<p class="note">The Ccru glossary spells this demon Murrumur and the Pandemonium table writes Mur Mur. Murrumur plexes home; Mur Mur does not.</p>';
    $('#pm-detail').innerHTML = h;
  }
  function barcode(hits, mw) {
    const set = new Set(hits), x0 = 5, step = 10;
    const bx1 = x0 + mw.start * step - 1, bx2 = x0 + (mw.start + 9) * step + 9;
    let h = `<path class="bracket" d="M${bx1},19 V14 H${bx2} V19"/><text class="blabel" x="${(bx1 + bx2) / 2}" y="10">${mw.count} of ${hits.length}</text>`;
    for (let i = 0; i < 45; i++) h += `<rect class="slot${set.has(i) ? ' on' : ''}" x="${x0 + i * step}" y="22" width="8" height="22" rx="1.5"><title>Mesh ${pad(i)}${set.has(i) ? ': name plexes home' : ''}</title></rect>`;
    for (const t of [0, 10, 20, 30, 40, 44]) h += `<text class="tick" x="${x0 + t * step + 4}" y="58">${pad(t)}</text>`;
    $('#barcode').innerHTML = h;
  }
  function renderDemons() {
    const data = demonsWithHome(SPELL), byKey = new Map(data.map(d => [d.a + '::' + d.b, d]));
    let h = '<div class="hd" aria-hidden="true"></div>';
    for (let b = 0; b <= 8; b++) h += `<div class="hd" aria-hidden="true">${b}</div>`;
    for (let a = 1; a <= 9; a++) {
      h += `<div class="hd" aria-hidden="true">${a}</div>`;
      for (let b = 0; b <= 8; b++) {
        if (b >= a) { h += '<div aria-hidden="true"></div>'; continue; }
        const k = a + '::' + b, d = byKey.get(k);
        h += `<button type="button" class="cell${d.home ? ' home' : ''}" data-k="${k}" aria-pressed="${PMSEL === k}" aria-label="${esc(d.name)}, ${k}, mesh ${pad(d.mesh)}${d.home ? ', name plexes home' : ''}"><span>${pad(d.mesh)}</span><span class="nm">${esc(d.name)}</span>${d.home ? '<i class="mk"></i>' : ''}</button>`;
      }
    }
    $('#pm').innerHTML = h;
    pmDetail(byKey.get(PMSEL));
    const hits = data.filter(d => d.home).map(d => d.mesh), mw = maxWindow(hits, 10);
    barcode(hits, mw);
    if (!(SPELL in oddsCache)) oddsCache[SPELL] = windowOdds(hits.length, mw.count, 10, 20000, 2026);
    const odds = oddsCache[SPELL], N = odds > 0 ? Math.round(1 / odds) : 'many thousand';
    $('#pm-head').textContent = `${hits.length} of 45 names land home`;
    $('#pm-stats').textContent = `Chance expects about ${expectedHome().toFixed(1)}. ` +
      `The densest run of ten meshes, ${pad(mw.start)} to ${pad(mw.start + 9)}, holds ${mw.count} of them. ` +
      `A run that dense turns up by chance about 1 time in ${N}, before allowing for the other ways the list could have been sliced.`;
    pmHits = hits;
    renderMethod(hits.length, mw, odds);
  }
  let pmHits = [];
  const sensCache = {};
  function renderMethod(k, mw, odds) {
    const N = odds > 0 ? fmt(Math.round(1 / odds)) : 'more than 20,000';
    $('#pm-method-body').innerHTML =
      `<p><strong>Expected count.</strong> If each name landed on a zone from 1 to 9 at random, a demon a::b would land home 2 times in 9, once for each of its zones, with zone 0 counted as 9. Uttunul, 9::0, is the exception: both its zones count as 9, so its odds are 1 in 9. Summed over all 45 demons, that gives ${expectedHome().toFixed(1)}. The page finds ${k}.</p>` +
      `<p><strong>The cluster.</strong> The simulation keeps the ${k} demons whose names land home but scatters them across the 45 meshes at random, 20,000 times. Each time it checks all 36 runs of ten consecutive meshes and keeps the densest. A run holding ${mw.count} or more turned up in ${(odds * 100).toFixed(1)}% of the shuffles, about 1 time in ${N}. Because every position is checked, that figure already allows for where the run happens to sit.</p>` +
      `<p><strong>What it leaves out.</strong> Choices made after looking at the data: a run of ten rather than eight or twelve, consecutive meshes rather than some other slice, AQ and digital roots rather than another cipher, and every other pattern that might have caught the eye instead. Each of those makes a striking result easier to find, so fair odds would be less remarkable than 1 in ${N}. The table shows how much the window width alone moves them.</p>` +
      '<div class="tbl-wrap"><table id="pm-sens"><tbody><tr><td>Computing…</td></tr></tbody></table></div><p id="pm-sens-note"></p>';
    fillSens();
  }
  function fillSens() {
    const det = $('#pm-method'), t = $('#pm-sens');
    if (!det || !det.open || !t) return;
    if (!sensCache[SPELL]) {
      sensCache[SPELL] = [6, 8, 10, 12, 15].map(w => {
        const m = maxWindow(pmHits, w);
        const p = w === 10 ? oddsCache[SPELL] : windowOdds(pmHits.length, m.count, w, 10000, 77 + w);
        return { w, count: m.count, start: m.start, p };
      });
    }
    t.innerHTML = '<thead><tr><th>Window</th><th>Densest run</th><th>Meshes</th><th>About 1 in</th></tr></thead><tbody>' +
      sensCache[SPELL].map(r => `<tr${r.w === 10 ? ' class="cur"' : ''}><td>${r.w}</td><td>${r.count} of ${pmHits.length}</td><td>${pad(r.start)}–${pad(r.start + r.w - 1)}</td><td>${r.p > 0 ? fmt(Math.round(1 / r.p)) : 'over 10,000'}</td></tr>`).join('') + '</tbody>';
    const best = sensCache[SPELL].reduce((a, r) => (r.p < a.p ? r : a));
    $('#pm-sens-note').textContent = best.w === 10
      ? 'Ten happens to be the width that makes this cluster look most unusual. Every other width in the table gives less surprising odds.'
      : `The most striking width here is ${best.w}, not ten.`;
  }
  function initDemons() {
    $('#pm').addEventListener('click', e => {
      const c = e.target.closest('.cell'); if (!c) return;
      PMSEL = c.dataset.k;
      $$('#pm .cell').forEach(x => x.setAttribute('aria-pressed', String(x === c)));
      const [a, b] = PMSEL.split('::').map(Number);
      pmDetail(demonsWithHome(SPELL).find(x => x.a === a && x.b === b));
    });
    $$('#p-demons [data-sp]').forEach(b => b.addEventListener('click', () => {
      SPELL = b.dataset.sp;
      $$('#p-demons [data-sp]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      renderDemons();
    }));
    $('#pm-method').addEventListener('toggle', fillSens);
    renderDemons();
  }

  /* ---------- loops ---------- */
  const loopState = { n: 0, raf: 0 };
  function edgePt(node, toward, extra) {
    extra = extra || 2;
    const dx = toward[0] - node.x, dy = toward[1] - node.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const tx = Math.abs(ux) > 1e-6 ? (node.w / 2 + extra) / Math.abs(ux) : Infinity;
    const ty = Math.abs(uy) > 1e-6 ? (node.h / 2 + extra) / Math.abs(uy) : Infinity;
    const t = Math.min(tx, ty);
    return [node.x + ux * t, node.y + uy * t];
  }
  function renderLoop(nodes, title, soft) {
    const hops = loopHops(nodes), n = nodes.length, W = 400, cx = 200, cy = 190, rx = 128, ry = 128;
    const P = nodes.map((nd, i) => {
      const th = (-90 + i * 360 / n) * Math.PI / 180, w = Math.max(64, nd.p.length * 7.25 + 22);
      let x = cx + rx * Math.cos(th);
      const y = cy + ry * Math.sin(th);
      x = Math.min(W - w / 2 - 4, Math.max(w / 2 + 4, x));
      return { x, y, w, h: 30, p: nd.p };
    });
    let edges = '', vals = '';
    for (let i = 0; i < n; i++) {
      const a = P[i], b = P[(i + 1) % n];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = mx - cx, dy = my - cy, dl = Math.hypot(dx, dy) || 1;
      const c = n === 2 ? [cx + (i === 0 ? 1 : -1) * 168, cy] : [mx + dx / dl * (n === 3 ? 54 : 34), my + dy / dl * (n === 3 ? 54 : 34)];
      const s = edgePt(a, c, 2), e = edgePt(b, c, 5);
      edges += `<path class="edge" id="edge-${i}" d="M${s[0].toFixed(1)},${s[1].toFixed(1)} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${e[0].toFixed(1)},${e[1].toFixed(1)}" marker-end="url(#lar)"/>`;
      const lx = 0.25 * s[0] + 0.5 * c[0] + 0.25 * e[0], ly = 0.25 * s[1] + 0.5 * c[1] + 0.25 * e[1];
      const label = String(hops[i].val), bw = label.length * 7 + 14;
      vals += `<g class="val"><rect x="${(lx - bw / 2).toFixed(1)}" y="${(ly - 10).toFixed(1)}" width="${bw}" height="20" rx="10"/><text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}">${label}</text></g>`;
    }
    const nodeSvg = P.map((q, i) =>
      `<g class="loop-node${i === 0 ? ' start' : ''}"><rect x="${(q.x - q.w / 2).toFixed(1)}" y="${(q.y - q.h / 2).toFixed(1)}" width="${q.w.toFixed(1)}" height="${q.h}" rx="6"/><text x="${q.x.toFixed(1)}" y="${(q.y + 4).toFixed(1)}">${esc(q.p)}</text></g>`).join('');
    const svg = $('#loopsvg');
    svg.innerHTML = `<defs><marker id="lar" class="mk mk-ink" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0.8 L10,5 L0,9.2 z"/></marker></defs>${edges}${vals}${nodeSvg}<circle class="traveler" id="traveler" r="5" cx="-20" cy="-20"/>`;
    svg.setAttribute('aria-label', `A loop of ${n} phrases: ${nodes.map(x => x.p).join(', ')}, and back to ${nodes[0].p}.`);
    $('#loop-title').textContent = title;
    $('#loop-steps').innerHTML = hops.map((hp, i) =>
      `<li data-i="${i}">${esc(hp.from)} <span class="c">${CIPHER_SHORT[hp.fromC]} ${hp.val}</span> = ${esc(hp.to)} <span class="c">${CIPHER_SHORT[hp.toC]} ${hp.val}</span>${hp.ok ? '' : ' <strong>(does not close)</strong>'}</li>`).join('');
    $('#loop-soft').hidden = !soft;
    $('#loop-cap').textContent = `${n} steps. The number on each arrow is the value both phrases share; the list names the cipher on each side. The heavier box is where the loop starts.`;
    loopState.n = n;
    startTraveler();
  }
  function startTraveler() {
    stopTraveler();
    if (reduceMotion || $('#p-loops').hidden || !loopState.n) return;
    const paths = [];
    for (let i = 0; i < loopState.n; i++) {
      const p = document.getElementById('edge-' + i);
      if (!p || !p.getTotalLength) return;
      paths.push({ el: p, len: p.getTotalLength() });
    }
    const per = 1300, n = paths.length, steps = $$('#loop-steps li');
    let t0 = null, last = -1;
    const tick = ts => {
      if (t0 === null) t0 = ts;
      const el = (ts - t0) % (per * n), idx = Math.floor(el / per), f = (el - idx * per) / per;
      const pt = paths[idx].el.getPointAtLength(f * paths[idx].len), tr = document.getElementById('traveler');
      if (tr) { tr.setAttribute('cx', pt.x.toFixed(1)); tr.setAttribute('cy', pt.y.toFixed(1)); }
      if (idx !== last) {
        paths.forEach((q, j) => q.el.classList.toggle('on', j === idx));
        steps.forEach((li, j) => li.classList.toggle('on', j === idx));
        last = idx;
      }
      loopState.raf = requestAnimationFrame(tick);
    };
    loopState.raf = requestAnimationFrame(tick);
  }
  function stopTraveler() { if (loopState.raf) cancelAnimationFrame(loopState.raf); loopState.raf = 0; }
  function showCurated(i) {
    const c = CURATED_LOOPS[i];
    $$('#loop-chips .chip').forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    $$('#find-results button').forEach(b => b.setAttribute('aria-pressed', 'false'));
    renderLoop(c.nodes, c.title, !!c.soft);
  }
  let finderResults = [], finderQuery = '';
  function runFinder() {
    const q = $('#find-in').value.trim(), status = $('#find-status'), list = $('#find-results');
    if (!lettersOf(q)) { status.textContent = 'Type a phrase to search from.'; list.innerHTML = ''; return; }
    status.textContent = 'Searching…';
    setTimeout(() => {
      const canon = LEX.list.find(p => p.toLowerCase() === q.toLowerCase()) || q;
      const raw = findLoops(canon, LEX.list, 4, 600);
      raw.sort((x, y) => (scoreLoop(y, LEX.cat) - scoreLoop(x, LEX.cat)) || (x.length - y.length));
      const seen = new Set();
      finderResults = []; finderQuery = canon;
      for (const l of raw) {
        const k = l.map(nd => nd.p.toLowerCase()).join('>');
        if (seen.has(k)) continue;
        seen.add(k); finderResults.push(l);
        if (finderResults.length >= 8) break;
      }
      if (!finderResults.length) {
        status.textContent = `No loops of two to four steps run through “${canon}” in the built-in list. Try another spelling, or a phrase from the Ccru, occult or philosophy canon.`;
        list.innerHTML = '';
        return;
      }
      status.textContent = `${raw.length >= 600 ? 'More than 600' : raw.length} loop${raw.length === 1 ? '' : 's'} found. Showing the ${finderResults.length} best-themed, each with a different sequence of phrases.`;
      list.innerHTML = finderResults.map((l, i) => {
        const cs = [...new Set(l.flatMap(nd => [nd.cin, nd.cout]))].map(c => CIPHER_SHORT[c]).join(', ');
        const s = scoreParts(l, LEX.cat);
        return `<li><button type="button" data-i="${i}" aria-pressed="false"><span>${l.map(nd => esc(nd.p)).join(' → ')} ↺</span><span class="meta">${l.length} steps · ${cs} · score ${sgn(s.total)}: theme ${sgn(s.theme)}, ciphers ${sgn(s.ciphers)}, length ${sgn(s.length)}</span></button></li>`;
      }).join('');
    }, 20);
  }
  function renderVocab() {
    let h = `<p>The finder looks for loops of two to four steps through the ${fmt(LEX.list.length)} built-in phrases listed here, plus the one you type. It hops on Ordinal, Reverse, Satanic and AQ only; the two reductions give such small totals that almost everything would link. Each phrase must leave by a different cipher than it entered. Exact twins can’t share a loop, because a pair of twins closes a loop for free. The search stops at 600 loops.</p>` +
      `<p>Each result shows its score. Every phrase adds the weight of its list, every different cipher the loop uses adds +2, and every step subtracts 1. Ties go to the shorter loop. Your own phrase takes its list’s weight if it’s on one, and 0 if not. The weights are a judgment call, set so that loops made of this subject’s vocabulary rise above loops of everyday words. The five curated loops were chosen by hand from searches like this one.</p>`;
    h += '<ul class="cats">' + CAT_ORDER.map(k => {
      const arr = LEXICON[k] || [];
      return `<li><details class="cat"><summary><span class="wt">${sgn(catWeight(k))}</span> ${esc(CAT_LABELS[k])} · ${arr.length}</summary><p class="phr">${arr.map(esc).join(', ')}</p></details></li>`;
    }).join('') + '</ul>';
    $('#vocab-body').innerHTML = h;
  }
  function initLoops() {
    $('#loop-chips').innerHTML = CURATED_LOOPS.map((c, i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="false">${c.label} · ${esc(c.title)}</button>`).join('');
    $('#loop-chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) showCurated(+b.dataset.i); });
    $('#finder').addEventListener('submit', e => { e.preventDefault(); runFinder(); });
    $('#find-results').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const l = finderResults[+b.dataset.i]; if (!l) return;
      $$('#find-results button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      $$('#loop-chips .chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
      renderLoop(l, `${l.length}-step loop through ${finderQuery}`, false);
    });
    renderVocab();
    showCurated(CURATED_LOOPS.findIndex(c => c.id === 'sphinx'));
    runFinder();
  }

  /* ---------- attractor ---------- */
  const ATT = { c: 'ord', and: false };
  const basinCache = new Map();
  const CIPHER_TITLE = { ord: 'Ordinal', aq: 'AQ', sat: 'Satanic' };
  function zoneChip(x) { const z = dr(x), r = region(z); return `<span class="rchip"><i class="dot ${r}"></i>zone ${z} · ${REGION_NAME[r]}</span>`; }
  function orbitItem(x) { return `<li><span class="num">${fmt(x)}</span>${zoneChip(x)}<span class="nm">${numName(x, ATT.and)}</span></li>`; }
  function renderBars(curKey) {
    const k = ATT.c + '|' + ATT.and;
    if (!basinCache.has(k)) basinCache.set(k, basins(ATT.c, ATT.and, 9999));
    const rows = basinCache.get(k), top = rows.slice(0, 6);
    $('#bars').innerHTML = top.map(r => {
      const pct = r.count / 9999 * 100;
      const zs = r.cycle.map(x => `<i class="dot ${region(dr(x))}"></i>`).join('');
      return `<div class="brow${r.key === curKey ? ' cur' : ''}" title="${fmt(r.count)} of 9,999 starting numbers">` +
        `<div class="lab">${r.cycle.map(fmt).join(' → ')}<span class="zdots" aria-hidden="true">${zs}</span></div>` +
        `<div class="track"><div class="fill" style="width:calc(${pct.toFixed(2)}% * 0.84)"></div><span class="pct">${pct < 0.1 ? '<0.1' : pct.toFixed(1)}%</span></div></div>`;
    }).join('');
    const rest = rows.length - top.length;
    $('#bars-note').textContent = `Share of the starting numbers 1 to 9,999 that end in each loop, largest first${rest > 0 ? `; ${rest} smaller loop${rest === 1 ? '' : 's'} not shown` : ''}. Dots give each member’s zone. The bold row is the loop your start falls into.`;
  }
  function renderAttractor() {
    let n = Math.floor(Number($('#att-n').value));
    if (!Number.isFinite(n) || n < 1) {
      $('#orbit-title').textContent = 'Enter a whole number from 1 up';
      $('#orbit-tail').innerHTML = ''; $('#orbit-loop').innerHTML = ''; $('#orbit-note').textContent = '';
      return;
    }
    n = Math.min(n, 999999999);
    const o = orbitOf(n, ATT.c, ATT.and);
    $('#orbit-title').textContent = `${fmt(n)} in ${CIPHER_TITLE[ATT.c]}${ATT.and ? ', British “and”' : ''}`;
    $('#orbit-tail').innerHTML = o.tail.map(orbitItem).join('');
    $('#orbit-loop').innerHTML = `<h4>Loop · ${o.cycle.length} number${o.cycle.length === 1 ? '' : 's'}</h4><ol class="orbit">${o.cycle.map(orbitItem).join('')}</ol><p class="back">↺ back to ${fmt(o.cycle[0])}</p>`;
    const zs = o.cycle.map(dr), inTC = zs.some(z => TCSET.has(z));
    let note = o.tail.length ? `Enters the loop after ${o.tail.length} step${o.tail.length === 1 ? '' : 's'}. ` : 'Starts inside the loop. ';
    if (o.cycle.length === 1) note += `${fmt(o.cycle[0])} names itself: its spelled-out letters sum to ${fmt(o.cycle[0])}. `;
    note += `Plexed, the loop reads ${zs.join(', ')}${inTC ? '.' : ', so it never enters the Time-Circuit and shuttles between the Warp and the Plex.'}`;
    $('#orbit-note').textContent = note;
    renderBars(rotateToMin(o.cycle).join(','));
  }
  function initAttractor() {
    $('#att-form').addEventListener('submit', e => e.preventDefault());
    $('#att-n').addEventListener('input', renderAttractor);
    $('#att-c').addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      ATT.c = b.dataset.c;
      $$('#att-c .chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      renderAttractor();
    });
    $('#att-and').addEventListener('change', e => { ATT.and = e.target.checked; renderAttractor(); });
    $('#att-rand').addEventListener('click', () => { $('#att-n').value = 1 + Math.floor(Math.random() * 99999); renderAttractor(); });
    renderAttractor();
  }

  /* ---------- boot ---------- */
  function init() {
    mast();
    buildNumogram();
    buildChips();
    cipherNote();
    ['#in-a', '#in-b'].forEach(s => $(s).addEventListener('input', updateZones));
    $('#all-gates').addEventListener('change', updateZones);
    updateZones();
    $$('.rail [role="tab"]').forEach(b => b.addEventListener('click', () => selectTab(b.dataset.tab, true)));
    $('.rail').addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const cur = TABS.findIndex(k => $('#tab-' + k).getAttribute('aria-selected') === 'true');
      const nx = (cur + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
      selectTab(TABS[nx], true);
      $('#tab-' + TABS[nx]).focus();
    });
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-goto]'); if (!a) return;
      e.preventDefault();
      selectTab(a.dataset.goto, true);
      $('.rail').scrollIntoView({ block: 'start' });
    });
    window.addEventListener('hashchange', () => selectTab(location.hash.slice(1), false));
    selectTab(location.hash.slice(1), false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
