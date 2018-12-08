// Import APIs from graph-ts
import {Bytes} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetApp, NewAppProxy} from '../types/Kernel/Kernel'

// Import entity types from the schema
import {
  ACL,
  Vault,
  EVMScriptRegistry,
  Kernel,
  TokenManager,
  Finance,
  Voting,
  BaseApp,
  KernelPermission
} from '../types/schema'

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
  if (Kernel.load(kernelAddress) == null){
    let kernel = new Kernel(kernelAddress)
    kernel.appID = KERNEL_CORE_APP_ID
    kernel.save()
  }

  if (namespaceHash == KERNEL_APP_BASES_NAMESPACE) {

    let baseApp = BaseApp.load(id)
    if (baseApp == null) {
      baseApp = new BaseApp(id)
    }
    baseApp.baseAddress = event.params.app
    baseApp.save()

    // Right now just notes that it has been stored in the mapping that indicates its a default app
    // Only Vault, ACL, and EVM get this
    // Always ran 3rd
  } else if (namespaceHash == KERNEL_APP_ADDR_NAMESPACE) {
    if (id == KERNEL_DEFAULT_VAULT_APP_ID) {
      let vault = Vault.load(proxyAddressID)
      if (vault == null) {
        vault = new Vault(proxyAddressID)
      }
      vault.defaultApp = true
      vault.save()
    }
    else if (id == KERNEL_DEFAULT_ACL_APP_ID) {
      let acl = ACL.load(proxyAddressID)
      if (acl == null) {
        acl = new ACL(proxyAddressID)
      }
      acl.defaultApp = true
      acl.save()
    }
    else {
      let evmsr = EVMScriptRegistry.load(proxyAddressID)
      if (evmsr == null) {
        evmsr = new EVMScriptRegistry(proxyAddressID)
      }
      evmsr.defaultApp = true
      evmsr.save()
    }
  }
}

  export function handleNewProxyApp(event: NewAppProxy): void {
    let id = event.params.proxy.toHex()
    let appID = event.params.appId.toHex()


    // Some reason a switch case statement was giving AS errors, string to u32 requires implicit cast
    // so I went with the ugly if else chain
    if (appID == KERNEL_DEFAULT_VAULT_APP_ID) {
      let vault = Vault.load(id)
      if (vault == null) {
        vault = new Vault(id)
      }
      vault.appID = event.params.appId
      vault.upgradeable = event.params.isUpgradeable

      let baseVault = BaseApp.load(appID)
      vault.baseAddress = baseVault.baseAddress

      vault.save()

    } else if (appID == KERNEL_DEFAULT_ACL_APP_ID) {
      let acl = ACL.load(id)
      if (acl == null) {
        acl = new ACL(id)
      }
      acl.appID = event.params.appId
      acl.upgradeable = event.params.isUpgradeable

      let baseAcl = BaseApp.load(appID)
      acl.baseAddress = baseAcl.baseAddress

      acl.save()

    } else if (appID == KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID) {
      let evmsr = EVMScriptRegistry.load(id)
      if (evmsr == null) {
        evmsr = new EVMScriptRegistry(id)
        evmsr.executors = new Array<Bytes>()
      }

      evmsr.appID = event.params.appId
      evmsr.upgradeable = event.params.isUpgradeable

      let baseEvmsr = BaseApp.load(appID)
      evmsr.baseAddress = baseEvmsr.baseAddress

      evmsr.save()

    } else if (appID == APP_DEFAULT_TOKENMANGER_APP_ID) {
      let tm = TokenManager.load(id)
      if (tm == null) {
        tm = new TokenManager(id)
      }
      tm.appID = event.params.appId
      tm.upgradeable = event.params.isUpgradeable

      let baseTM = BaseApp.load(appID)
      tm.baseAddress = baseTM.baseAddress

      tm.save()

    } else if (appID == APP_DEFAULT_VOTING_APP_ID) {
      let voting = Voting.load(id)
      if (voting == null) {
        voting = new Voting(id)
      }
      voting.appID = event.params.appId
      voting.upgradeable = event.params.isUpgradeable

      let baseVoting = BaseApp.load(appID)
      voting.baseAddress = baseVoting.baseAddress

      voting.save()

    } else if (appID == APP_DEFAULT_FINANCE_APP_ID) {
      let finance = Finance.load(id)
      if (finance == null) {
        finance = new Finance(id)
      }
      finance.appID = event.params.appId
      finance.upgradeable = event.params.isUpgradeable

      let baseFinance = BaseApp.load(appID)
      finance.baseAddress = baseFinance.baseAddress

      finance.save()

    }
  }