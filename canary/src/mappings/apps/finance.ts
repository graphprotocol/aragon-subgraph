import { log, store } from '@graphprotocol/graph-ts'

import {
  NewPeriod,
  SetBudget,
  NewPayment,
  NewTransaction,
  ChangePaymentState,
  ChangePeriodDuration,
  PaymentFailure,
  ScriptResult,
  RecoverToVault,
} from '../../../generated/templates/Finance/Finance'

import { Payment, Period, TokenBudget, IncomingTransaction, OutgoingTransaction } from '../../../generated/schema'

export function handleNewPeriod(event: NewPeriod): void {
  let appAddress = event.address.toHexString()

  let period = new Period(appAddress + '-' + event.params.periodId.toString())
  period.app = appAddress
  period.start = event.params.periodStarts
  period.end = event.params.periodEnds

  period.save()
}

export function handleSetBudget(event: SetBudget): void {
  let appAddress = event.address.toHexString()
  let budgetId = appAddress + '-' + event.params.token.toHexString()

  if (event.params.hasBudget) {
    let budget = new TokenBudget(budgetId)
    budget.app = appAddress
    budget.token = event.params.token
    budget.amount = event.params.amount

    budget.save()
  } else {
    store.remove('TokenBudget', budgetId)
  }
}

export function handleNewPayment(event: NewPayment): void {
  let appAddress = event.address.toHexString()

  let payment = new Payment(appAddress + '-' + event.params.paymentId.toString())
  payment.app = appAddress
  payment.recipient = event.params.recipient
  payment.maxExecutions = event.params.maxExecutions
  payment.reference = event.params.reference

  payment.active = true

  payment.created = event.block.timestamp
  payment.createdAtBlock = event.block.number
  payment.createdAtTransaction = event.transaction.hash

  payment.save()
}

export function handleNewTransaction(event: NewTransaction): void {
  let appAddress = event.address.toHexString()

  if (event.params.incoming) {
    let transaction = new IncomingTransaction(appAddress + '-INCOMING-' + event.params.transactionId.toString())
    transaction.app = appAddress
    transaction.entity = event.params.entity
    transaction.amount = event.params.amount
    transaction.reference = event.params.reference

    transaction.created = event.block.timestamp
    transaction.createdAtBlock = event.block.number
    transaction.createdAtTransaction = event.transaction.hash

    transaction.save()
  } else {
    let transaction = new OutgoingTransaction(appAddress + '-OUTGOING-' + event.params.transactionId.toString())
    transaction.app = appAddress
    transaction.entity = event.params.entity
    transaction.amount = event.params.amount
    transaction.reference = event.params.reference

    transaction.created = event.block.timestamp
    transaction.createdAtBlock = event.block.number
    transaction.createdAtTransaction = event.transaction.hash

    transaction.save()
  }
}

export function handleChangePaymentState(event: ChangePaymentState): void {
  let payment = new Payment(event.address.toHexString() + '-' + event.params.paymentId.toString())
  payment.active = event.params.active

  payment.save()
}

export function handleChangePeriodDuration(event: ChangePeriodDuration): void {
  log.debug('[Finance][ChangePeriodDuration] appAddress={}, newDuration={}}', [
    event.address.toHexString(),
    event.params.newDuration.toString(),
  ])

  // TODO
}

export function handlePaymentFailure(event: PaymentFailure): void {
  log.debug('[Finance][PaymentFailure] appAddress={}, paymentId={}}', [
    event.address.toHexString(),
    event.params.paymentId.toString(),
  ])

  // TODO
}

export function handleScriptResult(event: ScriptResult): void {
  log.debug('[Finance][ScriptResult] appAddress={}, executor={}, script={}, input={}, returnData={}', [
    event.address.toHexString(),
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.debug('[Finance][RecoverToVault] appAddress={}, vault={}, token={}, amount={}', [
    event.address.toHexString(),
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}
