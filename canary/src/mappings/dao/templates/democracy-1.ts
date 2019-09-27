import {
  DeployInstance,
  NewInstanceCall,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/democracy-1/DemocracyKit'

import { Dao } from '../../../../generated/schema'

import { handleNewTemplateInstance } from './helpers'

export function handleDeployInstance(event: DeployInstance): void {
  let dao = new Dao(event.params.dao.toHex())
  dao.template = 'DEMOCRACY'
  dao.token = event.params.token

  dao.save()
}

export function handleNewInstance(call: NewInstanceCall): void {
  handleNewTemplateInstance('DEMOCRACY', call.inputs.name, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  handleNewTemplateInstance('DEMOCRACY', call.inputs.name, call)
}
