import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { TonClient4 } from "ton";
import { jettons } from "../data/jettons";
import { indexBlockJettonWallets } from "../engine/processBlock";
import { Block } from "../utils/types";

async function startRealTimeIndexer() {
  const endpoint = await getHttpV4Endpoint();
  const client = new TonClient4({
    endpoint,
  });
  const latestBlock = await client.getLastBlock();

  await realTimeIndexBlock(client, latestBlock.last.seqno);
}

async function realTimeIndexBlock(
  client: TonClient4,
  latestBlockSeqno: number
) {
  const block = await client.getBlock(latestBlockSeqno).catch((e) => {
    console.log(
      "[realTimeIndexer.ts] Failed to get block " +
        latestBlockSeqno +
        ". Retrying in 2 seconds..."
    );
    setTimeout(() => {
      realTimeIndexBlock(client, latestBlockSeqno);
    }, 2000);
  });

  console.log(
    "[realTimeIndexer.ts] Started to work on block " + latestBlockSeqno + "..."
  );
  await indexBlockJettonWallets(
    client,
    block as Block,
    latestBlockSeqno,
    jettons
  );

  realTimeIndexBlock(client, latestBlockSeqno + 1);
}

startRealTimeIndexer();
