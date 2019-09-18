import { Address, log } from '@graphprotocol/graph-ts'

import {
  TokenManager as TokenManagerContract,
  NewVesting,
  RecoverToVault,
  RevokeVesting,
  ScriptResult,
} from '../../../generated/templates/TokenManager/TokenManager'

import { TokenManagerApp, Vesting } from '../../../generated/schema'
import { TokenManager } from '../../../generated/templates'

export function handleNewVesting(event: NewVesting): void {
  let app = registerTokenManagerApp(event.address)

  let vesting = new Vesting(event.params.vestingId.toString())
  vesting.app = app.id
  vesting.receiver = event.params.receiver
  vesting.vestingId = event.params.vestingId

  vesting.save()
}

export function handleRevokeVesting(event: RevokeVesting): void {
  log.debug('[TokenManager][RevokeVesting] receiver={}, vestingId={}, nonVestedAmount={}', [
    event.params.receiver.toHex(),
    event.params.vestingId.toString(),
    event.params.nonVestedAmount.toString(),
  ])

  // TODO
}

export function handleScriptResult(event: ScriptResult): void {
  log.debug('[TokenManager][ScriptResult] executor={}, script={}, input={}, returnData={}', [
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.debug('[TokenManager][RecoverToVault] vault={}, token={}, amount={}', [
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}

export function registerTokenManagerApp(appAddress: Address): TokenManagerApp {
  let app = TokenManagerApp.load(appAddress.toHexString())

  if (app == null) {
    let instance = TokenManagerContract.bind(appAddress)

    app = new TokenManagerApp(appAddress.toHexString())
    app.appAddress = appAddress
    app.appId = instance.appId()

    // TODO: get other contract parameters

    app.save()

    // Start indexing app events
    // Enable next line when https://github.com/graphprotocol/graph-node/issues/1105 is resolved.
    /* TokenManager.create(appAddress) */
  }

  return app as TokenManagerApp
}
