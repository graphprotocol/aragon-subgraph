import {
  NewInstanceCall,
  NewInstance1Call,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/membership/MembershipTemplate'

import { handleNewTemplateInstance } from './helpers'

export function handleNewInstance(call: NewInstance1Call): void {
  handleNewTemplateInstance('MEMBERSHIP', call.inputs._id, call)
}

export function handleNewInstanceWithPayroll(call: NewInstanceCall): void {
  handleNewTemplateInstance('MEMBERSHIP', call.inputs._id, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  handleNewTemplateInstance('MEMBERSHIP', call.inputs._id, call)
}
