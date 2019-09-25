import { ClaimSubdomain } from '../../generated/AragonID/FIFSResolvingRegistrar'

import { Dao, DaoTemplateInstance } from '../../generated/schema'

export function handleClaimSubdomain(event: ClaimSubdomain): void {
  let daoAddress = event.params.owner.toHexString()

  let dao = Dao.load(daoAddress)

  if (dao != null) {
    let instance = DaoTemplateInstance.load(event.params.subnode.toHex())

    if (instance != null) {
      dao.name = instance.name
      dao.template = instance.template

      instance.dao = dao.id
      instance.ensResolver = event.params.resolver

      dao.save()
      instance.save()
    }
  }
}
