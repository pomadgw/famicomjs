export default function t(e){var r=e.ram[e.nextPC()],s=e.ram[r],a=e.ram[r+1],d=(a<<8|s)+e.registers.Y;return{absoluteAddress:d,clocks:(d&65280)!==a<<8?1:0}}
