import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { Address, TonClient4 } from "ton";
import { indexBlockJettonWallets } from "../engine/indexBlockJettonWallets";
import { Jetton } from "../utils/types";
import { jettons } from "../data/jettons";
import { connectToDB } from "../engine/db";

require("dotenv").config();

async function indexJettonInitially(jetton: Jetton | Jetton[]) {
  await connectToDB();

  const endpoint = await getHttpV4Endpoint();
  const client = new TonClient4({
    // endpoint,
    endpoint: "https://mainnet-v4.tonhubapi.com",
  });

  // setInterval(async () => {
  //   const latestBlock = await client.getLastBlock();
  //   console.log(latestBlock.last.seqno);
  // }, 500);

  const myBlock = 27185603;
  const block = await client.getBlock(myBlock);

  // block.shards.map((s) => {
  //   s.transactions.map(async (t) => {
  //     if (t.account === "EQB0DoQp2pAhewtXz6wSU_ytPKb3vKOKrXJ1A0zBaYIwFbsU") {
  //       let account = await client
  //         .getAccount(myBlock, Address.parse(t.account))
  //         .catch((error) => {
  //           console.log(
  //             "[parseBlock.ts] Error while getting account:" + t.account
  //           );
  //         });
  //       if (account?.account.state.type === "active") {
  //         console.log(account.account.state.code);
  //       }
  //     }
  //   });
  // });

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

const jettonSlug = process.env.npm_config_jettonSlug;
if (jettonSlug) {
  const jettonToIndex = jettons.find((j) => j.slug === jettonSlug);
  if (jettonToIndex) {
    indexJettonInitially(jettonToIndex);
  }
} else {
  indexJettonInitially(jettons);
}
