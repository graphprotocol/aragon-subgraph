import { crypto } from '@graphprotocol/graph-ts'

import {
  DeployInstance,
  NewInstanceCall,
  NewTokenAndInstanceCall,
} from '../../../generated/DAO/kits/multisig-1/MultisigKit'

import { Dao, DaoTemplateInstance } from '../../../generated/schema'

import * as bytes from '../../helpers/bytes'

export function handleDeployInstance(event: DeployInstance): void {
  let dao = new Dao(event.params.dao.toHex())
  dao.template = 'MULTISIG'
  dao.token = event.params.token

  dao.save()
}

export function handleNewInstance(call: NewInstanceCall): void {
  let name = bytes.fromString(call.inputs.name)

  let instance = new DaoTemplateInstance(crypto.keccak256(name).toHexString())
  instance.name = call.inputs.name
  instance.template = 'MULTISIG'
  instance.templateAddress = call.to

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  let name = bytes.fromString(call.inputs.name)

  let instance = new DaoTemplateInstance(crypto.keccak256(name).toHexString())
  instance.name = call.inputs.name
  instance.template = 'MULTISIG'
  instance.templateAddress = call.to

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()
}
