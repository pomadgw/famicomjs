import{SvelteComponent as st,append as t,attr as g,destroy_each as ot,detach as Z,element as r,init as rt,insert as z,noop as tt,safe_not_equal as at,set_data as w,space as x,text as u}from"../../web_modules/svelte/internal.js";import{afterUpdate as lt}from"../../web_modules/svelte.js";import h from"../utils/tohex.js";function et(s,l,e){const o=s.slice();return o[4]=l[e][0],o[5]=l[e][1],o}function nt(s){let l,e=s[4]+"",o,f;return{c(){l=r("span"),o=u(e),g(l,"class",f=s[5])},m(d,i){z(d,l,i),t(l,o)},p(d,i){i&2&&e!==(e=d[4]+"")&&w(o,e),i&2&&f!==(f=d[5])&&g(l,"class",f)},d(d){d&&Z(l)}}}function ct(s){let l,e,o,f,d,i,m,S,k,E,C,F,P=h(s[0]?.A??0)+"",q,G,b,B,H,A,J,X=h(s[0]?.X??0)+"",D,K,T,I,L,U,M,Y=h(s[0]?.Y??0)+"",N,O,j,R,Q,v,W,y=h(s[0]?.SP??0)+"",V,$=s[1],c=[];for(let n=0;n<$.length;n+=1)c[n]=nt(et(s,$,n));return{c(){l=u(`Register:

`),e=r("table"),o=r("tr"),f=r("td"),f.textContent="STATUS",d=x(),i=r("td");for(let n=0;n<c.length;n+=1)c[n].c();m=x(),S=r("tr"),k=r("td"),k.textContent="A",E=x(),C=r("td"),F=u("$"),q=u(P),G=x(),b=r("tr"),B=r("td"),B.textContent="X",H=x(),A=r("td"),J=u("$"),D=u(X),K=x(),T=r("tr"),I=r("td"),I.textContent="Y",L=x(),U=r("td"),M=u("$"),N=u(Y),O=x(),j=r("tr"),R=r("td"),R.textContent="SP",Q=x(),v=r("td"),W=u("$"),V=u(y),g(f,"class","w-1/2"),g(i,"class","font-mono"),g(C,"class","font-mono"),g(A,"class","font-mono"),g(U,"class","font-mono"),g(v,"class","font-mono"),g(e,"class","table-fixed")},m(n,p){z(n,l,p),z(n,e,p),t(e,o),t(o,f),t(o,d),t(o,i);for(let a=0;a<c.length;a+=1)c[a].m(i,null);t(e,m),t(e,S),t(S,k),t(S,E),t(S,C),t(C,F),t(C,q),t(e,G),t(e,b),t(b,B),t(b,H),t(b,A),t(A,J),t(A,D),t(e,K),t(e,T),t(T,I),t(T,L),t(T,U),t(U,M),t(U,N),t(e,O),t(e,j),t(j,R),t(j,Q),t(j,v),t(v,W),t(v,V)},p(n,[p]){if(p&2){$=n[1];let a;for(a=0;a<$.length;a+=1){const _=et(n,$,a);c[a]?c[a].p(_,p):(c[a]=nt(_),c[a].c(),c[a].m(i,null))}for(;a<c.length;a+=1)c[a].d(1);c.length=$.length}p&1&&P!==(P=h(n[0]?.A??0)+"")&&w(q,P),p&1&&X!==(X=h(n[0]?.X??0)+"")&&w(D,X),p&1&&Y!==(Y=h(n[0]?.Y??0)+"")&&w(N,Y),p&1&&y!==(y=h(n[0]?.SP??0)+"")&&w(V,y)},i:tt,o:tt,d(n){n&&Z(l),n&&Z(e),ot(c,n)}}}function it(s,l,e){let{registers:o}=l,f=["N","V","U","B","D","I","Z","C"];function d(m){return o?.STATUS?.[m]?"text-red-500 font-bold":"text-black"}lt(()=>{e(2,f)}),s.$$set=m=>{"registers"in m&&e(0,o=m.registers)};let i;return s.$$.update=()=>{if(s.$$.dirty&4){t:e(1,i=f.map(m=>[m,d(m)]))}},[o,i]}class ft extends st{constructor(s){super();rt(this,s,it,ct,at,{registers:0})}}export default ft;
