import {
  FinalizeInstanceCall,
  FinalizeInstance1Call,
} from '../../../../generated/DAO/templates/company-board/CompanyBoardTemplate'

import { createCompanyBoardInstance } from './helpers'

export function handleFinalizeInstance(call: FinalizeInstance1Call): void {
  createCompanyBoardInstance(call.inputs._id, call)
}

export function handleFinalizeInstanceWithPayroll(call: FinalizeInstanceCall): void {
  createCompanyBoardInstance(call.inputs._id, call)
}
