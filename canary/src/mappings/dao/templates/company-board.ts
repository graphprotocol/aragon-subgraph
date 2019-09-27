import {
  FinalizeInstanceCall,
  FinalizeInstance1Call,
} from '../../../../generated/DAO/templates/company-board/CompanyBoardTemplate'

import { handleNewTemplateInstance } from './helpers'

export function handleFinalizeInstance(call: FinalizeInstance1Call): void {
  handleNewTemplateInstance('COMPANY_BOARD', call.inputs._id, call)
}

export function handleFinalizeInstanceWithPayroll(call: FinalizeInstanceCall): void {
  handleNewTemplateInstance('COMPANY_BOARD', call.inputs._id, call)
}
