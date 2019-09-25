import { Address, BigInt } from '@graphprotocol/graph-ts'

import { DeployDAO, DeployEVMScriptRegistry } from '../../generated/DAOFactory/DAOFactory'
import { AragonVersion, Dao, EVMScriptRegistry } from '../../generated/schema'
import { Kernel } from '../../generated/templates'

const DAO_FACTORY_0_6 = '0x595b34c93aa2c2ba0a38daeede629a0dfbdcc559'
const DAO_FACTORY_0_7 = '0xc29f0599df12eb4cbe1a34354c4bac6d944071d1'
const DAO_FACTORY_0_8 = '0xb9da44c051c6cc9e04b7e0f95e95d69c6a6d8031'

export function handleDeployDAO(event: DeployDAO): void {
  // Register DAO factory if not already exists
  let factory = getOrRegisterDaoFactory(event.address)
  factory.daoCount = factory.daoCount.plus(BigInt.fromI32(1))
  factory.lastUpdatedBlock = event.block.number

  factory.save()

  // Persist information about the new DAO
  let dao = new Dao(event.params.dao.toHexString())
  dao.address = event.params.dao
  dao.version = factory.id

  dao.created = event.block.timestamp
  dao.createdAtBlock = event.block.number
  dao.createdAtTransaction = event.transaction.hash

  dao.save()

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

function getOrRegisterDaoFactory(daoFactory: Address): AragonVersion {
  let id = daoFactory.toHexString()
  let entity = AragonVersion.load(id)

  if (entity == null) {
    entity = new AragonVersion(id)
    entity.daoCount = BigInt.fromI32(0)
    entity.daoFactoryAddress = daoFactory
    entity.name = detectVersion(id)
  }

  return entity as AragonVersion
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
