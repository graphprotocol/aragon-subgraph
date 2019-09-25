import { Address, BigInt, EthereumEvent } from '@graphprotocol/graph-ts'

import { AragonVersion, Dao } from '../../../generated/schema'

import { DeployDAO as DeployDAO_0_6 } from '../../../generated/DAO/factories/0.6/DAOFactory'
import { DeployDAO as DeployDAO_0_7 } from '../../../generated/DAO/factories/0.7/DAOFactory'
import { DeployDAO as DeployDAO_0_8 } from '../../../generated/DAO/factories/0.8/DAOFactory'

import { Kernel } from '../../../generated/templates'

export function handleDeployDAO_0_6(event: DeployDAO_0_6): void {
  createDao(event.params.dao, '0.6', event)
}

export function handleDeployDAO_0_7(event: DeployDAO_0_7): void {
  createDao(event.params.dao, '0.7', event)
}

export function handleDeployDAO_0_8(event: DeployDAO_0_8): void {
  createDao(event.params.dao, '0.8', event)
}

function createDao(daoAddress: Address, aragonVersion: string, event: EthereumEvent): void {
  let factory = getOrRegisterDaoFactory(aragonVersion, event.address)

  increaseDaoCount(factory, event)
  registerDao(daoAddress, factory, event)
}

function getOrRegisterDaoFactory(aragonVersion: string, daoFactoryAddress: Address): AragonVersion {
  let entity = AragonVersion.load(aragonVersion)

  if (entity == null) {
    entity = new AragonVersion(aragonVersion)
    entity.daoCount = BigInt.fromI32(0)
    entity.daoFactoryAddress = daoFactoryAddress
  }

  return entity as AragonVersion
}

function increaseDaoCount(daoFactory: AragonVersion, event: EthereumEvent): void {
  daoFactory.daoCount = daoFactory.daoCount.plus(BigInt.fromI32(1))
  daoFactory.lastUpdatedBlock = event.block.number

  daoFactory.save()
}

function registerDao(daoAddress: Address, daoFactory: AragonVersion, event: EthereumEvent): Dao {
  let dao = new Dao(daoAddress.toHexString())
  dao.address = daoAddress
  dao.version = daoFactory.id

  dao.created = event.block.timestamp
  dao.createdAtBlock = event.block.number
  dao.createdAtTransaction = event.transaction.hash

  dao.save()

  // Start indexing DAO kernel events
  Kernel.create(daoAddress)

  return dao
}
