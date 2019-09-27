import { ClaimSubdomain } from '../../generated/AragonID/FIFSResolvingRegistrar'

import { AragonIdentity } from '../../generated/schema'

export function handleClaimSubdomain(event: ClaimSubdomain): void {
  let identity = new AragonIdentity(event.params.subnode.toHex())
  identity.ensResolver = event.params.resolver
  identity.entity = event.params.owner

  identity.save()
}
