use nes::bus::Bus;
use nesrs::memory::Memory;
use nesrs::cpu::CPU;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn check_reset() {
        let mut bus = Bus::new();
        let mut cpu = CPU::new();

        bus.write(0xfffc, 0x10);
        bus.write(0xfffc + 1, 0xc0);

        cpu.reset();

        loop {
            cpu.clock(&mut bus);

            if cpu.done() {
                break;
            }
        }

        // assert_eq!(cpu.cycles, 7);
        assert_eq!(cpu.regs.p, 0x24);
        assert_eq!(cpu.regs.sp, 0xfd);
        assert_eq!(cpu.regs.pc, 0xc010);
    }
}
