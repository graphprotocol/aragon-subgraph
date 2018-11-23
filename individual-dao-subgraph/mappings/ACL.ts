import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store, Bytes, Value, BigInt, TypedMap} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetPermission, SetPermissionParams, ChangePermissionManager, ScriptResult} from '../types/ACL/ACL'


// Import entity types from the schema
import {
  FinancePermission,
  TokenManagerPermission,
  VotingPermission,
  EVMScriptRegistryPermission,
  ACLPermission,
  KernelPermission,
  VaultPermission,
  TokenManagerManagers,
  FinanceManagers,
  VotingManagers,
  EVMScriptRegistryManagers,
  VaultManagers,
  ACLManagers, KernelManagers,
} from '../types/schema'

import {
  FINANCE_CHANGE_BUDGETS_ROLE_HASH,
  FINANCE_CHANGE_PERIOD_ROLE_HASH,
  FINANCE_CREATE_PAYMENTS_ROLE_HASH,
  FINANCE_MANAGE_PAYMENTS_ROLE_HASH,
  FINANCE_EXECUTE_PAYMENTS_ROLE_HASH,
  TOKEN_MANAGER_ASSIGN_ROLE_HASH,
  TOKEN_MANAGER_BURN_ROLE_HASH,
  TOKEN_MANAGER_ISSUE_ROLE_HASH,
  TOKEN_MANAGER_MINT_ROLE_HASH,
  TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH,
  VOTING_CREATE_VOTES_ROLE_HASH,
  VOTING_MODIFY_QUORUM_ROLE_HASH,
  VOTING_MODIFY_SUPPORT_ROLE_HASH,
  EVM_SCRIPT_REGISTRY_ADD_EXECUTOR_ROLE_HASH,
  EVM_SCRIPT_REGISTRY_MANAGER_ROLE_HASH, // alias for enable and disable executors
  VAULT_TRANSFER_ROLE_HASH,
  ACL_CREATE_PERMISSIONS_ROLE_HASH,
  KERNEL_APP_MANAGER_ROLE_HASH,
} from './constants'


let roleLookupTable = new TypedMap<string, string>();
roleLookupTable.set(TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH, 'CanRevokeVestings')
roleLookupTable.set(TOKEN_MANAGER_MINT_ROLE_HASH, 'CanMint')
roleLookupTable.set(TOKEN_MANAGER_ISSUE_ROLE_HASH, 'CanIssue')
roleLookupTable.set(TOKEN_MANAGER_BURN_ROLE_HASH, 'CanBurn')
roleLookupTable.set(TOKEN_MANAGER_ASSIGN_ROLE_HASH, 'CanAssign')
roleLookupTable.set(FINANCE_CHANGE_BUDGETS_ROLE_HASH, 'CanChangeBudget')
roleLookupTable.set(FINANCE_CHANGE_PERIOD_ROLE_HASH, 'CanChangePeriod')
roleLookupTable.set(FINANCE_CREATE_PAYMENTS_ROLE_HASH, 'CanCreatePayments')
roleLookupTable.set(FINANCE_MANAGE_PAYMENTS_ROLE_HASH, 'CanManagePayments')
roleLookupTable.set(FINANCE_EXECUTE_PAYMENTS_ROLE_HASH, 'CanExecutePayments')
roleLookupTable.set(VOTING_CREATE_VOTES_ROLE_HASH, 'CanCreateVotes')
roleLookupTable.set(VOTING_MODIFY_QUORUM_ROLE_HASH, 'CanModifyQuorum')
roleLookupTable.set(VOTING_MODIFY_SUPPORT_ROLE_HASH, 'CanModifySupport')
roleLookupTable.set(EVM_SCRIPT_REGISTRY_ADD_EXECUTOR_ROLE_HASH, 'CanAddExecutor')
roleLookupTable.set(EVM_SCRIPT_REGISTRY_MANAGER_ROLE_HASH, 'CanEnableAndDisableExecutors')
roleLookupTable.set(VAULT_TRANSFER_ROLE_HASH, 'CanTransfer')
roleLookupTable.set(ACL_CREATE_PERMISSIONS_ROLE_HASH, 'CanCreatePermissions')
roleLookupTable.set(KERNEL_APP_MANAGER_ROLE_HASH, 'CanManageApps')


//   // NOTE - getting some weird results with splice here, on random instance (see the queries .  it seems to me like there is an error with how it is written.
//   // Because i use it the same way 5 times, and in this instance it deletes the wrong element, and then replaces it with a duplicate of a different element.
//   // I saw this while testing on rinkeby. Must keep an eye on it ( i can't reproduce it at the moment

