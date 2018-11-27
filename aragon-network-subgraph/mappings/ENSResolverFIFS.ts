import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {ClaimSubdomain} from '../types/ENSResolver/ENSResolver'

// Import entity types from the schema
import {ENSResolver} from "../types/schema";


//This mapping is named FIFSResolvingRegistrar on etherscan. Code for this contract is found under aragon-id repo
// mainnet - https://etherscan.io/address/0x546aa2eae2514494eeadb7bbb35243348983c59d#events
// testnet - https://rinkeby.etherscan.io/address/0x3665e7bfd4d3254ae7796779800f5b603c43c60d#events

export function handleClaimSubdomain(event: ClaimSubdomain): void {
  let id = event.params.subnode.toHex()
  let owner = event.params.owner
  let resolver = event.params.resolver

  let subdomain = new ENSResolver()
  subdomain.owner = owner
  subdomain.resolver = resolver

  store.set("ENSResolver", id, subdomain)
}

