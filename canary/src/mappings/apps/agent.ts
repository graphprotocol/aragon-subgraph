import { log } from '@graphprotocol/graph-ts'

import {
  SafeExecute,
  Execute,
  AddProtectedToken,
  RemoveProtectedToken,
  PresignHash,
  SetDesignatedSigner,
  VaultTransfer,
  VaultDeposit,
  ScriptResult,
  RecoverToVault,
} from '../../../generated/templates/Agent/Agent'

export function handleSafeExecute(event: SafeExecute): void {
  log.warning('[Agent][SafeExecute] proxyAddress={}, sender={}, target={}, data={}', [
    event.address.toHexString(),
    event.params.sender.toHexString(),
    event.params.target.toHexString(),
    event.params.data.toHexString(),
  ])

  // TODO
}

export function handleExecute(event: Execute): void {
  log.warning('[Agent][Execute] proxyAddress={}, sender={}, target={}, ethValue={}, data={}', [
    event.address.toHexString(),
    event.params.sender.toHexString(),
    event.params.target.toHexString(),
    event.params.ethValue.toString(),
    event.params.data.toHexString(),
  ])

  // TODO
}

export function handleAddProtectedToken(event: AddProtectedToken): void {
  log.warning('[Agent][AddProtectedToken] proxyAddress={}, token={}', [
    event.address.toHexString(),
    event.params.token.toHexString(),
  ])

  // TODO
}

export function handleRemoveProtectedToken(event: RemoveProtectedToken): void {
  log.warning('[Agent][RemoveProtectedToken] proxyAddress={}, token={}', [
    event.address.toHexString(),
    event.params.token.toHexString(),
  ])

  // TODO
}

export function handlePresignHash(event: PresignHash): void {
  log.warning('[Agent][PresignHash] proxyAddress={}, sender={}, hash={}', [
    event.address.toHexString(),
    event.params.sender.toHexString(),
    event.params.hash.toHexString(),
  ])

  // TODO
}

export function handleSetDesignatedSigner(event: SetDesignatedSigner): void {
  log.warning('[Agent][SetDesignatedSigner] proxyAddress={}, sender={}, oldSigner={}, newSigner={}', [
    event.address.toHexString(),
    event.params.sender.toHexString(),
    event.params.oldSigner.toHexString(),
    event.params.newSigner.toHexString(),
  ])

  // TODO
}

export function handleVaultTransfer(event: VaultTransfer): void {
  log.warning('[Agent][VaultTransfer] proxyAddress={}, token={}, to={}, amount={}', [
    event.address.toHexString(),
    event.params.token.toHexString(),
    event.params.to.toHexString(),
    event.params.amount.toString(),
  ])

  // TODO
}

export function handleVaultDeposit(event: VaultDeposit): void {
  log.warning('[Agent][VaultDeposit] proxyAddress={}, token={}, sender={}, amount={}', [
    event.address.toHexString(),
    event.params.token.toHexString(),
    event.params.sender.toHexString(),
    event.params.amount.toString(),
  ])

  // TODO
}

export function handleScriptResult(event: ScriptResult): void {
  log.warning('[Agent][ScriptResult] proxyAddress={}, executor={}, script={}, input={}, returnData={}', [
    event.address.toHexString(),
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.warning('[Agent][RecoverToVault] proxyAddress={}, vault={}, token={}, amount={}', [
    event.address.toHexString(),
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}
