import { DeployInstance as DeployDemocracyDaoEvent } from '../../generated/DAO/templates/DemocracyKit/DemocracyKit'
import { DeployInstance as DeployMultisigDaoEvent } from '../../generated/DAO/templates/MultisigKit/MultisigKit'

import { DeployDao as DeployCompanyDaoEvent } from '../../generated/DAO/templates/CompanyTemplate/CompanyTemplate'
import { DeployDao as DeployCompanyBoardDaoEvent } from '../../generated/DAO/templates/CompanyBoardTemplate/CompanyBoardTemplate'
import { DeployDao as DeployMembershipDaoEvent } from '../../generated/DAO/templates/MembershipTemplate/MembershipTemplate'
import { DeployDao as DeployReputationDaoEvent } from '../../generated/DAO/templates/ReputationTemplate/ReputationTemplate'

import { Organization as DAO } from '../../generated/schema'
import { Finance } from '../../generated/templates'

export function handleDeployDemocracyDao(event: DeployDemocracyDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'DEMOCRACY'
  dao.templateAddress = event.address
  dao.token = event.params.token

  dao.save()
}

export function handleDeployMultisigDao(event: DeployMultisigDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'MULTISIG'
  dao.templateAddress = event.address
  dao.token = event.params.token

  dao.save()
}

export function handleDeployCompanyDao(event: DeployCompanyDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'COMPANY'
  dao.templateAddress = event.address

  dao.save()
}

export function handleDeployCompanyBoardDao(event: DeployCompanyBoardDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'COMPANY_BOARD'
  dao.templateAddress = event.address

  dao.save()
}

export function handleDeployMembershipDao(event: DeployMembershipDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'MEMBERSHIP'
  dao.templateAddress = event.address

  dao.save()
}

export function handleDeployReputationpDao(event: DeployReputationDaoEvent): void {
  let dao = new DAO(event.params.dao.toHex())
  dao.template = 'REPUTATION'
  dao.templateAddress = event.address

  dao.save()
}
