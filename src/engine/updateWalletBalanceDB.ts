import BN from "bn.js";
import { Address } from "ton";
import { Jetton } from "../utils/types";

import mongoose from "../engine/db";

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    walletAddress: String,
    jettons: {
      AMBR: {
        balance: String,
        jettonWalletAddress: String,
      },
      SCALE: {
        balance: String,
        jettonWalletAddress: String,
      },
      BOLT: {
        balance: String,
        jettonWalletAddress: String,
      },
    },
  })
);

export async function updateWalletBalanceDB(
  address: Address,
  jetton: Jetton,
  jettonWalletAddress: Address,
  balance: BN
) {
  if (balance) {
    console.log(
      `[updateWalletBalanceDB.ts] Updating wallet ${address} balance to ${balance.toString()} ${
        jetton.slug
      }`
    );

    User.findOne(
      {
        walletAddress: address.toString(),
      },
      async (err: any, user: any) => {
        if (err) console.log("[updateWaletBalanceDB.ts]", err);
        if (!user) {
          await User.create({
            walletAddress: address.toString(),
            jettons: {
              [jetton.slug]: {
                balance: balance.toString(),
                jettonWalletAddress: jettonWalletAddress.toString(),
              },
            },
          });
        } else {
          user.jettons[jetton.slug] = {
            balance: balance.toString(),
            jettonWalletAddress: jettonWalletAddress.toString(),
          };
          user.save();
        }
      }
    );
  }
}
