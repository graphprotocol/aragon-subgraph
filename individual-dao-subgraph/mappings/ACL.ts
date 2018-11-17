import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store, Bytes} from '@graphprotocol/graph-ts'

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
  VaultPermission
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
  EVM_SCRIPT_REGISTY_REGISTRY_ADD_EXECUTOR_ROLE_HASH,
  EVM_SCRIPT_REGISTY_REGISTRY_MANAGER_ROLE_HASH,
  VAULT_TRANSFER_ROLE_HASH,
  ACL_CREATE_PERMISSIONS_ROLE_HASH,
  KERNEL_APP_MANAGER_ROLE_HASH,
  APP_DEFAULT_VOTING_APP_ID,
  APP_DEFAULT_TOKENMANGER_APP_ID,
  APP_DEFAULT_FINANCE_APP_ID,
  KERNEL_DEFAULT_VAULT_APP_ID,
  KERNEL_DEFAULT_ACL_APP_ID,
  KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID,
  ZERO_ADDR
} from './constants'


// -     event SetPermission(address indexed entity, address indexed app, bytes32 indexed role, bool allowed); 759b9a74d
// -     event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash);
// -     event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager); f3addc8b8
// -     event ScriptResult(address indexed executor, bytes script, bytes input, bytes returnData);

