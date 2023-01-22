import BN from "bn.js";
import { Address, Slice } from "ton";

export function parseJettonDetails(execResult: { result: any[] }) {
  return {
    balance: execResult.result[0] as BN,
    owner_address: (execResult.result[1] as Slice).loadAddress() as Address,
    master_address: (execResult.result[2] as Slice)?.loadAddress() as Address,
  };
}
