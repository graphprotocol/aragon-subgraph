import { log } from '@graphprotocol/graph-ts'

import {
  NewVesting as NewVestingEvent,
  RecoverToVault as RecoverToVaultEvent,
  RevokeVesting as RevokeVestingEvent,
  ScriptResult as ScriptResultEvent,
} from '../../../generated/token-manager-2.x/TokenManager'

import { Vesting } from '../../../generated/schema'

export function handleNewVesting(event: NewVestingEvent): void {
  let vesting = new Vesting(event.params.vestingId.toString())
  vesting.receiver = event.params.receiver
  vesting.vestingId = event.params.vestingId

  vesting.save()
}

export function handleRevokeVesting(event: RevokeVestingEvent): void {
  log.warning('[TokenManager][RevokeVesting] receiver={}, vestingId={}, nonVestedAmount={}', [
    event.params.receiver.toHex(),
    event.params.vestingId.toString(),
    event.params.nonVestedAmount.toString(),
  ])
}

export function handleScriptResult(event: ScriptResultEvent): void {
  log.warning('[TokenManager][ScriptResult] executor={}, script={}, input={}, returnData={}', [
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])
}

export function handleRecoverToVault(event: RecoverToVaultEvent): void {
  log.warning('[TokenManager][RecoverToVault] vault={}, token={}, amount={}', [
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])
}
