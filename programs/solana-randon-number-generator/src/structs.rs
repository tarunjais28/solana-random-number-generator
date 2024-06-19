// Simple linear congruential generator (LCG) for demonstration purposes
pub struct SimpleRng {
    seed: u64,
}

impl SimpleRng {
    pub fn new(seed: u64) -> Self {
        SimpleRng { seed }
    }

    pub fn next(&mut self) -> u64 {
        const A: u64 = 1664525;
        const C: u64 = 1013904223;
        const M: u64 = 2_u64.pow(32);

        self.seed = (A.wrapping_mul(self.seed).wrapping_add(C)) % M;
        (self.seed & 0xFFFF_FFFF) as u64
    }
}
