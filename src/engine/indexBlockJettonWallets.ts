import { Block, Jetton } from "../utils/types";
import { Address, TonClient4 } from "ton";
import { sleep } from "../utils/sleep";
import { parseJettonWalletData } from "./parseJettonWalletData";
import { updateWalletBalanceDB } from "./updateWalletBalanceDB";

// ********** Jetton Wallets Indexer **********
// This function is accepting a full block, blockId and a jetton / an array of jettons
// It is looking through all the block transactions
// and if it finds a transaction that is related to the jetton -
// it finds the jetton wallet owner address (a.k.a. v4) and updates it's jetton balance in the DB

export async function indexBlockJettonWallets(
  client: TonClient4,
  block: Block,
  blockId: number,
  jetton: Jetton | Jetton[]
) {
  if (!(jetton instanceof Array)) {
    jetton = [jetton];
  }

  console.log(
    "[parseBlock.ts] Jettons to index: " + jetton.map((j) => j.slug) + ""
  );

  for (let i = 0; i < block.shards.length; i++) {
    const shard = block.shards[i];

    console.log(
      `[parseBlock.ts] Started to work on shard ${shard.seqno} (${i} of block ${blockId}). Amount of transactions: ${shard.transactions.length}.`
    );

    for (let j = 0; j < shard.transactions.length; j++) {
      const transaction = shard.transactions[j];

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

        const jettonWalletAddress = Address.parse(transaction.account);
        let execResult = await client
          .runMethod(blockId, jettonWalletAddress, "get_wallet_data", [])
          .catch((error) => {
            console.log(
              "[processBlock.ts] Error while getting wallet data from account:" +
                transaction.account
            );
          });
        if (execResult && execResult.exitCode === 0) {
          const jetton_wallet_data = parseJettonWalletData(execResult);

          if (
            jetton_wallet_data &&
            jetton
              .map((j) => j.masterAddress)
              .includes(jetton_wallet_data?.master_address.toString())
          ) {
            await updateWalletBalanceDB(
              jetton_wallet_data.owner_address,
              jetton_wallet_data.jetton,
              jettonWalletAddress,
              jetton_wallet_data.balance
            );
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
