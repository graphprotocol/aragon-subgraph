import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetApp, NewAppProxy} from '../types/Kernel/Kernel'

// Import entity types from the schema
import {App} from '../types/schema'

// const KERNEL_CORE_APP_ID: string = "0x3b4bf6bf3ad5000ecf0f989d5befde585c6860fea3e574a4fab4c49d1c177d9c"
const KERNEL_DEFAULT_ACL_APP_ID = "0xe3262375f45a6e2026b7e7b18c2b807434f2508fe1a2a3dfb493c7df8f4aad6a"
const KERNEL_DEFAULT_VAULT_APP_ID = "0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1"
const KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID = "0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61"

const APP_DEFAULT_TOKENMANGER_APP_ID = "0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f"
const APP_DEFAULT_VOTING_APP_ID = "0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4"
const APP_DEFAULT_FINANCE_APP_ID = "0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae"

export function handleSetApp(event: SetApp): void {
  let id: string = event.params.appId.toHex() //TODO: these cant be used as ids in a subgraph that combines all DAOS, because these repeat for every dao
  let app = store.get("ACL", id) as App | null


  if (app == null) {
    app = new App()
    app.namespace = []
    app.appAddress = []

    // Some reason a switch case statement was giving AS errors, string to u32 requires implicit cast
    // so I went with the ugly if else chain
    if (id == KERNEL_DEFAULT_VAULT_APP_ID) {
      app.appName = "VAULT"
    } else if (id == KERNEL_DEFAULT_ACL_APP_ID) {
      app.appName = "ACL"
    } else if (id == KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID) {
      app.appName = "EVM_SCRIPT_REGISTRY"
    } else if (id == APP_DEFAULT_TOKENMANGER_APP_ID) {
      app.appName = "TOKEN_MANAGER"
    } else if (id == APP_DEFAULT_VOTING_APP_ID) {
      app.appName = "VOTING"
    } else if (id == APP_DEFAULT_FINANCE_APP_ID) {
      app.appName = "FINANCE"
    } else {
      app.appName = "UNKNOWN"
    }
  }

  let namespace = app.namespace
  let appAddress = app.appAddress

  namespace.push(event.params.namespace)
  appAddress.push(event.params.app)

  app.namespace = namespace
  app.appAddress = appAddress

  store.set("App", id, app as App)

}

export function handleNewProxyApp(event: NewAppProxy): void {
  let id = event.params.appId.toHex()
  let app = store.get("ACL", id) as App | null

  if (app == null) {
    app = new App()
    app.proxyAddress = []
  }
  app.upgradeable = event.params.isUpgradeable

  let proxyAddress = app.proxyAddress
  proxyAddress.push(event.params.proxy)
  app.proxyAddress = proxyAddress

  store.set("App", id, app as App)

}
