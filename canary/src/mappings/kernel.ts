import { log } from '@graphprotocol/graph-ts'

import {
  ProxyDeposit as ProxyDepositEvent,
  SetApp as SetAppEvent,
} from '../../generated/templates/Kernel/KernelProxy'

export function handleProxyDeposit(event: ProxyDepositEvent): void {
  log.warning('[Kernel][ProxyDeposit] sender={}, value={}', [
    event.params.sender.toHex(),
    event.params.value.toString(),
  ])
}

export function handleSetApp(event: SetAppEvent): void {
  log.warning('[Kernel][SetApp] namespace={}, appId={}, appAddress={}', [
    event.params.namespace.toHex(),
    event.params.appId.toHex(),
    event.params.app.toHex(),
  ])
}
