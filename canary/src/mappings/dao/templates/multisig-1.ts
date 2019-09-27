import {
  DeployInstance,
  NewInstanceCall,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/multisig-1/MultisigKit'

import { Dao } from '../../../../generated/schema'

import { handleNewTemplateInstance } from './helpers'

export function handleDeployInstance(event: DeployInstance): void {
  let dao = new Dao(event.params.dao.toHex())
  dao.template = 'MULTISIG'
  dao.token = event.params.token

  dao.save()
}

export function handleNewInstance(call: NewInstanceCall): void {
  handleNewTemplateInstance('MULTISIG', call.inputs.name, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  handleNewTemplateInstance('MULTISIG', call.inputs.name, call)
}
