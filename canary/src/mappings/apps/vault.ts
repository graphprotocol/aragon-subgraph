import { log } from '@graphprotocol/graph-ts'

import { VaultTransfer, VaultDeposit, ScriptResult, RecoverToVault } from '../../../generated/templates/Vault/Vault'

export function handleVaultTransfer(event: VaultTransfer): void {
  log.warning('[Vault][VaultTransfer] proxyAddress={}, token={}, to={}, amount={}', [
    event.address.toHexString(),
    event.params.token.toHexString(),
    event.params.to.toHexString(),
    event.params.amount.toString(),
  ])

  // TODO
}

export function handleVaultDeposit(event: VaultDeposit): void {
  log.warning('[Vault][VaultDeposit] proxyAddress={}, token={}, sender={}, amount={}', [
    event.address.toHexString(),
    event.params.token.toHexString(),
    event.params.sender.toHexString(),
    event.params.amount.toString(),
  ])

  // TODO
}

export function handleScriptResult(event: ScriptResult): void {
  log.warning('[Vault][ScriptResult] proxyAddress={}, executor={}, script={}, input={}, returnData={}', [
    event.address.toHexString(),
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.warning('[Vault][RecoverToVault] proxyAddress={}, vault={}, token={}, amount={}', [
    event.address.toHexString(),
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}
