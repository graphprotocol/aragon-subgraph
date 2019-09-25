import { crypto, EthereumCall } from '@graphprotocol/graph-ts'

import {
  NewInstanceCall,
  NewInstance1Call,
  NewTokenAndInstanceCall,
} from '../../../generated/DAO/templates/membership/MembershipTemplate'

import { DaoTemplateInstance } from '../../../generated/schema'

import * as bytes from '../../helpers/bytes'

export function handleNewInstance(call: NewInstance1Call): void {
  createMembershipInstance(call.inputs._id, call)
}

export function handleNewInstanceWithPayroll(call: NewInstanceCall): void {
  createMembershipInstance(call.inputs._id, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  createMembershipInstance(call.inputs._id, call)
}

function createMembershipInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  let name = bytes.fromString(aragonId)
  let id = crypto.keccak256(name)

  let instance = new DaoTemplateInstance(id.toHexString())
  instance.name = aragonId
  instance.template = 'MEMBERSHIP'
  instance.templateAddress = call.to

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()

  return instance
}