export function handleSetPermission(event: SetPermission): void {
  let id = event.params.app.toHex()
  let role = event.params.role.toHex()
  let entity = event.params.entity.toHex()

  // Vault
  if (store.get("Vault", id) != null) {
    let vp = store.get("VaultPermission", role) as VaultPermission | null
    if (vp == null) {
      vp = new VaultPermission()
      vp.entities = new Array<string>()
      vp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      vp.role = roleName
      let entities = vp.entities
      entities.push(entity)
      vp.entities = entities
      store.set("VaultPermission", role, vp as VaultPermission)
    } else  if (event.params.allowed == false){
      let entities = vp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      vp.entities = entities
      store.set("VaultPermission", role, vp as VaultPermission)
    }
  }

  // Token Manager
  else if (store.get("TokenManager", id) != null) {
    let tmp = store.get("TokenManagerPermission", role) as TokenManagerPermission | null
    if (tmp == null) {
      tmp = new TokenManagerPermission()
      tmp.entities = new Array<string>()
      tmp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      tmp.role = roleName
      let entities = tmp.entities
      entities.push(entity)
      tmp.entities = entities
      store.set("TokenManagerPermission", role, tmp as TokenManagerPermission)
    } else if (event.params.allowed == false) {
      let entities = tmp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      tmp.entities = entities
      store.set("TokenManagerPermission", role, tmp as TokenManagerPermission)
    }
  }

  // Finance
  else if (store.get("Finance", id) != null) {
    let fp = store.get("FinancePermission", role) as FinancePermission | null
    if (fp == null) {
      fp = new FinancePermission()
      fp.entities = new Array<string>()
      fp.appAddress = id
      if (event.params.allowed == true) {
        let roleName = roleLookupTable.get(role) as string
        fp.role = roleName
        let entities = fp.entities
        entities.push(entity)
        fp.entities = entities
        store.set("FinancePermission", role, fp as FinancePermission)
      } else if (event.params.allowed == false) {
        let entities = fp.entities
        let i = entities.indexOf(entity)
        entities.splice(i, 1)
        fp.entities = entities
        store.set("FinancePermission", role, fp as FinancePermission)
      }
    }
  }

  // Voting
  else if (store.get("Voting", id) != null) {
    let vp = store.get("VotingPermission", role) as VotingPermission | null
    if (vp == null) {
      vp = new VotingPermission()
      vp.entities = new Array<string>()
      vp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      vp.role = roleName
      let entities = vp.entities
      entities.push(entity)
      vp.entities = entities
      store.set("VotingPermission", role, vp as VotingPermission)
    } else if (event.params.allowed == false) {
      let entities = vp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      vp.entities = entities
      store.set("VotingPermission", role, vp as VotingPermission)
    }
  }

  // EVMScriptRegistry
  else if (store.get("EVMScriptRegistry", id) != null) {
    let evmsr = store.get("EVMScriptRegistryPermission", role) as EVMScriptRegistryPermission | null
    if (evmsr == null) {
      evmsr = new EVMScriptRegistryPermission()
      evmsr.entities = new Array<string>()
      evmsr.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      evmsr.role = roleName
      let entities = evmsr.entities
      entities.push(entity)
      evmsr.entities = entities
      store.set("EVMScriptRegistryPermission", role, evmsr as EVMScriptRegistryPermission)
    } else if (event.params.allowed == false) {
      let entities = evmsr.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      evmsr.entities = entities
      store.set("EVMScriptRegistryPermission", role, evmsr as EVMScriptRegistryPermission)
    }
  }

  // ACL
  else if (store.get("ACL", id) != null) {
    let aclp = store.get("ACLPermission", role) as ACLPermission | null
    if (aclp == null) {
      aclp = new ACLPermission()
      aclp.entities = new Array<string>()
      aclp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      aclp.role = roleName
      let entities = aclp.entities
      entities.push(entity)
      aclp.entities = entities
      store.set("ACLPermission", role, aclp as ACLPermission)
    } else if (event.params.allowed == false) {
      let entities = aclp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      aclp.entities = entities
      store.set("ACLPermission", role, aclp as ACLPermission)
    }
  }

  // Kernel
  else if (store.get("Kernel", id) != null) {
    let kp = store.get("KernelPermission", role) as KernelPermission | null
    if (kp == null) {
      kp = new KernelPermission()
      kp.entities = new Array<string>()
      kp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      kp.role = roleName
      let entities = kp.entities
      entities.push(entity)
      kp.entities = entities
      store.set("KernelPermission", role, kp as KernelPermission)
    } else if (event.params.allowed == false) {
      let entities = kp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      kp.entities = entities
      store.set("KernelPermission", role, kp as KernelPermission)
    }
  }
}

