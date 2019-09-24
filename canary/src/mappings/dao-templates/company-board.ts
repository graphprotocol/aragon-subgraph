import { crypto } from '@graphprotocol/graph-ts'

import { FinalizeInstance1Call as NewCompanyBoardCall } from '../../../generated/DAO/templates/company-board/CompanyBoardTemplate'
import { OrganizationTemplateInstance as DaoTemplateInstance } from '../../../generated/schema'

import * as bytes from '../../helpers/bytes'

export function handleNewCompanyBoardDao(call: NewCompanyBoardCall): void {
  let name = bytes.fromString(call.inputs._id)
  let id = crypto.keccak256(name)

  let instance = new DaoTemplateInstance(id.toHexString())
  instance.name = call.inputs._id
  instance.template = 'COMPANY_BOARD'
  instance.templateAddress = call.to
  // TODO: settings.tokenName = call.inputs._tokenName
  // TODO: settings.tokenSymbol = call.inputs._tokenSymbol

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()
}
