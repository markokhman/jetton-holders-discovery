import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { TonClient4 } from "ton";

import mongoose from "mongoose";
import { indexBlockJettonWallets } from "../engine/processBlock";
import { Jetton } from "../utils/types";
import { sleep } from "../utils/sleep";
import { jettons } from "../data/jettons";

mongoose
  .connect(
    "mongodb+srv://admin:q1hakItPieZdESeM@cluster0.zmgm3fs.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connected!"));

async function indexJettonInitially(jetton: Jetton) {
  const endpoint = await getHttpV4Endpoint();
  const client = new TonClient4({
    endpoint,
  });

  const latestBlock = await client.getLastBlock();

  // TODO: set the depth? or we can specify some fixed genesis block?
  // for (let i = latestBlock.last.seqno; i > 26633229; i--) {
  //   await sleep(2000);
  //   const block = await client.getBlock(i);

  //   console.log("[index.ts] Started to work on block " + i + "...");
  //   await indexBlockJettonWallets(client, block, i, jetton);
  // }
}

// TODO: pass parameter from command line
indexJettonInitially(jettons[0]);
