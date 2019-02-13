# Aragon Subgraph

This is a subgraph for the [Aragon Project](https://github.com/aragon).

The Aragon contracts run on Mainnet and Rinkeby. The subgraphs have been split into two types. The `Aragon-Network-Subgraph` focuses on contracts that are high level, and are important to the entire Aragon Protocol. The contracts to be considered for the `Aragon-Network-Subgraph` can be expected not to change address. The `Individual-DAO-Subgraph` indexes data for one subgraph. Since each new DAO will have their own contract addresses for their DAO, every time a new DAO is created, those contracts can be sourced, and an `Individual-DAO-Subgraph` can be created.

## Brief Description of The Graph Node Setup

A Graph Node can run multiple subgraphs, and in this case it can have a subgraph for Mainnet and testnets. The subgraph ingests event data by calling to Infura through http. It can also connect to any geth node or parity node that accepts RPC calls (such as a local one). Fast synced geth nodes do work. To use parity, the `--no-warp` flag must be used. Setting up a local Ethereum node is more reliable and faster, but Infura is the easiest way to get started. 

These subgraphs has three types of files which tell the Graph Node to ingest events from specific contracts. They are:
* The subgraph manifest (subgraph.yaml)
* A GraphQL schema      (schema.graphql)
* Mapping scripts       (**Individual** - ACL.ts, constants.ts, EVMScriptRegistry.ts, Finance.ts, Kernel.ts, TokenManager.ts, Vault.ts, Voting.ts | **Network** - DAOFactory.ts, ENSResolverFIFS.ts)

This repository has these files created and ready to compile, so a user can start this subgraph on their own. The only thing that needs to be edited is the contract addresses in the `subgraph.yaml` file to change between Rinkeby or Mainnet. If you are indexing a different Individual-DAO-Subgraph, you will have to grab the contract addresses that are relevant to that subgraph. 

We have provided a quick guide on how to start up the Aragon-Subgraph graph node in the next section. If these steps aren't descriptive enough, the [getting started guide](https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md) has in depth details on running a subgraph. 

## Brief Description of the Aragon Contracts

All of the contracts were examined for the Aragon ecosystem. As described above, the contracts have been split into individual-dao-subgraphs and network subgraphs. 

The bulk of the work is in the individual subgraphs. The mappings written for those are complex. They are built to provide all the data needed to run the Aragon Dapp for users to easily build DAOs. Therefore some events have been left out, as while testing the Dapp it was determined that some functionality available in the smart contracts is not currently available in the Dapp. Therefore the events are rarely getting emitted right now. But they can be added in the future if needed. 

The ABIs for the subgraphs were received from downloading the Aragon repositories, and using truffle to compile within the repo. This is because the `build` docs are not uploaded to github, so you must locally build to get the ABIs for the contract, which are used to create a subgraph. 

## Steps to Deploy The Aragon Subgraph Locally 

> IMPORTANT NOTE: The file individual-dao-subgraph/types/ACL/ACL.ts will cause errors because The Graph Node creates duplicate types for overloaded Solidity function. The temporary fix is to just name the functions differently after they are produced by `yarn codegen`. Follow the issue here https://github.com/graphprotocol/graph-cli/issues/168, which we are fixing soon. 

First you must choose your type of subgraph, individual or network. The steps below will work for both cases. But you must change the contract addresses you are sourcing in the `subgraph.yaml`. You can use the same postgres db, as a new db will be created for each different subgraph, which is created upon uploading the subgraph files to IPFS. 

  1. Install IPFS and run `ipfs init` followed by `ipfs daemon`
  2. Install PostgreSQL and run `initdb -D .postgres` followed by `pg_ctl -D .postgres start` and `createdb graph-node--mainnet` (note this db name is used in the commands below for the mainnet examples)
  3. If using Ubuntu, you may need to install additional packages: `sudo apt-get install -y clang libpq-dev libssl-dev pkg-config`
  4. Clone this repository, and run the following:
     * `yarn`
     * `yarn codegen` 
  5. Clone https://github.com/graphprotocol/graph-node from master and `cargo build` (this might take a while)
  6. a) Now that all the dependencies are running, you can run the following command to connect to Infura Mainnet (it may take a few minutes for Rust to compile). Password might be optional, it depends on your postrgres setup:

