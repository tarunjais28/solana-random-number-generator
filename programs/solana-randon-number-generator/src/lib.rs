use crate::{constants::*, events::*, instructions::*, states::*, structs::*};
use anchor_lang::prelude::*;

mod constants;
mod errors;
mod events;
mod instructions;
mod states;
mod structs;

declare_id!("4QTGKkJgNysqKFLjXtmAZvBBH3eKKHgtQa5eBoJu2TpR");

#[program]
pub mod solana_randon_number_generator {
    use super::*;

    pub fn init(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn generate_and_store(ctx: Context<GenerateAndStore>) -> Result<u64> {
        instructions::process_generate_and_store(ctx)
    }
}
