function n(r,e){var t=r.registers[e]-r.fetched;return r.registers.STATUS.C=t>=0,r.registers.STATUS.Z=t===0,r.registers.STATUS.N=t<0,1}export var CMP=function(e){return n(e,"A")},CPX=function(e){return n(e,"X")},CPY=function(e){return n(e,"Y")};
