import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaRandonNumberGenerator } from "../target/types/solana_randon_number_generator";

// Create test keypairs
const payer = anchor.web3.Keypair.generate();

// Constant seeds
const RANDOM = Buffer.from("random");

describe("Random Number", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .SolanaRandonNumberGenerator as Program<SolanaRandonNumberGenerator>;

  // Declare PDAs
  var pdaRandom = null;

  const sleep = async (ms = 0): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const confirmTransaction = async (tx) => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
  };

  const generateAndStore = async () => {
    let generate = await program.methods
      .generateAndStore()
      .accounts({
        random: pdaRandom,
      })
      .rpc();

    await confirmTransaction(generate);
  };

  it("Initialize test accounts", async () => {
    // Airdrop sol to the test users
    let payerSol = await provider.connection.requestAirdrop(
      payer.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await confirmTransaction(payerSol);
  });

  it("Initialize global account", async () => {
    [pdaRandom] = await anchor.web3.PublicKey.findProgramAddressSync(
      [RANDOM],
      program.programId
    );

    // Test initialize instruction
    let init = await program.methods
      .init()
      .accounts({
        random: pdaRandom,
        authority: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(init);

    let random = await program.account.random.fetch(pdaRandom);
    console.log(Number(random.number));
  });

  it("Test Random Number Generator", async () => {
    for (let i = 0; i < 20; i++) {
      // Generate random number and store
      await generateAndStore();
      let random = await program.account.random.fetch(pdaRandom);
      console.log(Number(random.number));
      await sleep(1000);
    }
  });
});
