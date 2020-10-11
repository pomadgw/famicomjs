export default function d(r){var s=r.ram[r.nextPC()],t=r.ram[s+r.registers.X],a=r.ram[s+r.registers.X+1],e=a<<8|t;return{absoluteAddress:e,clocks:0}}
