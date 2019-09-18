import { Address, log, store } from '@graphprotocol/graph-ts'

import {
  Finance as FinanceContract,
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

import {
  FinanceApp,
  Payment,
  Period,
  TokenBudget,
  IncomingTransaction,
  OutgoingTransaction,
} from '../../../generated/schema'

import { Finance } from '../../../generated/templates'

export function handleNewPeriod(event: NewPeriod): void {
  let app = registerFinanceApp(event.address)

  let period = new Period(event.params.periodId.toString())
  period.app = app.id
  period.start = event.params.periodStarts
  period.end = event.params.periodEnds

  period.save()
}

export function handleSetBudget(event: SetBudget): void {
  let app = registerFinanceApp(event.address)

  let id = event.address.toHexString() + '-' + event.params.token.toHexString()

  if (event.params.hasBudget) {
    let budget = new TokenBudget(id)
    budget.app = app.id
    budget.token = event.params.token
    budget.amount = event.params.amount

    budget.save()
  } else {
    store.remove('TokenBudget', id)
  }
}

export function handleNewPayment(event: NewPayment): void {
  let app = registerFinanceApp(event.address)

  let payment = new Payment(event.params.paymentId.toString())
  payment.app = app.id
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
  let app = registerFinanceApp(event.address)

  if (event.params.incoming) {
    let transaction = new IncomingTransaction(event.params.transactionId.toString())
    transaction.app = app.id
    transaction.entity = event.params.entity
    transaction.amount = event.params.amount
    transaction.reference = event.params.reference

    transaction.created = event.block.timestamp
    transaction.createdAtBlock = event.block.number
    transaction.createdAtTransaction = event.transaction.hash

    transaction.save()
  } else {
    let transaction = new OutgoingTransaction(event.params.transactionId.toString())
    transaction.app = app.id
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
  let payment = new Payment(event.params.paymentId.toString())
  payment.active = event.params.active

  payment.save()
}

export function handleChangePeriodDuration(event: ChangePeriodDuration): void {
  log.debug('[Finance][ChangePeriodDuration] newDuration={}}', [event.params.newDuration.toString()])

  // TODO
}

export function handlePaymentFailure(event: PaymentFailure): void {
  log.debug('[Finance][PaymentFailure] paymentId={}}', [event.params.paymentId.toString()])

  // TODO
}

export function handleScriptResult(event: ScriptResult): void {
  log.debug('[Finance][ScriptResult] executor={}, script={}, input={}, returnData={}', [
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.debug('[Finance][RecoverToVault] vault={}, token={}, amount={}', [
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}

export function registerFinanceApp(appAddress: Address): FinanceApp {
  let app = FinanceApp.load(appAddress.toHexString())

  if (app == null) {
    let instance = FinanceContract.bind(appAddress)

    app = new FinanceApp(appAddress.toHexString())
    app.appAddress = appAddress
    app.appId = instance.appId()

    // TODO: get other contract parameters

    app.save()

    // Start indexing app events
    // Enable next line when https://github.com/graphprotocol/graph-node/issues/1105 is resolved.
    /* Finance.create(appAddress) */
  }

  return app as FinanceApp
}
