import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {Bytes, store} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetApp, NewAppProxy} from '../types/Kernel/Kernel'

// Import entity types from the schema
import {ACL, Vault, EVMScriptRegistry, Kernel, TokenManager, Finance, Voting, BaseApp} from '../types/schema'

import {
  KERNEL_CORE_APP_ID,
  APP_DEFAULT_VOTING_APP_ID,
  APP_DEFAULT_TOKENMANGER_APP_ID,
  APP_DEFAULT_FINANCE_APP_ID,
  KERNEL_DEFAULT_VAULT_APP_ID,
  KERNEL_DEFAULT_ACL_APP_ID,
  KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID,
  KERNEL_APP_ADDR_NAMESPACE,
  KERNEL_APP_BASES_NAMESPACE,
} from './constants'


export function handleSetApp(event: SetApp): void {
  let id = event.params.appId.toHex()
  let namespaceHash = event.params.namespace.toHex()
  let proxyAddressID = event.params.app.toHex()
  let kernelAddress = event.address.toHex()

  // one time instantiation of the kernel app, will run on the first time this event gets called
  if (store.get("kernel", kernelAddress) == null){
    let kernel = new Kernel()
    kernel.appID = KERNEL_CORE_APP_ID
    store.set("Kernel", kernelAddress, kernel)
  }

  if (namespaceHash == KERNEL_APP_BASES_NAMESPACE) {

    let baseApp = store.get("BaseApp", id) as BaseApp | null
    if (baseApp == null) {
      baseApp = new BaseApp()
    }
    baseApp.baseAddress = event.params.app
    store.set("BaseApp", id, baseApp as BaseApp)

    // Right now just notes that it has been stored in the mapping that indicates its a default app
    // Only Vault, ACL, and EVM get this
    // Always ran 3rd
  } else if (namespaceHash == KERNEL_APP_ADDR_NAMESPACE) {
    if (id == KERNEL_DEFAULT_VAULT_APP_ID) {
      let vault = store.get("Vault", proxyAddressID) as Vault | null
      if (vault == null) {
        vault = new Vault()
      }
      vault.defaultApp = true
      store.set("Vault", proxyAddressID, vault as Vault)
    }
    else if (id == KERNEL_DEFAULT_ACL_APP_ID) {
      let acl = store.get("ACL", proxyAddressID) as ACL | null
      if (acl == null) {
        acl = new ACL()
      }
      acl.defaultApp = true
      store.set("ACL", proxyAddressID, acl as ACL)
    }
    else {
      let evmsr = store.get("EVMScriptRegistry", proxyAddressID) as EVMScriptRegistry | null
      if (evmsr == null) {
        evmsr = new EVMScriptRegistry()
      }
      evmsr.defaultApp = true
      store.set("EVMScriptRegistry", proxyAddressID, evmsr as EVMScriptRegistry)
    }
  }
}

  export function handleNewProxyApp(event: NewAppProxy): void {
    let id = event.params.proxy.toHex()
    let appID = event.params.appId.toHex()


    // Some reason a switch case statement was giving AS errors, string to u32 requires implicit cast
    // so I went with the ugly if else chain
    if (appID == KERNEL_DEFAULT_VAULT_APP_ID) {
      let vault = store.get("Vault", id) as Vault | null
      if (vault == null) {
        vault = new Vault()
      }
      vault.appID = event.params.appId
      vault.upgradeable = event.params.isUpgradeable

      let baseVault = store.get("BaseApp", appID) as BaseApp
      vault.baseAddress = baseVault.baseAddress

      store.set("Vault", id, vault as Vault)

    } else if (appID == KERNEL_DEFAULT_ACL_APP_ID) {
      let acl = store.get("ACL", id) as ACL | null
      if (acl == null) {
        acl = new ACL()
      }
      acl.appID = event.params.appId
      acl.upgradeable = event.params.isUpgradeable

      let baseAcl = store.get("BaseApp", appID) as BaseApp
      acl.baseAddress = baseAcl.baseAddress

      store.set("ACL", id, acl as ACL)

    } else if (appID == KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID) {
      let evmsr = store.get("EVMScriptRegistry", id) as EVMScriptRegistry | null
      if (evmsr == null) {
        evmsr = new EVMScriptRegistry()
        evmsr.executors = new Array<Bytes>()
      }

      evmsr.appID = event.params.appId
      evmsr.upgradeable = event.params.isUpgradeable

      let baseEvmsr = store.get("BaseApp", appID) as BaseApp
      evmsr.baseAddress = baseEvmsr.baseAddress

      store.set("EVMScriptRegistry", id, evmsr as EVMScriptRegistry)

    } else if (appID == APP_DEFAULT_TOKENMANGER_APP_ID) {
      let tm = store.get("TokenManager", id) as TokenManager | null
      if (tm == null) {
        tm = new TokenManager()
      }
      tm.appID = event.params.appId
      tm.upgradeable = event.params.isUpgradeable

      let baseTM = store.get("BaseApp", appID) as BaseApp
      tm.baseAddress = baseTM.baseAddress

      store.set("TokenManager", id, tm as TokenManager)

    } else if (appID == APP_DEFAULT_VOTING_APP_ID) {
      let voting = store.get("Voting", id) as Voting | null
      if (voting == null) {
        voting = new Voting()
      }
      voting.appID = event.params.appId
      voting.upgradeable = event.params.isUpgradeable

      let baseVoting = store.get("BaseApp", appID) as BaseApp
      voting.baseAddress = baseVoting.baseAddress

      store.set("Voting", id, voting as Voting)

    } else if (appID == APP_DEFAULT_FINANCE_APP_ID) {
      let finance = store.get("Finance", id) as Finance | null
      if (finance == null) {
        finance = new Finance()
      }
      finance.appID = event.params.appId
      finance.upgradeable = event.params.isUpgradeable

      let baseFinance = store.get("BaseApp", appID) as BaseApp
      finance.baseAddress = baseFinance.baseAddress

      store.set("Finance", id, finance as Finance)

    }
  }