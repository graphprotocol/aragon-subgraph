import { crypto } from '@graphprotocol/graph-ts'

import { NewTokenAndInstanceCall as NewCompanyCall } from '../../../generated/DAO/templates/company/CompanyTemplate'
import { OrganizationTemplateInstance as DaoTemplateInstance } from '../../../generated/schema'

import * as bytes from '../../helpers/bytes'

export function handleNewCompanyDao(call: NewCompanyCall): void {
  let name = bytes.fromString(call.inputs._id)

  let instance = new DaoTemplateInstance(crypto.keccak256(name).toHexString())
  instance.name = call.inputs._id
  instance.template = 'COMPANY'
  instance.templateAddress = call.to
  instance.tokenName = call.inputs._tokenName
  instance.tokenSymbol = call.inputs._tokenSymbol

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()
}
