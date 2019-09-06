import { BigInt } from '@graphprotocol/graph-ts'

import { AragonOS } from '../generated/schema'

export function getAragonOS(version: string): AragonOS {
  let entity = AragonOS.load(version)

  if (entity == null) {
    entity = new AragonOS(version)

    // Initially empty
    entity.daoCount = BigInt.fromI32(0)
  }

  return entity as AragonOS
}
