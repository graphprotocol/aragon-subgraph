import { crypto, EthereumCall } from '@graphprotocol/graph-ts'

import {
  FinalizeInstanceCall,
  FinalizeInstance1Call,
} from '../../../generated/DAO/templates/company-board/CompanyBoardTemplate'

import { OrganizationTemplateInstance as DaoTemplateInstance } from '../../../generated/schema'

import * as bytes from '../../helpers/bytes'

export function handleFinalizeInstance(call: FinalizeInstance1Call): void {
  createCompanyBoardInstance(call.inputs._id, call)
}

export function handleFinalizeInstanceWithPayroll(call: FinalizeInstanceCall): void {
  createCompanyBoardInstance(call.inputs._id, call)
}

function createCompanyBoardInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  let name = bytes.fromString(aragonId)
  let id = crypto.keccak256(name)

  let instance = new DaoTemplateInstance(id.toHexString())
  instance.name = aragonId
  instance.template = 'COMPANY_BOARD'
  instance.templateAddress = call.to

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()

  return instance
}
