import { DeployInstance as DeployDemocracyDaoEvent } from '../../generated/DAO/templates/DemocracyKit/DemocracyKit'
import { DeployInstance as DeployMultisigDaoEvent } from '../../generated/DAO/templates/MultisigKit/MultisigKit'

import { Organization as DAO } from '../../generated/schema'

export function handleDeployDemocracyDao(event: DeployDemocracyDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'DEMOCRACY'

  dao.save()
}

export function handleDeployMultisigDao(event: DeployMultisigDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'MULTISIG'

  dao.save()
}
