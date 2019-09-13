import { DeployInstance as DeployDemocracyDaoEvent } from '../../generated/DemocracyKit/DemocracyKit'
import { DeployInstance as DeployMultisigDaoEvent } from '../../generated/MultisigKit/MultisigKit'

import { DeployDao as DeployCompanyDaoEvent } from '../../generated/CompanyTemplate/BaseTemplate'
import { DeployDao as DeployCompanyBoardDaoEvent } from '../../generated/CompanyBoardTemplate/BaseTemplate'
import { DeployDao as DeployMembershipDaoEvent } from '../../generated/MembershipTemplate/BaseTemplate'
import { DeployDao as DeployReputationDaoEvent } from '../../generated/ReputationTemplate/BaseTemplate'

import { DAO } from '../../generated/schema'

export function handleDeployDemocracyDao(event: DeployDemocracyDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'DEMOCRACY'
  dao.token = event.params.token

  dao.save()
}

export function handleDeployMultisigDao(event: DeployMultisigDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'MULTISIG'
  dao.token = event.params.token

  dao.save()
}

export function handleDeployCompanyDao(event: DeployCompanyDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'COMPANY'

  dao.save()
}

export function handleDeployCompanyBoardDao(event: DeployCompanyBoardDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'COMPANY_BOARD'

  dao.save()
}

export function handleDeployMembershipDao(event: DeployMembershipDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'MEMBERSHIP'

  dao.save()
}

export function handleDeployReputationpDao(event: DeployReputationDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'REPUTATION'

  dao.save()
}