```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/graph-node-mainnet \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-infura:https://mainnet.infura.io --debug
```
  6. b) Or Mainnet with a Local Ethereum node. This is very common if you are working with brand new contracts, and you have deployed them to a testnet environment like *ganache* (note that ganache commonly uses port 9545 rather than 8545):
```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/graph-node-mainnet \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-local:http://127.0.0.1:8545 
```
  6. c) Or Infura Rinkeby_
```
    cargo run -p graph-node --release --   
    --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/graph-node-testnet 
    --ipfs 127.0.0.1:5001
    --ethereum-rpc rinkeby-infura:https://Rinkeby.infura.io 

```

 7. Now deploy the Aragon-Subgraph to The Graph Node with `yarn deploy --debug`. You should see a lot of blocks being skipped in the `graph-node` terminal, and then it will start ingesting events from the moment the contracts were uploaded to the network. 

Now that you have subgraph is running you may open a [Graphiql](https://github.com/graphql/graphiql) browser at `127.0.0.1:8000` and get started with querying.

## Viewing the Subgraph on the Graph Hosted Service
This subgraph is not yet on [The Graph Explorer](https://thegraph.com/explorer/). To understand how deploying to the hosted service works, check out the [Deploying Instructions](https://thegraph.com/docs/deploy-a-subgraph) in the official documentation. The most important part of deploying to the hosted service is ensuring that the npm script for `deploy` is updated to the correct name that you want to deploy with. 

## Getting started with Querying 

Below shows all the ways to query a Individual Subgraph and the network subgraph 

### Querying all possible data that is being stored
The query below shows all the information that is possible to query, but is limited to the first 5 instances. Limiting to 5 or 10 instances is good, because with no limit tens of thousands of results can be queried at once, which can be slow on your computer. There are many other filtering options that can be used, just check out the [querying api](https://github.com/graphprotocol/graph-node/blob/master/docs/graphql-api.md). Also check out the [GraphQL docs](https://graphql.org/learn/) if you are completely new to GraphQL and the info in this section doesn't make sense.

The query is set up so that all the internal entities are queried from within the top level entities. The top level entities are the `apps`, which are Kernel, ACL, EVMScriptRegistry, Vault, TokenManager, Finances and Voting. 

#### Individual Subgraph Queries

```graphql
{
  kernels {
    id
    appID
    permissions {
      entities
      role
    }
    managers {
      managesManageApps
    }
  }
  acls {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers {
      managesCreatePermissions
    }
  }
  evmscriptRegistries {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers {
      managesAddExecutor
      managesEnableAndDisableExecutors
    }
    executors
  }
  vaults {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers {
      managesTransfers
    }
    transfers {
      amount
      tokenAddress
      to
    }
    deposits {
      amount
      tokenAddress
      sender
    }
  }
  tokenManagers {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers{
      managesBurn
      managesMint
      managesIssue
      managesAssign
      managesRevokeVestings
    }
  }
  finances {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    periods {
      id
      starts
      ends
    }
    transactions {
      id
      incoming
      amount
      entity
      reference
    }
    managers{
      managesChangeBudget
      managesChangePeriod
      managesCreatePayments
      managesManagePayments
      managesExecutePayments
    }
  }
  votings {
    id
    baseAddress
    appID
    upgradeable
    defaultApp
    permissions {
      entities
      role
    }
    managers{
      managesCreateVotes
      managesModifyQuorum
      managesModifySupport
    }
    supportRequiredPercent
    minQuorumPercent
  }
  votes(first: 5) {
    id
    appAddress
    creator
    metadata
    supporters
    supportersStake
    nonSupporters
    nonSupportersStake
    executed
  }
}
```
The command above can be copy pasted into the Graphiql interface in your browser at `127.0.0.1:8000`.

#### Network Subgraph Queries 

This subgraph is a lot simpler, as most of the good data is within DAOs. The Kits could still be tracked here, but they don't directly show information in the Dapp, so they were left out. The following can be queried:

```graphql
{
  daos(first:10) {
    id
  }
  evmscriptRegistries(first:10){
    id
  }
  ensresolvers(orderBy: id first:10){
    id
    owner
    resolver
  }
}
```

