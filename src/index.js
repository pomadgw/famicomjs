import CPU from './6502/cpu'

const canvas = document.querySelector('#canvas')
const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
console.log(canvas)
console.log(cpu)
