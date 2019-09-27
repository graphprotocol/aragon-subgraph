import { crypto, EthereumCall } from '@graphprotocol/graph-ts'

import { AragonIdentity, Dao } from '../../../../generated/schema'

import * as bytes from '../../../helpers/bytes'

export function handleNewTemplateInstance(templateType: string, aragonId: string, call: EthereumCall): void {
  let identityId = crypto.keccak256(bytes.fromString(aragonId))
  let identity = AragonIdentity.load(identityId.toHexString())

  if (identity != null) {
    let dao = Dao.load(identity.entity.toHexString())

    if (dao != null) {
      dao.name = aragonId
      dao.template = templateType
      dao.templateAddress = call.to

      dao.save()
    }
  }
}