//so i need to take into account that bool allowed means we have added a guy, and that bool remove will remove a guy
// okay, ultimately I gotta figure out how to pop out stuff from arrays, so i should learn now
export function handleSetPermission(event: SetPermission): void {
  let id = event.params.app.toHex()
  let role = event.params.role.toHex()
  let entity = event.params.entity

// VAULT //////////////////////
  if (store.get("Vault", id) != null) {
    let vp = store.get("VaultPermission", id) as VaultPermission | null
    if (vp == null) {
      vp = new VaultPermission()
      vp.canTransfer = new Array<Bytes>()
    }
    if (event.params.allowed == true) {
      let canTransfer = vp.canTransfer
      canTransfer.push(entity)
      vp.canTransfer = canTransfer
      store.set("VaultPermission", id, vp as VaultPermission)
    } else {
      let canTransfer = vp.canTransfer
      let i = canTransfer.indexOf(entity)
      canTransfer.splice(i, 1)
      vp.canTransfer = canTransfer
      store.set("VaultPermission", id, vp as VaultPermission)
    }

  }
  // TOKEN MANAGER //////////////////////

  else if (store.get("TokenManager", id) != null) {
    let tmp = store.get("TokenManagerPermission", id) as TokenManagerPermission | null
    if (tmp == null) {
      tmp = new TokenManagerPermission()
      tmp.canIssue = new Array<Bytes>()
      tmp.canRevokeVestings = new Array<Bytes>()
      tmp.canMint = new Array<Bytes>()
      tmp.canBurn = new Array<Bytes>()
      tmp.canAssign = new Array<Bytes>()
    }
    if (event.params.allowed == true) {
      if (role == TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH) {
        let revokeVestings = tmp.canRevokeVestings
        if (revokeVestings.indexOf(entity) == -1) {
          revokeVestings.push(entity)
          tmp.canRevokeVestings = revokeVestings
          store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
        }
      } else if (role == TOKEN_MANAGER_MINT_ROLE_HASH) {
        let minters = tmp.canMint
        if (minters.indexOf(entity) == -1) { //todo , some reason this isn't working, it still pushes duplicate values. need to fix
          minters.push(entity)
          tmp.canMint = minters
          store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
        }
      } else if (role == TOKEN_MANAGER_ISSUE_ROLE_HASH) {
        let issuers = tmp.canIssue
        if (issuers.indexOf(entity) == -1) {
          issuers.push(entity)
          tmp.canIssue = issuers
          store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
        }
      } else if (role == TOKEN_MANAGER_BURN_ROLE_HASH) {
        let burners = tmp.canBurn
        if (burners.indexOf(entity) == -1) {
          burners.push(entity)
          tmp.canBurn = burners
          store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
        }
      } else if (role == TOKEN_MANAGER_ASSIGN_ROLE_HASH) {
        let assigners = tmp.canAssign
        if (assigners.indexOf(entity) == -1) {
          assigners.push(entity)
          tmp.canAssign = assigners
          store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
        }
      }
    } else if (event.params.allowed == false) {
      if (role == TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH) {
        let revokeVestings = tmp.canRevokeVestings
        let i = revokeVestings.indexOf(entity)
        revokeVestings.splice(i, 1)
        tmp.canRevokeVestings = revokeVestings
        store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
      } else if (role == TOKEN_MANAGER_MINT_ROLE_HASH) {
        let minters = tmp.canMint
        let i = minters.indexOf(entity)
        minters.splice(i, 1)
        tmp.canMint = minters
        store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
      } else if (role == TOKEN_MANAGER_ISSUE_ROLE_HASH) {
        let issuers = tmp.canIssue
        let i = issuers.indexOf(entity)
        issuers.splice(i, 1)
        tmp.canIssue = issuers
        store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
      } else if (role == TOKEN_MANAGER_BURN_ROLE_HASH) {
        let burners = tmp.canBurn
        let i = burners.indexOf(entity)
        burners.splice(i, 1)
        tmp.canBurn = burners
        store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
      } else if (role == TOKEN_MANAGER_ASSIGN_ROLE_HASH) {
        let assigners = tmp.canAssign
        let i = assigners.indexOf(entity)
        assigners.splice(i, 1)
        tmp.canAssign = assigners
        store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
      }

    }

    // FINANCE //////////////////////

    /// TODO: this one is returning blank arrays, not sure why. 
  } else if (store.get("FinancePermission", id) != null) {
    let fp = store.get("FinancePermission", id) as FinancePermission | null
    if (fp == null) {
      fp = new FinancePermission()
      fp.canChangeBudget = new Array<Bytes>()
      fp.canChangePeriod = new Array<Bytes>()
      fp.canCreatePayments = new Array<Bytes>()
      fp.canExecutePayments = new Array<Bytes>()
      fp.canManagePayments = new Array<Bytes>()
    }
    if (event.params.allowed == true) {
      if (role == FINANCE_EXECUTE_PAYMENTS_ROLE_HASH) {
        let executePayments = fp.canExecutePayments
        if (executePayments.indexOf(entity) == -1) {
          executePayments.push(entity)
          fp.canExecutePayments = executePayments
          store.set("FinancePermission", id, fp as FinancePermission)
        }
      } else if (role == FINANCE_MANAGE_PAYMENTS_ROLE_HASH) {
        let managePayments = fp.canManagePayments
        if (managePayments.indexOf(entity) == -1) {
          managePayments.push(entity)
          fp.canManagePayments = managePayments
          store.set("FinancePermission", id, fp as FinancePermission)
        }
      } else if (role == FINANCE_CREATE_PAYMENTS_ROLE_HASH) {
        let changePeriods = fp.canChangePeriod
        if (changePeriods.indexOf(entity) == -1) {
          changePeriods.push(entity)
          fp.canChangePeriod = changePeriods
          store.set("FinancePermission", id, fp as FinancePermission)
        }
      } else if (role == FINANCE_CHANGE_BUDGETS_ROLE_HASH) {
        let changeBudgets = fp.canChangeBudget
        if (changeBudgets.indexOf(entity) == -1) {
          changeBudgets.push(entity)
          fp.canChangeBudget = changeBudgets
          store.set("FinancePermission", id, fp as FinancePermission)
        }
      } else if (role == FINANCE_CHANGE_PERIOD_ROLE_HASH) {
        let createPayments = fp.canCreatePayments
        if (createPayments.indexOf(entity) == -1) {
          createPayments.push(entity)
          fp.canCreatePayments = createPayments
          store.set("FinancePermission", id, fp as FinancePermission)
        }
      }
    } else if (event.params.allowed == false) {
      if (role == FINANCE_EXECUTE_PAYMENTS_ROLE_HASH) {
        let executePayments = fp.canExecutePayments
        let i = executePayments.indexOf(entity)
        executePayments.splice(i, 1)
        fp.canExecutePayments = executePayments
        store.set("FinancePermission", id, fp as FinancePermission)
      } else if (role == FINANCE_MANAGE_PAYMENTS_ROLE_HASH) {
        let managePayments = fp.canManagePayments
        let i = managePayments.indexOf(entity)
        managePayments.splice(i, 1)
        fp.canManagePayments = managePayments
        store.set("FinancePermission", id, fp as FinancePermission)
      } else if (role == FINANCE_CREATE_PAYMENTS_ROLE_HASH) {
        let createPayments = fp.canCreatePayments
        let i = createPayments.indexOf(entity)
        createPayments.splice(i, 1)
        fp.canCreatePayments = createPayments
        store.set("FinancePermission", id, fp as FinancePermission)
      } else if (role == FINANCE_CHANGE_BUDGETS_ROLE_HASH) {
        let changeBudgets = fp.canChangeBudget
        let i = changeBudgets.indexOf(entity)
        changeBudgets.splice(i, 1)
        fp.canChangeBudget = changeBudgets
        store.set("FinancePermission", id, fp as FinancePermission)
      } else if (role == FINANCE_CHANGE_PERIOD_ROLE_HASH) {
        let changesPeriod = fp.canChangePeriod
        let i = changesPeriod.indexOf(entity)
        changesPeriod.splice(i, 1)
        fp.canChangePeriod = changesPeriod
        store.set("FinancePermission", id, fp as FinancePermission)
      }

    }
  }
}


export function handleChangePermissionManager(event: ChangePermissionManager): void {
}

// hasnt been called on my app, but it will be
export function handleSetPermissionParams(event: SetPermissionParams): void {

}

// 99% sure we dont need
export function handleScriptResult(event: ScriptResult): void {

}

