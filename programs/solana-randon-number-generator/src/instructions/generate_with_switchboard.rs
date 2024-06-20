use errors::CustomError;

use super::*;

/// Function for generate and store random number
///
/// Emits random number event
pub fn process_generate_with_switchboard(ctx: Context<GenerateWithSwitchBoard>) -> Result<u64> {
    let random = &mut ctx.accounts.random;

    // let feed = &ctx.accounts.aggregator.load()?;

    // // get result
    // let decimal: f64 = feed.get_result()?.try_into()?;

    // // check if feed has been updated in the last 5 minutes
    // feed.check_staleness(clock::Clock::get().unwrap().unix_timestamp, 300)?;

    // // check if feed exceeds a confidence interval of +/i $0.80
    // feed.check_confidence_interval(SwitchboardDecimal::from_f64(0.80))?;

    // msg!("decimal: {}", decimal);

    // let randomness_data =
    //     RandomnessAccountData::parse(ctx.accounts.randomness_account_data.data.borrow())
    //         .map_err(|_| CustomError::ErrorParsingRandomAccountData)?;

    let randomness_data = match RandomnessAccountData::parse(ctx.accounts.randomness_account_data.data.borrow()){
        Ok(data) => data,
        Err(err) => panic!("{}", err)
    };

    let random_value = randomness_data
        .get_value(&Clock::get()?)
        .map_err(|_| CustomError::RandomValueNotFound)?;

    msg!("random: {:#?}", random_value);

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

    // pub aggregator: AccountLoader<'info, AggregatorAccountData>,
    
    /// CHECK: The account's data is validated manually within the handler.
    pub randomness_account_data: AccountInfo<'info>,
}
