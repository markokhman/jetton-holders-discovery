# Jetton holder discovery & rating

### Indexing principle

The key to discovering TOP holders of particular Jetton is to find all the addresses that were involved in this Jetton's transactions. We do this in two steps:

- we go through the whole blockchain and index addresses in past
- we run a real-time checker that is indexing Jetton addresses in new block's transactions

Once we have indexed all the addresses that are involved - we run a scripts that is checking their balances every X minutes and saving actual balance into DB.

The frontend is simply asking our API with DB of the top 20 token hodlers.

### Config

**./src/data/jettons.ts**

```
export const jettons: Jetton[] = [
  {
    masterAddress: "",
    walletCode: "",
    slug: "",
  },
];
```

**.env file:**

```
MONGODB=
```

### Project structure:

- Hybrid frontend app (Next.js)
  - Layout
  - API
- Scripts

### Scripts involved:

- **Real-time indexer**
  Script runs in background and reads new block and searches for new holder addresses for set of jettons we're aware of.
- **Balance checker**
  Script runs in background and actualises balances for jetton holders (addresses) we have in DB
- **Initial jetton first indexing**
  We run this script only once, to index all the jetton holders of a new jetton we want to index. _We must also add the jetton wallet's code to the new block indexer prior to running this script_

### TODO:

- resolve Jetton details parse types with **ton**
- connect DB and save indexing results
- finalize **Real-time indexer** and **Initial indexing** scripts
- implement balance checker
- setup a Next.js project
  - basic layout
  - API endpoints
