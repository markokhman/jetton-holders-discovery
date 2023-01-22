export type Block = {
  shards: {
    workchain: number;
    seqno: number;
    shard: string;
    rootHash: string;
    fileHash: string;
    transactions: {
      account: string;
      hash: string;
      lt: string;
    }[];
  }[];
};

export type LatestBlock = {
  last: {
    seqno: number;
    shard: string;
    workchain: number;
    fileHash: string;
    rootHash: string;
  };
  init: {
    fileHash: string;
    rootHash: string;
  };
  stateRootHash: string;
  now: number;
};

export type Jetton = {
  masterAddress: string;
  walletCode: string;
  slug: string;
};

export type Account = {
  account: {
    state:
      | {
          type: "uninit";
        }
      | {
          type: "active";
          code: string | null;
          data: string | null;
        }
      | {
          type: "frozen";
          stateHash: string;
        };
    balance: {
      coins: string;
    };
    last: {
      lt: string;
      hash: string;
    } | null;
    storageStat: {
      lastPaid: number;
      duePayment: string | null;
      used: {
        bits: number;
        cells: number;
        publicCells: number;
      };
    } | null;
  };
  block: {
    workchain: number;
    seqno: number;
    shard: string;
    rootHash: string;
    fileHash: string;
  };
};
