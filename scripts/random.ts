import * as anchor from "@project-serum/anchor";
import { RandomnessService } from "@switchboard-xyz/solana-randomness-service";
import { randomProgramInterface, getProvider, randomProgramID } from "./solanaService";
import { SbRandomNumber } from "../target/types/sb_random_number";
import { Program } from "@project-serum/anchor";
import { AdminAddress, RANDOM } from "./constant";
import {
  AnchorUtils,
  Queue,
  Randomness,
  SB_ON_DEMAND_PID,
} from "@switchboard-xyz/on-demand";
import { PublicKey, Connection, Transaction, Keypair } from "@solana/web3.js";
import {
  AggregatorAccount,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import * as fs from "fs";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
let program: any = new anchor.Program(
  randomProgramInterface,
  randomProgramID,
  provider
) as Program<SbRandomNumber>;

const [pdaRandom] = anchor.web3.PublicKey.findProgramAddressSync(
  [RANDOM],
  program.programId
);

const sleep = async (ms: number) => {
  return new Promise(r => setTimeout(r, ms));
};

const fetchRandomNumber = async () => {
  let random = await program.account.random.fetch(pdaRandom);
  console.log(Number(random.number));
};

const requestRandomness = async () => {
  const randomnessService = await RandomnessService.fromProvider(provider);

// Create a keypair for our request account. This account will be automatically closed on settlement and
// the rent will be returned to the original payer.
const requestKeypair = anchor.web3.Keypair.generate();

// Start watching for the settled event before triggering the request.
// If on localnet this will fulfill the randomness request for you in the background.
const settledRandomnessEventPromise = randomnessService.awaitSettledEvent(
  requestKeypair.publicKey,
  300
);

// your program makes a CPI request to the RandomnessService
const signature = await program.methods
  .requestRandomness()
  .accounts({
    randomnessService: randomnessService.programId,
    randomnessRequest: requestKeypair.publicKey,
    randomnessEscrow: await anchor.utils.token.associatedAddress({
      mint: randomnessService.accounts.mint,
      owner: requestKeypair.publicKey,
    }),
    randomnessState: randomnessService.accounts.state,
    randomnessMint: randomnessService.accounts.mint,
    payer: provider.wallet.publicKey,
  })
  .signers([requestKeypair])
  .rpc();

  console.log(signature);

// Await the response from the Switchboard Service
const [settledRandomnessEvent, settledSlot] =
  await settledRandomnessEventPromise;

  console.log(settledRandomnessEvent, settledSlot)
};

export {
  fetchRandomNumber,
  requestRandomness,
};
