import { crypto } from '@graphprotocol/graph-ts'

import {
  DeployInstance,
  NewInstanceCall,
  NewTokenAndInstanceCall,
} from '../../../generated/DAO/kits/multisig-2/MultisigKit'

import { Organization as DAO, OrganizationTemplateInstance as DaoTemplateInstance } from '../../../generated/schema'

import * as bytes from '../../helpers/bytes'

export function handleDeployInstance(event: DeployInstance): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'MULTISIG'
  dao.token = event.params.token

  dao.save()
}

export function handleNewInstanceCall(call: NewInstanceCall): void {
  let name = bytes.fromString(call.inputs.aragonId)

  let instance = new DaoTemplateInstance(crypto.keccak256(name).toHexString())
  instance.name = call.inputs.aragonId
  instance.template = 'MULTISIG'
  instance.templateAddress = call.to

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()
}

export function handleNewTokenAndInstanceCall(call: NewTokenAndInstanceCall): void {
  let name = bytes.fromString(call.inputs.aragonId)

  let instance = new DaoTemplateInstance(crypto.keccak256(name).toHexString())
  instance.name = call.inputs.aragonId
  instance.template = 'MULTISIG'
  instance.templateAddress = call.to

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()
}