// function roleResolver(roleHash: string, appAddress: string, entity: string): AppRole {
//
// let app = store.get("ProxyApp", appAddress) as ProxyApp
// let appID = app.appID.toHex()
//
// let appRole = store.get("AppRole", appAddress) as AppRole
// if (appRole == null) {
//   appRole = new AppRole()
// }
//
// let roleName: string
//
// // Finance roles
// if (appID == APP_DEFAULT_FINANCE_APP_ID) {
//   if (roleHash == FINANCE_MANAGE_PAYMENTS_ROLE_HASH) {
//     roleName = "manage_payments_role"
//     appRole.manage_payments_role = entity
//   }
//   else if (roleHash == FINANCE_CHANGE_BUDGETS_ROLE_HASH) {
//     roleName = "CHANGE_BUDGET_ROLE"
//     appRole.CHANGE_BUDGET_ROLE = entity
//
//   }
//   else if (roleHash == FINANCE_CHANGE_PERIOD_ROLE_HASH_HASH) {
//     roleName = "CHANGE_PERIOD_ROLE"
//     appRole.CHANGE_PERIOD_ROLE = entity
//
//   }
//   else if (roleHash == FINANCE_CREATE_PAYMENTS_ROLE_HASH) {
//     roleName = "CREATE_PAYMENTS_ROLE"
//     appRole.CREATE_PAYMENTS_ROLE = entity
//
//   }
//   else if (roleHash == FINANCE_EXECUTE_PAYMENTS_ROLE_HASH) {
//     roleName = "EXECUTE_PAYMENTS_ROLE"
//     appRole.EXECUTE_PAYMENTS_ROLE = entity
//
//   }
//   else {
//     roleName = "UNKNOWN_FINANCE_ROLE"
//     appRole.manage_payments_role = entity
//
//   }
// }
//
// // Token Manager roles
// else if (appID == APP_DEFAULT_TOKENMANGER_APP_ID) {
//   if (roleHash == TOKEN_MANAGER_ASSIGN_ROLE_HASH) {
//     roleName = "ASSIGN ROLE"
//   }
//   else if (roleHash == TOKEN_MANAGER_BURN_ROLE_HASH) {
//     roleName = "BURN ROLE"
//   }
//   else if (roleHash == TOKEN_MANAGER_ISSUE_ROLE_HASH) {
//     roleName = "ISSUE ROLE"
//   }
//   else if (roleHash == TOKEN_MANAGER_MINT_ROLE_HASH) {
//     roleName = "MINT ROLE"
//   }
//   else if (roleHash == TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH) {
//     roleName = "REVOKE VESTINGS ROLE"
//   }
//   else {
//     roleName = "UNKNOWN TOKEN MANAGER ROLE"
//   }
// }
//
// // Voting Roles
// else if (appID == APP_DEFAULT_VOTING_APP_ID) {
//   if (roleHash == VOTING_CREATE_VOTES_ROLE_HASH) {
//     roleName = "CREATE VOTES ROLE"
//   }
//   else if (roleHash == VOTING_MODIFY_QUORUM_ROLE_HASH) {
//     roleName = "MODIFY QUORUM ROLE"
//   }
//   else if (roleHash == VOTING_MODIFY_SUPPORT_ROLE_HASH) {
//     roleName = "MODIFY SUPPORT ROLE"
//   }
//   else {
//     roleName = "UNKNOWN VOTING ROLE"
//   }
// }
//
// // EVM Script Roles
// else if (appID == KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID) {
//   if (roleHash == EVM_SCRIPT_REGISTY_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
//     roleName = "CREATE VOTES ROLE"
//   }
//   else if (roleHash == EVM_SCRIPT_REGISTY_REGISTRY_MANAGER_ROLE_HASH) {
//     roleName = "MODIFY QUORUM ROLE"
//   }
//   else {
//     roleName = "UNKNOWN EVM SCRIPT ROLE"
//   }
// }
//
// // Vault Role
// else if (appID == KERNEL_DEFAULT_VAULT_APP_ID) {
//   if (roleHash == VAULT_TRANSFER_ROLE_HASH) {
//     roleName = "TRANSFER ROLE"
//   }
//   else {
//     roleName = "UNKNOWN VAULT ROLE"
//   }
// }
//
// // ACL Role
// else if (appID == KERNEL_DEFAULT_ACL_APP_ID) {
//   if (roleHash == ACL_CREATE_PERMISSIONS_ROLE_HASH) {
//     roleName = "CREATE PERMISSIONS ROLE"
//   }
//   else {
//     roleName = "UNKNOWN ACL ROLE"
//   }
// }
//
// // Kernel Role
// else { // this assumes unknown is the kernel. this is not safe right now, as it isn't 100% true. this is because right now we don't have the kernel as an app, cuz its event is emitted by DAO Factory
//   roleName = "APP MANAGER ROLE"
// }
//
// return appRole
// }