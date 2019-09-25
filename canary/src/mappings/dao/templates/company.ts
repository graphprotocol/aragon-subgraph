import {
  NewInstanceCall,
  NewInstance1Call,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/company/CompanyTemplate'

import { createCompanyInstance } from './helpers'

export function handleNewInstance(call: NewInstanceCall): void {
  createCompanyInstance(call.inputs._id, call)
}

export function handleNewInstanceWithPayroll(call: NewInstance1Call): void {
  createCompanyInstance(call.inputs._id, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  createCompanyInstance(call.inputs._id, call)
}
