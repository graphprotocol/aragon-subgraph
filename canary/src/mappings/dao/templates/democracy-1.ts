import {
  DeployInstance,
  NewInstanceCall,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/democracy-1/DemocracyKit'

import { Dao } from '../../../../generated/schema'

import { createDemocracyInstance } from './helpers'

export function handleDeployInstance(event: DeployInstance): void {
  let dao = new Dao(event.params.dao.toHex())
  dao.template = 'DEMOCRACY'
  dao.token = event.params.token

  dao.save()
}

export function handleNewInstance(call: NewInstanceCall): void {
  createDemocracyInstance(call.inputs.name, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  createDemocracyInstance(call.inputs.name, call)
}
