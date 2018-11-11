import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {NewPeriod, SetBudget, NewPayment, NewTransaction, ChangePaymentState, PaymentFailure} from '../types/Finance/Finance'

// Import entity types from the schema
import {Finance} from '../types/schema'


export function handleNewPeriod(event: NewPeriod): void {

}

export function handleSetBudget(event: SetBudget): void {

}

export function handleNewPayment(event: NewPayment): void {

}

export function handleNewTransaction(event: NewTransaction): void {

}

export function handleChangePaymentState(event: ChangePaymentState): void {

}

export function handlePaymentFailure(event: PaymentFailure): void {

}

