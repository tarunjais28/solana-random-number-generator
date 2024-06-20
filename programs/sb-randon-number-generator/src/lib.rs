use solana_randomness_service::SimpleRandomnessV1Account;
use solana_randomness_service::TransactionOptions;
use solana_randomness_service::{
    program::SolanaRandomnessService, ID as SolanaRandomnessServiceID,
};
use switchboard_solana::prelude::*;
use switchboard_solana::utils::get_ixn_discriminator;

declare_id!("7sa84L2M2KmrH7mMfYdRS7V7xVG6XjNEkbP27nBv5qwU");

#[program]
pub mod sb_random_number {
    use super::*;

    pub fn request_randomness(ctx: Context<RequestRandomness>) -> anchor_lang::prelude::Result<()> {
        msg!("Requesting randomness...");

        // 1. Call the randomness service and request a new value
        solana_randomness_service::cpi::simple_randomness_v1(
            CpiContext::new(
                ctx.accounts.randomness_service.to_account_info(),
                solana_randomness_service::cpi::accounts::SimpleRandomnessV1Request {
                    request: ctx.accounts.randomness_request.to_account_info(),
                    escrow: ctx.accounts.randomness_escrow.to_account_info(),
                    state: ctx.accounts.randomness_state.to_account_info(),
                    mint: ctx.accounts.randomness_mint.to_account_info(),
                    payer: ctx.accounts.payer.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    token_program: ctx.accounts.token_program.to_account_info(),
                    associated_token_program: ctx
                        .accounts
                        .associated_token_program
                        .to_account_info(),
                },
            ),
            8, // Request 8 bytes of randomness
            solana_randomness_service::Callback {
                program_id: ID,
                accounts: vec![
                    AccountMeta::new_readonly(ctx.accounts.randomness_state.key(), true).into(),
                    AccountMeta::new_readonly(ctx.accounts.randomness_request.key(), false).into(),
                ],
                ix_data: get_ixn_discriminator("consume_randomness").to_vec(), // TODO: hardcode this discriminator [190,217,49,162,99,26,73,234]
            },
            Some(TransactionOptions {
                compute_units: Some(1_000_000),
                compute_unit_price: Some(100),
            }),
        )?;

        // Here we can emit some event to index our requests

        Ok(())
    }

    // 2. Build the instruction that will be called with the randomness bytes. The randomness bytes Vec will be appended to the end of the ixn data.
    pub fn consume_randomness(
        _ctx: Context<ConsumeRandomness>,
        result: Vec<u8>,
    ) -> anchor_lang::prelude::Result<()> {
        msg!("Randomness received: {:?}", result);
        Ok(())
    }
}

// The request_randomness macro breaks IDL generation. So we'll manually implement.
// #[request_randomness]
#[derive(Accounts)]
pub struct RequestRandomness<'info> {
    /// The Solana Randomness Service program.
    pub randomness_service: Program<'info, SolanaRandomnessService>,

    /// The account that will be created on-chain to hold the randomness request.
    /// Used by the off-chain oracle to pickup the request and fulfill it.
    /// CHECK: todo
    #[account(
        mut,
        signer,
        owner = system_program.key(),
        constraint = randomness_request.data_len() == 0 && randomness_request.lamports() == 0,
    )]
    pub randomness_request: AccountInfo<'info>,

    /// The TokenAccount that will store the funds for the randomness request.
    /// CHECK: todo
    #[account(
        mut,
        owner = system_program.key(),
        constraint = randomness_escrow.data_len() == 0 && randomness_escrow.lamports() == 0,
    )]
    pub randomness_escrow: AccountInfo<'info>,

    /// The randomness service's state account. Responsible for storing the
    /// reward escrow and the cost per random byte.
    #[account(
        seeds = [b"STATE"],
        bump = randomness_state.bump,
        seeds::program = randomness_service.key(),
    )]
    pub randomness_state: Box<Account<'info, solana_randomness_service::State>>,

    /// The token mint to use for paying for randomness requests.
    #[account(address = NativeMint::ID)]
    pub randomness_mint: Account<'info, Mint>,

    /// The account that will pay for the randomness request.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The Solana System program. Used to allocate space on-chain for the randomness_request account.
    pub system_program: Program<'info, System>,

    /// The Solana Token program. Used to transfer funds to the randomness escrow.
    pub token_program: Program<'info, Token>,

    /// The Solana Associated Token program. Used to create the TokenAccount for the randomness escrow.
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct ConsumeRandomness<'info> {
    /// We need to make sure the randomness service signed this requests so it can only be invoked by a PDA and not a user.
    #[account(
        signer,
        seeds = [b"STATE"],
        seeds::program = SolanaRandomnessServiceID,
        bump = randomness_state.bump,
    )]
    pub randomness_state: Box<Account<'info, solana_randomness_service::State>>,

    pub request: Box<Account<'info, SimpleRandomnessV1Account>>,
}