import { log } from '@graphprotocol/graph-ts'

import {
  NewVesting,
  RecoverToVault,
  RevokeVesting,
  ScriptResult,
} from '../../../generated/templates/TokenManager/TokenManager'

import { Vesting } from '../../../generated/schema'

export function handleNewVesting(event: NewVesting): void {
  let appAddress = event.address.toHexString()

  let vesting = new Vesting(appAddress + '-' + event.params.vestingId.toString())
  vesting.app = appAddress
  vesting.receiver = event.params.receiver
  vesting.vestingId = event.params.vestingId

  vesting.save()
}

export function handleRevokeVesting(event: RevokeVesting): void {
  log.debug('[TokenManager][RevokeVesting] appAddress={}, receiver={}, vestingId={}, nonVestedAmount={}', [
    event.address.toHexString(),
    event.params.receiver.toHex(),
    event.params.vestingId.toString(),
    event.params.nonVestedAmount.toString(),
  ])

  // TODO
}

export function handleScriptResult(event: ScriptResult): void {
  log.debug('[TokenManager][ScriptResult] appAddress={}, executor={}, script={}, input={}, returnData={}', [
    event.address.toHexString(),
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.debug('[TokenManager][RecoverToVault] appAddress={}, vault={}, token={}, amount={}', [
    event.address.toHexString(),
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}
