import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { TonClient4 } from "ton";
import { jettons } from "../data/jettons";
import { connectToDB } from "../engine/db";
import { indexBlockJettonWallets } from "../engine/indexBlockJettonWallets";
import { sleep } from "../utils/sleep";
import { Block, Jetton } from "../utils/types";

require("dotenv").config();

async function startHistoricalReverseIndexer(jetton: Jetton | Jetton[]) {
  await connectToDB();

  const endpoint = await getHttpV4Endpoint();
  const client = new TonClient4({
    endpoint,
  });
  const latestBlock = await client.getLastBlock();

  await reverseIndexBlock(client, latestBlock.last.seqno, jetton);
}

async function reverseIndexBlock(
  client: TonClient4,
  latestBlockSeqno: number,
  jetton: Jetton | Jetton[]
) {
  const block = await client.getBlock(latestBlockSeqno).catch(async (e) => {
    console.log(
      "[realTimeIndexer.ts] Failed to get block " +
        latestBlockSeqno +
        ". Retrying in 2 seconds..."
    );

    await sleep(2000);
    await reverseIndexBlock(client, latestBlockSeqno, jetton);
  });

  console.log(
    "[realTimeIndexer.ts] Started to work on block " + latestBlockSeqno + "..."
  );

  await indexBlockJettonWallets(
    client,
    block as Block,
    latestBlockSeqno,
    jetton
  );

  await reverseIndexBlock(client, latestBlockSeqno - 1, jetton);
}

const jettonSlug = process.env.npm_config_jettonSlug;
if (jettonSlug) {
  const jettonToIndex = jettons.find((j) => j.slug === jettonSlug);
  if (jettonToIndex) {
    console.log(
      `[realTimeIndexer.ts] Started historical reverse indexer for ${jettonToIndex.slug}`
    );
    startHistoricalReverseIndexer(jettonToIndex);
  }
} else {
  console.log(
    `[realTimeIndexer.ts] Started historical reverse indexer for ${jettons
      .map((j) => j.slug)
      .join(", ")}`
  );
  startHistoricalReverseIndexer(jettons);
}
