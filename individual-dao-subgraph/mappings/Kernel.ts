import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetApp, NewAppProxy} from '../types/Kernel/Kernel'

// Import entity types from the schema
import {DefaultApp, BaseApp, ProxyApp} from '../types/schema'

import {kernalConstants}  from './constants'


export function handleSetApp(event: SetApp): void {
  let id = event.params.appId.toHex()
  let namespaceHash = event.params.namespace.toHex() //is this converstion ok?
  let appName: string = appNameResolver(id)

  // Some reason a switch case statement was giving AS errors, string to u32 requires implicit cast
  // so I went with the ugly if else chain


  // this if statement should only ever be emitted once, so we don't need store.get
  if (namespaceHash == kernalConstants.KERNEL_APP_ADDR_NAMESPACE) {
    let da = new DefaultApp()
    da.proxyAddress = event.params.app
    da.appName = appName
    store.set("DefaultApp", id, da)

    // this one can have the base address updated, so we use store.get
  } else {
    let ba = store.get("BaseApp", id) as BaseApp | null

    if (ba == null) {
      ba = new BaseApp()
      ba.baseAddress = event.params.app
      ba.appName = appName
    } else {
      ba.baseAddress = event.params.app
    }

    store.set("BaseApp", id, ba as BaseApp)
  }
}

// This entity also can't be updated, so store.get not needed
export function handleNewProxyApp(event: NewAppProxy): void {
  let id = event.params.proxy.toHex()
  let app = new ProxyApp()

  let appName: string = appNameResolver(event.params.appId.toHex())
  app.upgradeable = event.params.isUpgradeable
  app.appID = event.params.appId
  app.appName = appName

  store.set("ProxyApp", id, app as ProxyApp)

}

////////////////////////Helpers Below

function appNameResolver (hash: string): string {
  let appName:string

  if (hash == kernalConstants.KERNEL_DEFAULT_VAULT_APP_ID) {
    appName = "VAULT"
  } else if (hash == kernalConstants.KERNEL_DEFAULT_ACL_APP_ID) {
    appName = "ACL"
  } else if (hash == kernalConstants.KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID) {
    appName = "EVM_SCRIPT_REGISTRY"
  } else if (hash == kernalConstants.APP_DEFAULT_TOKENMANGER_APP_ID) {
    appName = "TOKEN_MANAGER"
  } else if (hash == kernalConstants.APP_DEFAULT_VOTING_APP_ID) {
    appName = "VOTING"
  } else if (hash == kernalConstants.APP_DEFAULT_FINANCE_APP_ID) {
    appName = "FINANCE"
  } else {
    appName = "UNKNOWN"
  }

  return appName
}