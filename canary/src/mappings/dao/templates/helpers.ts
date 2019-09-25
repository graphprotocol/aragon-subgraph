import { crypto, EthereumCall } from '@graphprotocol/graph-ts'

import { DaoTemplateInstance } from '../../../../generated/schema'

import * as bytes from '../../../helpers/bytes'

export function createDemocracyInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  return createTemplateInstance('DEMOCRACY', aragonId, call)
}

export function createMultisigInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  return createTemplateInstance('MULTISIG', aragonId, call)
}

export function createCompanyInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  return createTemplateInstance('COMPANY', aragonId, call)
}

export function createCompanyBoardInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  return createTemplateInstance('COMPANY_BOARD', aragonId, call)
}

export function createMembershipInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  return createTemplateInstance('MEMBERSHIP', aragonId, call)
}

export function createReputationInstance(aragonId: string, call: EthereumCall): DaoTemplateInstance {
  return createTemplateInstance('REPUTATION', aragonId, call)
}

function createTemplateInstance(templateType: string, aragonId: string, call: EthereumCall): DaoTemplateInstance {
  let id = crypto.keccak256(bytes.fromString(aragonId))

  let instance = new DaoTemplateInstance(id.toHexString())
  instance.name = aragonId
  instance.template = templateType
  instance.templateAddress = call.to

  instance.created = call.block.timestamp
  instance.createdAtBlock = call.block.number
  instance.createdAtTransaction = call.transaction.hash

  instance.save()

  return instance
}
