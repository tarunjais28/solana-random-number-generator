import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaRandonNumberGenerator } from "../target/types/solana_randon_number_generator";
import {
  AnchorUtils,
  Queue,
  Randomness,
  SB_ON_DEMAND_PID,
} from "@switchboard-xyz/on-demand";
import { PublicKey, Connection } from "@solana/web3.js";

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

  const generateWithSwitchBoard = async () => {
    const sbQueue = new PublicKey(
      "FfD96yeXs4cxZshoPPSKhSPgVQxLAJUT3gefgh84m1Di"
    );
    const sbProgramId = SB_ON_DEMAND_PID;
    const sbIdl = await anchor.Program.fetchIdl(sbProgramId, provider);
    const sbProgram = new anchor.Program(sbIdl!, provider);

    // setup
    const path = "sb-randomness/target/deploy/sb_randomness-keypair.json";
    const [_, myProgramKeypair] = await AnchorUtils.initWalletFromFile(path);

    const rngKp = anchor.web3.Keypair.generate();
    const [randomness, ix] = await Randomness.create(sbProgram, rngKp, sbQueue);

    // const sbProgram = await SwitchboardProgram.load(
    //   // "mainnet-beta",
    //   new Connection("https://api.devnet.solana.com"),
    // );

    // const aggregatorAccount = new AggregatorAccount(sbProgram, payer.publicKey);

    let generate = await program.methods
      .generateWithSwitchboard()
      .accounts({
        random: pdaRandom,
        // aggregator: aggregatorAccount.publicKey
        randomnessAccountData: randomness.pubkey,
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
    for (let i = 0; i < 1; i++) {
      // Generate random number and store
      await generateAndStore();
      let random = await program.account.random.fetch(pdaRandom);
      console.log(Number(random.number));
      await sleep(1000);
    }
  });

  it("Test Random Number Generator with switchboard", async () => {
    await generateWithSwitchBoard();
    let random = await program.account.random.fetch(pdaRandom);
    console.log(Number(random.number));
  });
});
