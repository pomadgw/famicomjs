use nes;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn check_reset() {
        let mut bus = nes::bus::Bus::new();
        let mut cpu = nes::cpu::CPU::new();

        bus.write(0xfffc, 0x10);
        bus.write(0xfffc + 1, 0xc0);

        cpu.reset();

        loop {
            cpu.clock(&mut bus);

            if cpu.sync {
                break;
            }
        }

        assert_eq!(cpu.cycles, 7);
        assert_eq!(cpu.p, 0x24);
        assert_eq!(cpu.sp, 0xfd);
        assert_eq!(cpu.pc, 0xc010);
    }
}
