export function TAX(r){return r.registers.X=r.registers.A,r.registers.STATUS.Z=r.registers.X===0,r.registers.STATUS.N=(r.registers.X&128)>0,0}export function TAY(r){return r.registers.Y=r.registers.A,r.registers.STATUS.Z=r.registers.Y===0,r.registers.STATUS.N=(r.registers.Y&128)>0,0}export function TXA(r){return r.registers.A=r.registers.X,r.registers.STATUS.Z=r.registers.A===0,r.registers.STATUS.N=(r.registers.A&128)>0,0}export function TYA(r){return r.registers.A=r.registers.Y,r.registers.STATUS.Z=r.registers.A===0,r.registers.STATUS.N=(r.registers.A&128)>0,0}
