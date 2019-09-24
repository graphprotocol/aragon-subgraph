import { crypto } from '@graphprotocol/graph-ts'

import { NewTokenAndInstanceCall as NewMembershipCall } from '../../../generated/DAO/templates/membership/MembershipTemplate'
import { OrganizationTemplateInstance as DaoTemplateInstance } from '../../../generated/schema'

import * as bytes from '../../helpers/bytes'

export function handleNewMembershipDao(call: NewMembershipCall): void {
  let name = bytes.fromString(call.inputs._id)
  let id = crypto.keccak256(name)

  let instance = new DaoTemplateInstance(id.toHexString())
  instance.name = call.inputs._id
  instance.template = 'MEMBERSHIP'
  instance.templateAddress = call.to
  instance.tokenName = call.inputs._tokenName
  instance.tokenSymbol = call.inputs._tokenSymbol

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()
}
