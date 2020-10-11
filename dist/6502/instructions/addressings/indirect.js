export default function f(r){var t=r.ram[r.nextPC()],e=r.ram[r.nextPC()],a=e<<8|t,o=r.ram[a],i=t===255?a&65280:a+1,n=r.ram[i];return{absoluteAddress:n<<8|o,clocks:0}}
