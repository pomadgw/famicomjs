export default function t(e){var r=e.ram[e.nextPC()],s=e.ram[r+e.registers.X],a=e.ram[r+e.registers.X+1],d=a<<8|s;return{absoluteAddress:d,clocks:0}}
