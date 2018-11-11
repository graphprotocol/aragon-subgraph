# Aragon Subgraph

This is a subgraph for the [Aragon Project](https://github.com/aragon).

TODO: fiture out what testnet(s) they use and update doc to reflect

new notes
- abis for apps were truffle compiled in the reposity
- they only include events for the specific contract, not inherited contracts 

## Brief Description of The Graph Node Setup

A Graph Node can run multiple subgraphs, and in this case it can have a subgraph for Mainnet and testnets. The subgraph ingests event data by calling to Infura through http. It can also connect to any geth node or parity node that accepts RPC calls. Fast synced geth nodes work. To use parity, the `--no-warp` flag must be used. Setting up a local Ethereum node is more reliable and faster, but Infura is the easiest way to get started. 

This subgraph has three types of files which tell the Graph Node to ingest events from specific contracts. They are:
* The subgraph manifest (subgraph.yaml)
* A GraphQL schema      (schema.graphql)
* Mapping scripts       (TODO)

This repository has these files created and ready to compile, so a user can start this subgraph on their own. The only thing that needs to be edited is the contract addresses in the `subgraph.yaml` file to change between Rinkeby or Mainnet.  

We have provided a quick guide on how to start up the Aragon-Subgraph graph node. If these steps aren't descriptive enough, the [getting started guide](https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md) has in depth details on running a subgraph. 

## Brief Description of the Aragon Contracts

All of the contracts were examined for the Aragon ecosystem. It was originally determined that the only relevant events are emitted from the exchange, and the proxy contracts. But then the proxy contracts really only register an event once or two, upon being published to the network. This isn't too important right now, although this would be easy to add.

Aragon upgraded their contracts to a V2 in September 2018. V1 is still running, and emitting events. This subgraph tracks both of these versions. The simplest way to look at it is that both of these contracts exist on the network, V1 has been around over a year, and V2 a few months. The subgraph ingests both of their events. In order to do this, mappings were written for each version, and then the schemas were adjusted to support both V1 and V2 fields. The `subgraph.yaml` file also must track both of the contract addresses.

## Steps to get the Aragon-Subgraph Running 
  1. Install IPFS and run `ipfs init` followed by `ipfs daemon`
  2. Install PostgreSQL and run `initdb -D .postgres` followed by `pg_ctl -D .postgres start` and `createdb Aragon-subgraph-mainnet` (note this db name is used in the commands below for the mainnet examples)
  3. If using Ubuntu, you may need to install additional packages: `sudo apt-get install -y clang libpq-dev libssl-dev pkg-config`
  4. Clone this repository, and run the following:
     * `yarn`
     * `yarn codegen` 
  5. Clone https://github.com/graphprotocol/graph-node from master and `cargo build` (this might take a while)
  6. a) Now that all the dependencies are running, you can run the following command to connect to Infura Mainnet (it may take a few minutes for Rust to compile). Password might be optional, it depends on your postrgres setup:

```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/Aragon-mainnet \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-infura:https://mainnet.infura.io --debug
```
  6. b) Or Mainnet Local:
```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/Aragon-mainnet \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-local:http://127.0.0.1:8545 
```
  6. c) Or Infura Rinkeby _(NOTE: Infura Rinkeby is not reliable right now, we get inconsistent results returned. If Rinkeby data is needed, it is suggested to run your own Rinkeby node)_
```
    cargo run -p graph-node --release --   
    --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/Aragon-Rinkeby 
    --ipfs 127.0.0.1:5001
    --ethereum-rpc Rinkeby-infura:https://Rinkeby.infura.io 

```
 6. d) Or a Rinkeby local node which was started with `parity --chain=Rinkeby --no-warp  --jsonrpc-apis="all" `:
 
 ```
   cargo run -p graph-node --release -- \
   --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/Aragon-Rinkeby \
   --ipfs 127.0.0.1:5001 \
   --ethereum-rpc Rinkeby-local:http://127.0.0.1:8545
 
 ```
  
 7. Now deploy the Aragon-Subgraph to The Graph Node with `yarn deploy --verbosity debug`. You should see a lot of blocks being skipped in the `graph-node` terminal, and then it will start ingesting events from the moment the contracts were uploaded to the network. 

Now that you have subgraph is running you may open a [Graphiql](https://github.com/graphql/graphiql) browser at `127.0.0.1:8000` and get started with querying.

## Getting started with Querying 

Below are a few ways to show how to query the Aragon-Subgraph for data. 

### Querying all possible data that is being stored
The query below shows all the information that is possible to query, but is limited to the first 5 instances. There are many other filtering options that can be used, just check out the [querying api](https://github.com/graphprotocol/graph-node/blob/master/docs/graphql-api.md).

```

```
The command above can be copy pasted into the Graphiql interface in your browser at `127.0.0.1:8000`.