export function handleChangePermissionManager(event: ChangePermissionManager): void {
  let id = event.params.app.toHex()
  let role = event.params.role.toHex()
  let manager = event.params.manager

  // VAULT
  if (store.get("Vault", id) != null) {
    let vm = store.get("VaultManagers", id) as VaultManagers | null
    if (vm == null) {
      vm = new VaultManagers()
    }
    vm.managesTransfers = manager
    store.set("VaultManagers", id, vm as VaultManagers)

  }

  // TOKEN MANAGER
  else if (store.get("TokenManager", id) != null) {
    let tmm = store.get("TokenManagerManagers", id) as TokenManagerManagers | null
    if (tmm == null) {
      tmm = new TokenManagerManagers()
    }
    if (role == TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH) {
      tmm.managesRevokeVestings = manager
      store.set("TokenManagerManagers", id, tmm as TokenManagerManagers)

    } else if (role == TOKEN_MANAGER_MINT_ROLE_HASH) {
      tmm.managesMint = manager
      store.set("TokenManagerManagers", id, tmm as TokenManagerManagers)

    } else if (role == TOKEN_MANAGER_ISSUE_ROLE_HASH) {
      tmm.managesIssue = manager
      store.set("TokenManagerManagers", id, tmm as TokenManagerManagers)

    } else if (role == TOKEN_MANAGER_BURN_ROLE_HASH) {
      tmm.managesBurn = manager
      store.set("TokenManagerManagers", id, tmm as TokenManagerManagers)

    } else if (role == TOKEN_MANAGER_ASSIGN_ROLE_HASH) {
      tmm.managesAssign = manager
      store.set("TokenManagerManagers", id, tmm as TokenManagerManagers)
    }

  }

  // FINANCE
  else if (store.get("Finance", id) != null) {
    let fm = store.get("FinanceManagers", id) as FinanceManagers | null
    if (fm == null) {
      fm = new FinanceManagers()
    }
    if (role == FINANCE_EXECUTE_PAYMENTS_ROLE_HASH) {

      fm.managesExecutePayments = manager
      store.set("FinanceManagers", id, fm as FinanceManagers)

    } else if (role == FINANCE_MANAGE_PAYMENTS_ROLE_HASH) {

      fm.managesManagePayments = manager
      store.set("FinanceManagers", id, fm as FinanceManagers)

    } else if (role == FINANCE_CREATE_PAYMENTS_ROLE_HASH) {

      fm.managesCreatePayments = manager
      store.set("FinanceManagers", id, fm as FinanceManagers)

    } else if (role == FINANCE_CHANGE_BUDGETS_ROLE_HASH) {

      fm.managesChangeBudget = manager
      store.set("FinanceManagers", id, fm as FinanceManagers)

    } else if (role == FINANCE_CHANGE_PERIOD_ROLE_HASH) {
      fm.managesChangePeriod = manager
      store.set("FinanceManagers", id, fm as FinanceManagers)

    }
  }

  // VOTING
  else if (store.get("Voting", id) != null) {
    let vm = store.get("VotingManagers", id) as VotingManagers | null
    if (vm == null) {
      vm = new VotingManagers()
    }
    if (role == VOTING_MODIFY_SUPPORT_ROLE_HASH) {
      vm.managesModifySupport = manager
      store.set("VotingManagers", id, vm as VotingManagers)

    } else if (role == VOTING_MODIFY_QUORUM_ROLE_HASH) {
      vm.managesModifyQuorum = manager
      store.set("VotingManagers", id, vm as VotingManagers)

    } else if (role == VOTING_CREATE_VOTES_ROLE_HASH) {
      vm.managesCreateVotes = manager
      store.set("VotingManagers", id, vm as VotingManagers)
    }
  }

  // EVMScriptRegistry
  else if (store.get("EVMScriptRegistry", id) != null) {
    let evmsr = store.get("EVMScriptRegistryManagers", id) as EVMScriptRegistryManagers | null
    if (evmsr == null) {
      evmsr = new EVMScriptRegistryManagers()
    }
    if (role == EVM_SCRIPT_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
      evmsr.managesAddExecutor = manager
      store.set("EVMScriptRegistryManagers", id, evmsr as EVMScriptRegistryManagers)
    } else if (role == EVM_SCRIPT_REGISTRY_MANAGER_ROLE_HASH) {
      evmsr.managesEnableAndDisableExecutors = manager
      store.set("EVMScriptRegistryManagers", id, evmsr as EVMScriptRegistryManagers)
    }
  }

  // ACL
  // TODO: managers for ACL doesn't work. need to investigate
  else if (store.get("ACL", id) != null) {
    let am = store.get("ACLManagers", id) as ACLManagers | null
    if (am == null) {
      am = new ACLManagers()
    }
    am.managesCreatePermissions = manager
    store.set("ACLManagers", id, am as ACLManagers)
  }

  //Kernel
  else if (store.get("Kernel", id) != null) {
    let km = store.get("KernelManagers", id) as KernelManagers | null
    if (km == null) {
      km = new KernelManagers()
    }
    km.managesManageApps = manager
    store.set("KernelManagers", id, km as KernelManagers)
  }
}


// hasnt been called on my app, doesnt appear to be used anywhere in the DApp, leaving out
export function handleSetPermissionParams(event: SetPermissionParams): void {

}