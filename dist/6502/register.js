function h(u,t){if(!(u instanceof t))throw new TypeError("Cannot call a class as a function")}function i(u,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(u,n.key,n)}}function v(u,t,e){return t&&i(u.prototype,t),e&&i(u,e),u}export var FLAGS={N:1<<7,V:1<<6,U:1<<5,B:1<<4,D:1<<3,I:1<<2,Z:1<<1,C:1};var y=function(){function u(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;h(this,u),this._status=new Uint8Array([t])}return v(u,[{key:"getStatus",value:function(e){return(this.status&FLAGS[e])>0}},{key:"setStatus",value:function(e,n){n?this.status=this.status|FLAGS[e]:this.status=this.status&(~FLAGS[e]&255)}},{key:"valueOf",value:function(){return this.status}},{key:"status",get:function(){return this._status[0]},set:function(e){this._status[0]=e}}],[{key:"create",value:function(e){var n=new u(e),l=new Proxy(n,{get:function(s,a){return Object.keys(FLAGS).includes(a)?s.getStatus(a):s[a]},set:function(s,a,f){return Object.keys(FLAGS).includes(a)?s.setStatus(a,f):s[a]=f,!0}});return l}}]),u}();export{y as default};
