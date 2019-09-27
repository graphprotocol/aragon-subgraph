import { Address, BigInt, EthereumEvent } from '@graphprotocol/graph-ts'

import { Dao, DaoFactory } from '../../../generated/schema'

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

function createDao(daoAddress: Address, factoryName: string, event: EthereumEvent): void {
  let daoFactory = getOrRegisterDaoFactory(factoryName, event.address)

  // Increase total DAOs
  daoFactory.daoCount = daoFactory.daoCount.plus(BigInt.fromI32(1))
  daoFactory.lastUpdatedBlock = event.block.number

  daoFactory.save()

  // Register DAO
  let dao = new Dao(daoAddress.toHexString())
  dao.address = daoAddress
  dao.factory = daoFactory.id

  dao.created = event.block.timestamp
  dao.createdAtBlock = event.block.number
  dao.createdAtTransaction = event.transaction.hash

  dao.save()

  // Start indexing DAO kernel events
  Kernel.create(daoAddress)
}

function getOrRegisterDaoFactory(name: string, daoFactoryAddress: Address): DaoFactory {
  let factory = DaoFactory.load(daoFactoryAddress.toHexString())

  if (factory == null) {
    factory = new DaoFactory(daoFactoryAddress.toHexString())
    factory.address = daoFactoryAddress
    factory.name = name
    factory.daoCount = BigInt.fromI32(0)

    factory.save()
  }

  return factory as DaoFactory
}
