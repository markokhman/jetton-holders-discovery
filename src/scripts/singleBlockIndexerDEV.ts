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

async function indexJettonInitially(jetton: Jetton | Jetton[]) {
  const endpoint = await getHttpV4Endpoint();
  const client = new TonClient4({
    endpoint,
  });

  const myBlock = 26757740;
  const block = await client.getBlock(myBlock);
  await indexBlockJettonWallets(client, block, myBlock, jetton);

  // if (
  //   [
  //     "EQD5ANCzqaC6K-FhOcSY43TbpnHo_vsGiQ0qj7X3gae5TJ-L",
  //     "EQAC2JuDYXntXF3eHIR64xcPWHnrCGOgsOgXkdFKL6fM3FPh",
  //   ].includes(transaction.account)
  // ) {
  //   console.log("Found it in " + blockId, transaction);
  // }
}

// TODO: pass parameter from command line
indexJettonInitially(jettons);
