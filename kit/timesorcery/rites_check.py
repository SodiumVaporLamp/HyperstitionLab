raw = """1::0 [1890]
2::0 [271890] [27541890]
2::1 [1872] [271] [27541]
3::1 [18723] [1872563]
3::2 [23] [27563]
4::0 [41890]
4::1 [187254] [41]
4::2 [2754] [41872] [451872]
4::3 [418723] [4518723] [4563]
5::0 [541890]
5::1 [18725] [541]
5::2 [275] [541872]
5::3 [5418723] [563]
5::4 [418725]
6::1 [187236] [187256]
6::2 [236] [256]
6::4 [4187236] [45187236] [456]
6::5 [54187236] [56]
7::0 [71890] [72541890]
7::1 [187] [71] [72541]
7::3 [723] [72563]
7::4 [4187] [45187] [7254]
7::5 [54187] [725]
7::6 [7236] [7256]
8::0 [890]
8::2 [2718] [275418] [8172]
8::3 [81723] [8172563]
8::4 [418] [4518] [817254]
8::5 [5418] [81725]
8::6 [817236] [817256]
8::7 [718] [725418] [817]
9::1 [189]
9::2 [27189] [2754189]
9::4 [4189] [45189]
9::5 [54189]
9::7 [7189] [7254189]
9::8 [89]"""
def dr(n): return 0 if n==0 else 1+(n-1)%9
twin=lambda z:9-z
trac=lambda z:abs(2*z-9) if z not in (0,9) else 9
gate=lambda z:0 if z==0 else dr(z*(z+1)//2)
def moves(z, last, strict):
    out=[(twin(z),'T')]
    if not strict or last=='T': out.append((trac(z),'C'))
    out.append((gate(z),'G'))
    return out
def paths(a,b,strict):
    res=set()
    def dfs(path,last):
        z=path[-1]
        if z==b and len(path)>1: res.add(''.join(map(str,path))); return
        for nz,m in moves(z,last,strict):
            if nz in path: continue
            dfs(path+[nz],m)
    dfs([a],None)
    return res
def valid(p,strict):
    last=None
    for x,y in zip(p,p[1:]):
        x,y=int(x),int(y); ok=None
        for nz,m in moves(x,last,strict):
            if nz==y: ok=m; break
        if ok is None: return False
        last=ok
    return True
for strict in (False,True):
    allv=0; tot=0; exact=0; extra_total=0; miss_total=0
    for line in raw.splitlines():
        pair,*rs=line.split(); a,b=map(int,pair.split('::'))
        listed={r.strip('[]') for r in rs}
        gen=paths(a,b,strict)|paths(b,a,strict)
        tot+=len(listed); allv+=sum(valid(r,strict) for r in listed)
        miss=listed-gen; extra=gen-listed
        if not miss and not extra: exact+=1
        extra_total+=len(extra); miss_total+=len(miss)
        if strict and (miss or extra): print(pair,'listed',sorted(listed),'missing',sorted(miss),'extra',sorted(extra))
    print('strict' if strict else 'loose', 'valid',allv,'/',tot,'exact demons',exact,'/',len(raw.splitlines()),'extra',extra_total,'missing',miss_total)
