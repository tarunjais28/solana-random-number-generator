use super::*;

/// Function for generate and store random number
///
/// Emits random number event
pub fn process_generate_with_switchboard(ctx: Context<GenerateWithSwitchBoard>) -> Result<u64> {
    let random = &mut ctx.accounts.random;

    let feed = &ctx.accounts.aggregator.load()?;

    // get result
    let decimal: f64 = feed.get_result()?.try_into()?;

    // check if feed has been updated in the last 5 minutes
    feed.check_staleness(clock::Clock::get().unwrap().unix_timestamp, 300)?;

    // check if feed exceeds a confidence interval of +/i $0.80
    feed.check_confidence_interval(SwitchboardDecimal::from_f64(0.80))?;

    msg!("decimal: {}", decimal);

    // Emit random number event
    emit!(RandomNumberEvent {
        value: random.number
    });

    Ok(random.number)
}

#[derive(Accounts)]
#[instruction()]
pub struct GenerateWithSwitchBoard<'info> {
    #[account(
        mut,
        seeds = [RANDOM_TAG],
        bump,
    )]
    pub random: Account<'info, Random>,

    pub aggregator: AccountLoader<'info, AggregatorAccountData>,
}
