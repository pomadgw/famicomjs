function m(e,a){return F(e)||A(e,a)||M(e,a)||h()}function h(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function M(e,a){if(!e)return;if(typeof e=="string")return b(e,a);var t=Object.prototype.toString.call(e).slice(8,-1);if(t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set")return Array.from(e);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return b(e,a)}function b(e,a){(a==null||a>e.length)&&(a=e.length);for(var t=0,r=new Array(a);t<a;t++)r[t]=e[t];return r}function A(e,a){if(typeof Symbol=="undefined"||!(Symbol.iterator in Object(e)))return;var t=[],r=!0,n=!1,p=void 0;try{for(var l=e[Symbol.iterator](),d;!(r=(d=l.next()).done)&&!(t.push(d.value),a&&t.length===a);r=!0);}catch(y){n=!0,p=y}finally{try{!r&&l.return!=null&&l.return()}finally{if(n)throw p}}return t}function F(e){if(Array.isArray(e))return e}function g(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}function v(e,a){for(var t=0;t<a.length;t++){var r=a[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function W(e,a,t){return a&&v(e.prototype,a),t&&v(e,t),e}function k(e,a){if(e==null)return{};var t=R(e,a),r,n;if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(n=0;n<p.length;n++){if(r=p[n],a.indexOf(r)>=0)continue;if(!Object.prototype.propertyIsEnumerable.call(e,r))continue;t[r]=e[r]}}return t}function R(e,a){if(e==null)return{};var t={},r=Object.keys(e),n,p;for(p=0;p<r.length;p++){if(n=r[p],a.indexOf(n)>=0)continue;t[n]=e[n]}return t}export default function O(e){var a=e.cpuMapReadFn,t=e.cpuMapWriteFn,r=e.ppuMapReadFn,n=e.ppuMapWriteFn,p=e.constructor,l=p===void 0?function(){}:p,d=k(e,["cpuMapReadFn","cpuMapWriteFn","ppuMapReadFn","ppuMapWriteFn","constructor"]),y=function(){function c(s,i){g(this,c),this.prgBankNumber=s,this.chrBankNumber=i,l.bind(this)()}return W(c,[{key:"cpuMapRead",value:function(i){var u=a.apply(this,[i]),o=u.status,f=u.mappedAddress;return{status:o,mappedAddress:f}}},{key:"cpuMapWrite",value:function(i){var u=t.apply(this,[i]),o=u.status,f=u.mappedAddress;return{status:o,mappedAddress:f}}},{key:"ppuMapRead",value:function(i){var u=r.apply(this,[i]),o=u.status,f=u.mappedAddress;return{status:o,mappedAddress:f}}},{key:"ppuMapWrite",value:function(i){var u=n.apply(this,[i]),o=u.status,f=u.mappedAddress;return{status:o,mappedAddress:f}}}]),c}();return Object.entries(d).forEach(function(c){var s=m(c,2),i=s[0],u=s[1];y.prototype[i]=u}),y}
