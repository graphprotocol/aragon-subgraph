import {
  NewInstanceCall,
  NewInstance1Call,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/reputation/ReputationTemplate'

import { handleNewTemplateInstance } from './helpers'

export function handleNewInstance(call: NewInstanceCall): void {
  handleNewTemplateInstance('REPUTATION', call.inputs._id, call)
}

export function handleNewInstanceWithPayroll(call: NewInstance1Call): void {
  handleNewTemplateInstance('REPUTATION', call.inputs._id, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  handleNewTemplateInstance('REPUTATION', call.inputs._id, call)
}
