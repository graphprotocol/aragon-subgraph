import {
  NewInstanceCall,
  NewInstance1Call,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/membership/MembershipTemplate'

import { createMembershipInstance } from './helpers'

export function handleNewInstance(call: NewInstance1Call): void {
  createMembershipInstance(call.inputs._id, call)
}

export function handleNewInstanceWithPayroll(call: NewInstanceCall): void {
  createMembershipInstance(call.inputs._id, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  createMembershipInstance(call.inputs._id, call)
}
