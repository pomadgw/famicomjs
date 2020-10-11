import{SvelteComponent as ae,append as n,attr as l,binding_callbacks as Y,check_outros as re,create_component as Z,destroy_component as ee,detach as te,element as c,group_outros as ce,init as le,insert as ne,listen as P,mount_component as oe,run_all as ue,safe_not_equal as me,set_data as se,space as g,text as I,transition_in as M,transition_out as U}from"../../web_modules/svelte/internal.js";import{onMount as pe}from"../../web_modules/svelte.js";import fe from"./RAM.js";import de from"./Register.js";import ge from"../cartridge/index.js";import he from"../bus/index.js";import xe from"../6502/cpu.js";import we from"../ppu/index.js";function ie(o){let p,t,e;return t=new fe({props:{ram:o[0].cpu.ram,offsetStart:o[5],offsetEnd:o[5]+48}}),{c(){p=c("div"),Z(t.$$.fragment),l(p,"class","mt-4")},m(s,f){ne(s,p,f),oe(t,p,null),e=!0},p(s,f){const u={};f&1&&(u.ram=s[0].cpu.ram),f&32&&(u.offsetStart=s[5]),f&32&&(u.offsetEnd=s[5]+48),t.$set(u)},i(s){if(e)return;M(t.$$.fragment,s),e=!0},o(s){U(t.$$.fragment,s),e=!1},d(s){s&&te(p),ee(t)}}}function be(o){let p,t,e,s,f,u,R,a,w,h,d,b,D,T,C,j,S,q,_,z,$,i,F=(o[3]?"on":"off")+"",v,J,x,B,K,A,L,N=o[5].toString(16).padStart(4,"0")+"",W,O,G,E,Q,y,H,V;E=new de({props:{registers:o[6]}});let r=o[0].cartridge&&o[4]&&ie(o);return{c(){p=c("div"),t=c("div"),e=c("div"),s=c("canvas"),f=g(),u=c("canvas"),R=g(),a=c("div"),w=c("input"),h=g(),d=c("label"),b=c("input"),D=I(`
        Show RAM content`),T=g(),C=c("button"),C.textContent="Reset",j=g(),S=c("button"),S.textContent="Execute Code Step-by-Step",q=g(),_=c("button"),_.textContent="Execute Code for Whole Frame",z=g(),$=c("button"),i=I("Toggle Emulation: "),v=I(F),J=g(),x=c("div"),B=c("div"),K=I("PC: "),A=c("span"),L=I("$"),W=I(N),O=g(),G=c("div"),Z(E.$$.fragment),Q=g(),r&&r.c(),l(s,"class","hidden"),l(s,"width","256"),l(s,"height","240"),l(u,"width","640"),l(u,"height","480"),l(w,"type","file"),l(b,"type","checkbox"),l(C,"class","ml-2"),l(S,"class","ml-2"),l(_,"class","ml-2"),l($,"class","ml-2"),l(a,"class","flex items-center mt-4"),l(t,"class","flex flex-col flex-2"),l(A,"class","font-mono"),l(x,"class","ml-4 flex-1 flex flex-col"),l(p,"class","flex m-auto p-10")},m(m,k){ne(m,p,k),n(p,t),n(t,e),n(e,s),o[12](s),n(e,f),n(e,u),o[13](u),n(t,R),n(t,a),n(a,w),n(a,h),n(a,d),n(d,b),b.checked=o[4],n(d,D),n(a,T),n(a,C),n(a,j),n(a,S),n(a,q),n(a,_),n(a,z),n(a,$),n($,i),n($,v),n(p,J),n(p,x),n(x,B),n(B,K),n(B,A),n(A,L),n(A,W),n(x,O),n(x,G),oe(E,G,null),n(x,Q),r&&r.m(x,null),y=!0,H||(V=[P(w,"change",o[8]),P(b,"change",o[14]),P(C,"click",o[9]),P(S,"click",o[10]),P(_,"click",o[11]),P($,"click",o[7])],H=!0)},p(m,[k]){k&16&&(b.checked=m[4]),(!y||k&8)&&F!==(F=(m[3]?"on":"off")+"")&&se(v,F),(!y||k&32)&&N!==(N=m[5].toString(16).padStart(4,"0")+"")&&se(W,N);const X={};k&64&&(X.registers=m[6]),E.$set(X),m[0].cartridge&&m[4]?r?(r.p(m,k),k&17&&M(r,1)):(r=ie(m),r.c(),M(r,1),r.m(x,null)):r&&(ce(),U(r,1,1,()=>{r=null}),re())},i(m){if(y)return;M(E.$$.fragment,m),M(r),y=!0},o(m){U(E.$$.fragment,m),U(r),y=!1},d(m){m&&te(p),o[12](null),o[13](null),ee(E),r&&r.d(),H=!1,ue(V)}}}function $e(o,p,t){let e,s,f,u=!1,R,a,w=!0,h=32768,d;e=new he(new xe(),new we());function b(){t(3,u=!u)}async function D(i){const F=i.target.files[0],v=new ge();await v.parse(F),t(0,e.cartridge=v,e),e.insertCartridge(v),e.reset(),t(5,h=e.cpu.registers.PC),t(6,d=e.cpu.registers)}function T(){e.reset(),t(5,h=e.cpu.registers.PC),t(6,d=e.cpu.registers)}function C(){do e.clock();while(!e.cpu.isComplete);do e.clock();while(e.cpu.isComplete);t(5,h=e.cpu.registers.PC),t(6,d=e.cpu.registers),j()}function j(){const i=f.getContext("2d");R.putImageData(e.ppu.getScreen().imageData,0,0),i.imageSmoothingEnabled=!1,i.mozImageSmoothingEnabled=!1,i.webkitImageSmoothingEnabled=!1,i.msImageSmoothingEnabled=!1,i.drawImage(s,0,0,256,240,0,0,512,480)}function S(){do e.clock();while(!e.ppu.isFrameComplete);do e.clock();while(e.cpu.isComplete);t(0,e.ppu.isFrameComplete=!1,e),t(5,h=e.cpu.registers.PC),t(6,d=e.cpu.registers),j()}function q(i){if(u){if(a||(a=i),i-a>=1e3/60){a=i;do e.clock();while(!e.ppu.isFrameComplete);t(0,e.ppu.isFrameComplete=!1,e),t(5,h=e.cpu.registers.PC),t(6,d=e.cpu.registers),j()}requestAnimationFrame(q)}}pe(()=>{R=s.getContext("2d")});function _(i){Y[i?"unshift":"push"](()=>{s=i,t(1,s)})}function z(i){Y[i?"unshift":"push"](()=>{f=i,t(2,f)})}function $(){w=this.checked,t(4,w)}return o.$$.update=()=>{if(o.$$.dirty&8){e:u&&requestAnimationFrame(q)}},[e,s,f,u,w,h,d,b,D,T,C,S,_,z,$]}class ke extends ae{constructor(o){super();le(this,o,$e,be,me,{})}}export default ke;
