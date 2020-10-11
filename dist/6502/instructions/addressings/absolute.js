export default function r(t,e){var n=t.ram[t.nextPC()],s=t.ram[t.nextPC()],o=e?t.registers[e]:0,a=(s<<8|n)+o;return{absoluteAddress:a,clocks:e&&(a&65280)!==s<<8?1:0}}
