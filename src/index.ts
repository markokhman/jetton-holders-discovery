import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { Address } from "ton-core";
import { TonClient4 } from "ton";

import mongoose from "mongoose";
import { getAllJettonTransactions, sleep } from "./engine/processBlock";

mongoose
  .connect(
    "mongodb+srv://admin:q1hakItPieZdESeM@cluster0.zmgm3fs.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected!"));

async function main() {
  const endpoint = await getHttpV4Endpoint();
  const client = new TonClient4({
    // endpoint: "https://mainnet-v4.tonhubapi.com",
    endpoint,
  });

  const latestBlock = await client.getLastBlock();

  // for (let i = 26633229; i < latestBlock.last.seqno; i++) {
  //   await sleep(3000);
  //   const block = await client.getBlock(i);

  //   console.log("[index.ts] Started to work on block " + i + "...");
  //   await getAllJettonTransactions(client, block);
  // }

  // REVERSE lookup
  // for (let i = latestBlock.last.seqno; i > 26633229; i--) {
  //   await sleep(2000);
  //   const block = await client.getBlock(i);

  //   console.log("[index.ts] Started to work on block " + i + "...");
  //   await getAllJettonTransactions(client, block, i);
  // }

  const myBlock = 26757740;
  const block = await client.getBlock(myBlock);
  await getAllJettonTransactions(client, block, myBlock);
}

main();
