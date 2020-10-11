export default function e(r){var t=r.ram[r.nextPC()],d=r.ram[t],a=r.ram[t+1],s=(a<<8|d)+r.registers.Y;return{absoluteAddress:s,clocks:(s&65280)!==a<<8?1:0}}
