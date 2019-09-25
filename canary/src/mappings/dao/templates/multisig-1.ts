import {
  DeployInstance,
  NewInstanceCall,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/multisig-1/MultisigKit'

import { Dao } from '../../../../generated/schema'

import { createMultisigInstance } from './helpers'

export function handleDeployInstance(event: DeployInstance): void {
  let dao = new Dao(event.params.dao.toHex())
  dao.template = 'MULTISIG'
  dao.token = event.params.token

  dao.save()
}

export function handleNewInstance(call: NewInstanceCall): void {
  createMultisigInstance(call.inputs.name, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  createMultisigInstance(call.inputs.name, call)
}
