import { crypto, EthereumCall } from '@graphprotocol/graph-ts'

import {
  NewInstanceCall,
  NewInstance1Call,
  NewTokenAndInstanceCall,
} from '../../../generated/DAO/templates/company/CompanyTemplate'

import { OrganizationTemplateInstance as DaoTemplateInstance } from '../../../generated/schema'

import * as bytes from '../../helpers/bytes'

export function handleNewInstance(call: NewInstanceCall): void {
  createCompanyInstance(call.inputs._id, call)
}

export function handleNewInstanceWithPayroll(call: NewInstance1Call): void {
  createCompanyInstance(call.inputs._id, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  createCompanyInstance(call.inputs._id, call)
}

function createCompanyInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  let name = bytes.fromString(aragonId)
  let id = crypto.keccak256(name)

  let instance = new DaoTemplateInstance(id.toHexString())
  instance.name = aragonId
  instance.template = 'COMPANY'
  instance.templateAddress = call.to

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()

  return instance
}
