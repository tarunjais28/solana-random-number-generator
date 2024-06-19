use super::*;

/// Function to initialize the contract
///
/// Emits init event
pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let random = &mut ctx.accounts.random;

    // Emit init event
    emit!(InitEvent {
        number: random.number
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [RANDOM_TAG],
        bump,
        payer = authority,
        space = std::mem::size_of::<Random>() + 8
    )]
    pub random: Account<'info, Random>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
