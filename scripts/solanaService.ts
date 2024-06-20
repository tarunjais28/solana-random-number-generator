import * as web3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { AnchorProvider } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import randomIDL from "../target/idl/sb_random_number.json";
import { RANDOM_PROGRAM_ID } from "./constant";
import { SbRandomNumber } from "../target/types/sb_random_number";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as fs from "fs";

export const randomProgramID = new PublicKey(RANDOM_PROGRAM_ID);

export const randomProgramInterface = JSON.parse(JSON.stringify(randomIDL));

const solanaNetwork = web3.clusterApiUrl("devnet");
const opts: any = {
  preflightCommitment: "processed",
};

export const getProvider = (): {
  provider: AnchorProvider;
  connection: web3.Connection;
} => {
  try {
    //Creating a provider, the provider is authenication connection to solana
    const connection = new web3.Connection(
      solanaNetwork,
      opts.preflightCommitment
    );

    /// With config file
    const rawPayerKeypair = JSON.parse(
      fs.readFileSync("/Users/tarunjaiswal/.config/solana/id.json", "utf-8")
    );
    const privateKeyWallet = anchor.web3.Keypair.fromSecretKey(
      Buffer.from(rawPayerKeypair)
    );

    const provider: any = new AnchorProvider(
      connection,
      new NodeWallet(privateKeyWallet),
      opts
    );
    return { provider, connection };
  } catch (error) {
    console.log("provider:solana", error);
    throw error;
  }
};