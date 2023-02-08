import BN from "bn.js";
import { Address, Cell, Slice } from "ton-core";
import { jettons } from "../data/jettons";
import { Jetton } from "../utils/types";

export function parseJettonWalletData(execResult: { result: any[] }) {
  let jettonDetails: {
    balance: BN;
    owner_address: Address;
    master_address: Address;
    jetton: Jetton;
  };

  try {
    const owner_address = (execResult.result[1].cell as Cell)
      .beginParse()
      .loadAddress() as Address;
    const master_address = (execResult.result[2].cell as Cell)
      .beginParse()
      .loadAddress() as Address;

    const jetton = jettons.find(
        (j) => j.masterAddress === master_address.toString()
      ),
      jettonDetails = {
        balance: execResult.result[0].value as BN,
        owner_address,
        master_address,
        jetton: jetton!,
      };

    return jettonDetails;
  } catch (error) {
    console.log("Unable to parse jetton details", error);
    return null;
  }
}
