export default function f(r,e){var t=r.ram[r.nextPC()],s=r.ram[r.nextPC()],o=e?r.registers[e]:0,a=(s<<8|t)+o;return{absoluteAddress:a,clocks:e&&(a&65280)!==s<<8?1:0}}
