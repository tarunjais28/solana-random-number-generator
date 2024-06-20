import * as anchor from "@coral-xyz/anchor";
import { RandomnessService } from "@switchboard-xyz/solana-randomness-service";

const provider = anchor.AnchorProvider.env();
const randomnessService = await RandomnessService.fromProvider(provider);

// Create a keypair for our request account. This account will be automatically closed on settlement and
// the rent will be returned to the original payer.
const requestKeypair = anchor.web3.Keypair.generate();

// Start watching for the settled event before triggering the request.
// If on localnet this will fulfill the randomness request for you in the background.
const settledRandomnessEventPromise = randomnessService.awaitSettledEvent(
  requestKeypair.publicKey
);

// your program makes a CPI request to the RandomnessService
const signature = await program.methods
  .requestRandomness()
  .accounts({
    randomnessService: randomnessService.programId,
    randomnessRequest: requestKeypair.publicKey,
    randomnessEscrow: anchor.utils.token.associatedAddress({
      mint: randomnessService.accounts.mint,
      owner: requestKeypair.publicKey,
    }),
    randomnessState: randomnessService.accounts.state,
    randomnessMint: randomnessService.accounts.mint,
    payer: provider.wallet.publicKey,
  })
  .signers([requestKeypair])
  .rpc();

// Await the response from the Switchboard Service
const [settledRandomnessEvent, settledSlot] =
  await settledRandomnessEventPromise;