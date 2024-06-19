use super::*;

/// Function for generate and store random number
///
/// Emits random number event
pub fn process_generate_and_store(ctx: Context<GenerateAndStore>) -> Result<u64> {
    let random = &mut ctx.accounts.random;

    random.number = generate_random_number();

    // Emit random number event
    emit!(RandomNumberEvent {
        value: random.number
    });

    Ok(random.number)
}

fn generate_random_number() -> u64 {
    // Seed with the current time (for demonstration purposes)
    let seed = Clock::get()
        .expect("Error getting current timestamp.")
        .unix_timestamp as u64;

    let mut rng = SimpleRng::new(seed);

    // Generate a random number between 0 and 18446744073709551616
    rng.next() % 101
}

#[derive(Accounts)]
#[instruction()]
pub struct GenerateAndStore<'info> {
    #[account(
        mut,
        seeds = [RANDOM_TAG],
        bump,
    )]
    pub random: Account<'info, Random>,
}
