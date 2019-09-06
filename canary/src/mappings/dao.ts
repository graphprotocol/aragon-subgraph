import { BigInt } from '@graphprotocol/graph-ts'

import {
  DeployDAO as DeployDAOEvent,
  DeployEVMScriptRegistry as DeployEVMScriptRegistryEvent,
} from '../../generated/DAOs/DAOFactory'

import { DAO, EVMScriptRegistry } from '../../generated/schema'
import { Kernel } from '../../generated/templates'

import { getAragonOS } from '../helpers'

export function handleDeployDAO(event: DeployDAOEvent): void {
  let os = getAragonOS('0.7')

  // Persist information about the new DAO
  let dao = new DAO(event.params.dao.toHex())

  dao.created = event.block.timestamp
  dao.createdAtBlock = event.block.number
  dao.createdAtTransaction = event.transaction.hash

  // Register new DAO in registry
  dao.osVersion = os.id
  os.daoCount = os.daoCount.plus(BigInt.fromI32(1))

  // Update pointer to latest processed block
  os.lastBlock = event.block.number

  dao.save()
  os.save()

  // Indexing kernel events
  Kernel.create(event.params.dao)
}

export function handleDeployEVMScriptRegistry(event: DeployEVMScriptRegistryEvent): void {
  let registry = new EVMScriptRegistry(event.params.reg.toHex())

  registry.created = event.block.timestamp
  registry.createdAtBlock = event.block.number
  registry.createdAtTransaction = event.transaction.hash

  registry.save()
}
