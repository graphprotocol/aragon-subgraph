import {
  NewInstanceCall,
  NewInstance1Call,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/reputation/ReputationTemplate'

import { createReputationInstance } from './helpers'

export function handleNewInstance(call: NewInstanceCall): void {
  createReputationInstance(call.inputs._id, call)
}

export function handleNewInstanceWithPayroll(call: NewInstance1Call): void {
  createReputationInstance(call.inputs._id, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  createReputationInstance(call.inputs._id, call)
}
