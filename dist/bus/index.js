function v(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function h(t,i){for(var e=0;e<i.length;e++){var u=i[e];u.enumerable=u.enumerable||!1,u.configurable=!0,"value"in u&&(u.writable=!0),Object.defineProperty(t,u.key,u)}}function b(t,i,e){return i&&h(t.prototype,i),e&&h(t,e),t}var m=function(){function t(i,e){v(this,t),this.cpu=i,this.ppu=e,this.cpu.connect(this),this.initVRAM(),this.globalSystemClockNumber=0}return b(t,[{key:"initVRAM",value:function(){var e=this,u=new Uint8Array(65536),f=this,c=new Proxy(u,{get:function(a,r){var s,n=Number(r);if(isNaN(n))return typeof a[r]=="function"?a[r].bind(a):a[r];var l=(s=f.cartridge)===null||s===void 0?void 0:s.cpuRead(n);return l||(n<8192?a[n&2047]:n<16384?e.ppu.cpuRead(n&7):0)},set:function(a,r,s){var n,l=Number(r);if(isNaN(l))a[r]=s;else{if((n=f.cartridge)===null||n===void 0?void 0:n.cpuWrite(l,s))return!0;l<8192?a[r&2047]=s:l<16384&&e.ppu.cpuWrite(l&7,s)}return!0}});this.cpu.ram=c,this.ram=c}},{key:"insertCartridge",value:function(e){this.cartridge=e,this.ppu.insertCartridge(e)}},{key:"reset",value:function(){this.cpu.reset(),this.globalSystemClockNumber=0}},{key:"clock",value:function(){this.ppu.clock(),this.globalSystemClockNumber%3===0&&this.cpu.atomicClock(),this.globalSystemClockNumber+=1}}]),t}();export{m as default};
