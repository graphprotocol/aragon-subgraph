import { ClaimSubdomain as ClaimSubdomainEvent } from '../../generated/ENS/FIFSResolvingRegistrar'

import * as schema from '../../generated/schema'

export function handleClaimSubdomain(event: ClaimSubdomainEvent): void {
  let subdomain = new schema.ENSResolver(event.params.subnode.toHex())
  subdomain.owner = event.params.owner
  subdomain.resolver = event.params.resolver

  subdomain.created = event.block.timestamp
  subdomain.createdAtBlock = event.block.number
  subdomain.createdAtTransaction = event.transaction.hash

  subdomain.save()
}
