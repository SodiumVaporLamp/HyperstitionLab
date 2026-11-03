const vm=require('vm'),fs=require('fs');
const ctx={module:{exports:{}},console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('lexicon.js','utf8')+'\n'+fs.readFileSync('logic.js','utf8')+'\nmodule.exports.LEXICON=LEXICON;',ctx);
const L=ctx.module.exports;
const show=p=>{const v=L.values(p);return `${p}: ord ${v.ord} rev ${v.rev} red ${v.red} rred ${v.rred} sat ${v.sat} aq ${v.aq} zone ${L.dr(v.aq)}`};
['Numogram Lab','Man','Machine','Hell is hot','Xenocosmography','Claude Opus','Übermensch','Gt-21','Gt-00','Gt-45'].forEach(p=>console.log(show(p)));
for(const c of L.CURATED_LOOPS){const h=L.loopHops(c.nodes);console.log(c.id,h.map(x=>`${x.from}[${x.fromC} ${x.val}]=${x.to}[${x.toC}] ${x.ok?'ok':'BAD'}`).join(' | '));}
for(const [c,a] of [['ord',false],['ord',true],['aq',false],['sat',false]]){const b=L.basins(c,a);console.log(c,a,b.slice(0,4).map(x=>x.cycle.join('>')+' '+x.count).join(' ; '));}
console.log('orbit 108 ord', JSON.stringify(L.orbitOf(108,'ord',false)));
for(const s of ['murrumur','murmur']){const d=L.demonsWithHome(s);const hits=d.filter(x=>x.home).map(x=>x.mesh);const mw=L.maxWindow(hits,10);console.log(s,hits.length,hits.join(','),'maxwin',mw.count,'@',mw.start,'p',L.windowOdds(hits.length,mw.count,10,20000,7));}
console.log('expected',L.expectedHome().toFixed(2));
for(let z=0;z<=9;z++){const g=L.gateOf(z);console.log(z,g.label,L.values(g.label).aq,L.dr(L.values(g.label).aq),'->',g.to);}
const {list,cat}=L.lexiconList(L.LEXICON);console.log('lex',list.length);
for(const p of ['Hell is hot','Hyperstition','Mephistopheles','Nick Land','Claude','Will to Ice','Accelerationism']){const t=Date.now();const r=L.findLoops(p,list,4,500);r.sort((a,b)=>L.scoreLoop(b,cat)-L.scoreLoop(a,cat));console.log(p,r.length,(Date.now()-t)+'ms',r.slice(0,3).map(l=>l.map(n=>`${n.p}[${n.cin}>${n.cout}]`).join(' ')).join(' || '));}
console.log(L.atbash('Man'), L.values(L.atbash('Man')).aq, L.values('Man').rev, L.values(L.atbash('Man')).ord);
console.log(L.numName(1086,true), L.numName(251,true));
