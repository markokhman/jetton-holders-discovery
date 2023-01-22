import { Block, Jetton } from "../utils/types";
import { Address, TonClient4 } from "ton";
import { jettons } from "../data/jettons";
import { sleep } from "../utils/sleep";
import { parseJettonDetails } from "./parseJettonDetails";

export async function indexBlockJettonWallets(
  client: TonClient4,
  block: Block,
  blockId: number,
  jetton: Jetton | Jetton[]
) {
  if (!(jetton instanceof Array)) {
    jetton = [jetton];
  }

  for (let i = 0; i < block.shards.length; i++) {
    const shard = block.shards[i];

    console.log(
      `[parseBlock.ts] Started to work on shard ${shard.seqno} (${i} of block ${blockId}). Amount of transactions: ${shard.transactions.length}.`
    );

    for (let j = 0; j < shard.transactions.length; j++) {
      const transaction = shard.transactions[j];

      await sleep(2000);

      let account: any;

      account = await client
        .getAccount(blockId, Address.parse(transaction.account))
        .catch((error) => {
          console.log(
            "[parseBlock.ts] Error while getting account:" + transaction.account
          );
        });

      if (
        account?.account.state.type === "active" &&
        jetton.map((j) => j.walletCode).includes(account.account.state.code!)
      ) {
        console.log(
          `Found a jetton wallet with the same code as ${
            jetton.find(
              (j: Jetton) => j.walletCode === account.account.state.code
            )?.slug
          }! Address: ${transaction.account} (block ${blockId})`
        );
        sleep(2000);
        let execResult = await client
          .runMethod(
            blockId,
            Address.parse(transaction.account),
            "get_wallet_data",
            []
          )
          .catch((error) => {
            console.log(
              "[processBlock.ts] Error while getting wallet data from account:" +
                transaction.account
            );
          });
        if (execResult && execResult.exitCode === 0) {
          const jetton_data = parseJettonDetails(execResult);

          if (
            jetton
              .map((j) => j.masterAddress)
              .includes(jetton_data.master_address.toString())
          ) {
            // TODO: fetch jetton balance and save to database
          }
        } else {
          console.log(
            `Failed to get wallet data from account: ${transaction.account} (block ${blockId})`
          );
        }
      }
    }
  }
}
