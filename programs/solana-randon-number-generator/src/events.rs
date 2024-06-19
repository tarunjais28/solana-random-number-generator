use super::*;

#[event]
pub struct InitEvent {
    pub number: u64,
}

#[event]
pub struct RandomNumberEvent {
    pub value: u64,
}
