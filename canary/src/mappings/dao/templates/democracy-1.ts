import {
  DeployInstance,
  NewInstanceCall,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/democracy-1/DemocracyKit'

import { Dao } from '../../../../generated/schema'

import { handleNewTemplateInstance } from './helpers'

export function handleDeployInstance(event: DeployInstance): void {
  let dao = new Dao(event.params.dao.toHex())
  dao.address = event.params.dao
  dao.factory = event.address.toHexString()
  dao.template = 'DEMOCRACY'
  dao.token = event.params.token

  dao.created = event.block.timestamp
  dao.createdAtBlock = event.block.number
  dao.createdAtTransaction = event.transaction.hash

  dao.save()
}

export function handleNewInstance(call: NewInstanceCall): void {
  handleNewTemplateInstance('DEMOCRACY', call.inputs.name, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  handleNewTemplateInstance('DEMOCRACY', call.inputs.name, call)
}
