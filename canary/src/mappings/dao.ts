import { Address, BigInt } from '@graphprotocol/graph-ts'

import { DeployDAO, DeployEVMScriptRegistry } from '../../generated/DAOFactory/DAOFactory'
import { AragonVersion, EVMScriptRegistry, Organization as DAO } from '../../generated/schema'
import { Kernel } from '../../generated/templates'

const DAO_FACTORY_0_6 = '0x595b34c93aa2c2ba0a38daeede629a0dfbdcc559'
const DAO_FACTORY_0_7 = '0xc29f0599df12eb4cbe1a34354c4bac6d944071d1'
const DAO_FACTORY_0_8 = '0xb9da44c051c6cc9e04b7e0f95e95d69c6a6d8031'

export function handleDeployDAO(event: DeployDAO): void {
  let daoAddress = event.params.dao.toHexString()
  let aragonVersion = getOrRegisterVersion(event.address)

  // Persist information about the new DAO
  let dao = new DAO(daoAddress)
  dao.address = event.params.dao
  dao.version = aragonVersion.id

  dao.created = event.block.timestamp
  dao.createdAtBlock = event.block.number
  dao.createdAtTransaction = event.transaction.hash

  aragonVersion.daoCount = aragonVersion.daoCount.plus(BigInt.fromI32(1))
  aragonVersion.lastUpdatedBlock = event.block.number

  dao.save()
  aragonVersion.save()

  // Start indexing DAO kernel events
  Kernel.create(event.params.dao)
}

export function handleDeployEVMScriptRegistry(event: DeployEVMScriptRegistry): void {
  let registry = new EVMScriptRegistry(event.params.reg.toHexString())

  registry.created = event.block.timestamp
  registry.createdAtBlock = event.block.number
  registry.createdAtTransaction = event.transaction.hash

  registry.save()
}

function getOrRegisterVersion(daoFactory: Address): AragonVersion {
  let daoFactoryAddress = daoFactory.toHexString()
  let version = AragonVersion.load(daoFactoryAddress)

  if (version == null) {
    version = new AragonVersion(daoFactoryAddress)
    version.daoCount = BigInt.fromI32(0)
    version.daoFactoryAddress = daoFactory
    version.name = detectVersion(daoFactoryAddress)

    version.save()
  }

  return version as AragonVersion
}

function detectVersion(daoFactoryAddress: string): string {
  if (daoFactoryAddress == DAO_FACTORY_0_6) {
    return '0.6'
  }

  if (daoFactoryAddress == DAO_FACTORY_0_7) {
    return '0.7'
  }

  if (daoFactoryAddress == DAO_FACTORY_0_8) {
    return '0.8'
  }

  return 'unknown'
}
