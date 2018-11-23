import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {NewPeriod, SetBudget, NewPayment, NewTransaction, ChangePaymentState, PaymentFailure} from '../types/Finance/Finance'

// Import entity types from the schema
import {FinancePeriod, FinanceTransaction} from '../types/schema'

// In the future, functionality for the events that are not in the dapp need to be added

export function handleNewPeriod(event: NewPeriod): void {
  let id = event.params.periodId.toString()
  let start = event.params.periodStarts
  let end = event.params.periodEnds

  let period = new FinancePeriod()
  period.starts = start
  period.ends = end
  period.appAddress = event.address

  store.set("FinancePeriod", id, period)
}

export function handleSetBudget(event: SetBudget): void {
// not in dapp
}

export function handleNewPayment(event: NewPayment): void {
// not in dapp
}

export function handleNewTransaction(event: NewTransaction): void {
  let id = event.params.transactionId.toString()
  let incoming = event.params.incoming
  let amount = event.params.amount
  let entity = event.params.entity
  let reference = event.params.reference

  let tx = new FinanceTransaction()
  tx.incoming = incoming
  tx.amount = amount
  tx.entity = entity
  tx.appAddress = event.address
  tx.reference = reference

  store.set("FinanceTransaction", id, tx)
}

export function handleChangePaymentState(event: ChangePaymentState): void {
// not in dapp
}

export function handlePaymentFailure(event: PaymentFailure): void {
// not in dapp
}

