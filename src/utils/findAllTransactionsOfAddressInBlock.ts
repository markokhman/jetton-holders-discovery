import { Block } from "./types";
import { Address, TonClient4 } from "ton";
import { sleep } from "./sleep";

export async function findAllTransactionsOfAddressInBlock(
  client: TonClient4,
  block: Block,
  blockId: number,
  address: string
) {
  for (let i = 0; i < block.shards.length; i++) {
    const shard = block.shards[i];

    console.log(
      `[parseBlock.ts] Started to work on shard ${shard.seqno} (${i} of block ${blockId}). Amount of transactions: ${shard.transactions.length}.`
    );

    for (let j = 0; j < shard.transactions.length; j++) {
      const transaction = shard.transactions[j];

      if (transaction.account === address) {
        console.log("Found the address!", blockId);
      }

      await sleep(2000);
    }
  }
}
