export default function r(t){var e=t.ram[t.nextPC()];return e>127&&(e=e-256),{relativeAddress:e,clocks:0}}
