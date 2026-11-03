const vm=require('vm'),fs=require('fs');
const ctx={module:{exports:{}},console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data.js','utf8')+'\n'+fs.readFileSync('logic.js','utf8')+'\nmodule.exports.RITES=RITES;',ctx);
const L=ctx.module.exports;
// TX table
const tbl=[];for(let n=1;n<=16;n++)tbl.push(n+'='+L.tx(n));console.log(tbl.join('  '));
console.log('113->',L.tx(113),' 339->',L.tx(339),' 130->',L.tx(130), ' 126->',L.tx(126),' 997->',L.tx(997));
// Land examples
for(const w of L.LAND_NINES)console.log(w,L.aqOf(w),L.plexSteps(L.aqOf(w)).join('>'));
for(const [w] of L.LAND_UNITY)console.log(w,L.aqOf(w),L.plexSteps(L.aqOf(w)).join('>'));
console.log('PN numerals', L.NUMERAL_NAMES.map(w=>w.length).join(','));
// rites all walkable
let ok=0,tot=0;for(const [k,rs] of Object.entries(L.RITES))for(const r of rs){if(!/^[0-9]+$/.test(r.p))continue;tot++;const d=r.p.split('').map(Number);const w=L.walk(d);if(w)ok++;else console.log('BAD',k,r.p);
 const [a,b]=k.split('::').map(Number);const e=[d[0],d[d.length-1]].sort().join();if(e!==[a,b].sort().join())console.log('endpoint mismatch',k,r.p);}
console.log('walkable',ok,'/',tot);
// shortest passages all pairs & compare to published
let pubShort=0,pairs=0;for(let a=0;a<=9;a++)for(let b=0;b<=9;b++){if(a===b)continue;const s=L.shortestPassages(a,b);const d=L.demonBetween(a,b);const pub=(L.RITES[d.key]||[]).map(r=>r.p);pairs++;if(s.some(x=>pub.includes(x)))pubShort++;}
console.log('ordered pairs whose shortest passage is a published rite:',pubShort,'/',pairs);
const r=L.reading('Machine Intelligence',2030,false);console.log(JSON.stringify(r));
const r2=L.reading('The Singularity',2045,false);console.log(r2.demon, r2.back, r2.fwd, r2.rites);
const r3=L.reading('Will to Ice',2026,true);console.log(r3.kLabel,r3.kz,r3.demon&&r3.demon.name,r3.back,r3.fwd);
console.log(L.reachableFrom(3), L.reachableFrom(1));
