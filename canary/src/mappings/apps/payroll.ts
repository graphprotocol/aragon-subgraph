import { log } from '@graphprotocol/graph-ts'

import { RecoverToVault, ScriptResult } from '../../../generated/templates/Payroll/Payroll'

export function handleScriptResult(event: ScriptResult): void {
  log.warning('[Payroll][ScriptResult] proxyAddress={}, executor={}, script={}, input={}, returnData={}', [
    event.address.toHexString(),
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.warning('[Payroll][RecoverToVault] proxyAddress={}, vault={}, token={}, amount={}', [
    event.address.toHexString(),
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}
