import {
  NewInstanceCall,
  NewInstance1Call,
  NewTokenAndInstanceCall,
} from '../../../../generated/DAO/templates/company/CompanyTemplate'

import { handleNewTemplateInstance } from './helpers'

export function handleNewInstance(call: NewInstanceCall): void {
  handleNewTemplateInstance('COMPANY', call.inputs._id, call)
}

export function handleNewInstanceWithPayroll(call: NewInstance1Call): void {
  handleNewTemplateInstance('COMPANY', call.inputs._id, call)
}

export function handleNewTokenAndInstance(call: NewTokenAndInstanceCall): void {
  handleNewTemplateInstance('COMPANY', call.inputs._id, call)
}
