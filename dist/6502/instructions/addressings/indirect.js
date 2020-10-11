export default function s(a){var t=a.ram[a.nextPC()],n=a.ram[a.nextPC()],e=n<<8|t,o=a.ram[e],m=t===255?e&65280:e+1,r=a.ram[m];return{absoluteAddress:r<<8|o,clocks:0}}
