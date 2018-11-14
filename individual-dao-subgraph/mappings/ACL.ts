import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetPermission, SetPermissionParams, ChangePermissionManager, ScriptResult} from '../types/ACL/ACL'

// Import entity types from the schema
import {AppPermission, ProxyApp, AppRole} from '../types/schema'

import {
  FINANCE_CHANGE_BUDGETS_ROLE_HASH,
  FINANCE_CHANGE_PERIOD_ROLE_HASH_HASH,
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
} from './constants'


// -     event SetPermission(address indexed entity, address indexed app, bytes32 indexed role, bool allowed); 759b9a74d
// -     event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash);
// -     event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager); f3addc8b8
// -     event ScriptResult(address indexed executor, bytes script, bytes input, bytes returnData);

//so i need to take into account that bool allowed means we have added a guy, and that bool remove will remove a guy
// okay, ultimately I gotta figure out how to pop out stuff from arrays, so i should learn now
export function handleSetPermission(event: SetPermission): void {
  let id = event.params.app.toHex()
  let ap = store.get("AppPermission", id) as AppPermission | null
  // let allowed:string
  //
  //
  // if (event.params.allowed == true) {
  //    allowed = "true"
  // } else {
  //    allowed = "false"
  // }

  if (ap == null) {
    ap = new AppPermission()

    let app = store.get("ProxyApp", id) as ProxyApp
    ap.appName = app.appName
    // let entity:string = event.params.entity.toHex()
    //
    // let roleName = roleResolver(event.params.role.toHex(), id)
    //
    // ap[roleName] = entity
    // let roles = new Array<string>()
    // let roleString = "Entity: " + entity + " Role: " + roleName+  " Allowed: " + allowed
    //
    // roles.push(roleString)
    // let ar = roleResolver(event.params.role.toHex(), id, event.params.entity)

    // ap.roles = roles

    store.set("AppPermission", id, ap as AppPermission)

  } else {
    // let roleName = roleResolver(event.params.role.toHex(), id)
    // let entity:string = event.params.entity.toHex()
    // let roles = ap.roles
    // let roleString = "Entity: " + entity + " Role: " + roleName+  " Allowed: " + allowed
    // roles.push(roleString)
    // ap.roles = roles
    //
    // store.set("AppPermission", id, ap as AppPermission)
  }

  // if (ar == null){
  //   ar = new AppRoles()
  //   let entity:string = event.params.entity.toHex()

  // let ar = store.get("AppRoles", id) as AppRole | null

  let ar = roleResolver(event.params.role.toHex(), id, event.params.entity.toHex())

  store.set("AppRole", id, ar)

    // ar[roleName] = entity

}

//
// export function handleSetPermission(event: SetPermission): void {
//   let id = event.params.app.toHex()
//   let ap = store.get("AppPermission", id) as AppPermission | null
//   let allowed:string
//
//   if (event.params.allowed == true) {
//     allowed = "true"
//   } else {
//     allowed = "false"
//   }
//
//   if (ap == null) {
//     ap = new AppPermission()
//
//     let app = store.get("ProxyApp", id) as ProxyApp
//     ap.appName = app.appName
//     let entity:string = event.params.entity.toHex()
//
//     let roleName = roleResolver(event.params.role.toHex(), id)
//     let roles = new Array<string>()
//     let roleString = "Entity: " + entity + " Role: " + roleName+  " Allowed: " + allowed
//
//     roles.push(roleString)
//     ap.roles = roles
//
//     store.set("AppPermission", id, ap as AppPermission)
//
//   } else {
//     let roleName = roleResolver(event.params.role.toHex(), id)
//     let entity:string = event.params.entity.toHex()
//     let roles = ap.roles
//     let roleString = "Entity: " + entity + " Role: " + roleName+  " Allowed: " + allowed
//     roles.push(roleString)
//     ap.roles = roles
//
//     store.set("AppPermission", id, ap as AppPermission)
//   }
// }



export function handleChangePermissionManager(event: ChangePermissionManager): void {
  // let id = event.params.app.toHex()
  // let ap = store.get("AppPermission", id) as AppPermission | null
  //
  // if (ap == null) {
  //   ap = new AppPermission()
  //
  //   let app = store.get("ProxyApp", id) as ProxyApp
  //   ap.appName = app.appName
  //   let manager:string = event.params.manager.toHex()
  //
  //   let roleName = roleResolver(event.params.role.toHex(), id)
  //   let pms = new Array<string>()
  //   let roleString = "Manager: " + manager + " Role: " + roleName
  //
  //   pms.push(roleString)
  //   ap.permissionManagers = pms
  //
  //   store.set("AppPermission", id, ap as AppPermission)
  //
  // } else {
  //   let roleName = roleResolver(event.params.role.toHex(), id)
  //   let manager:string = event.params.manager.toHex()
  //   let pms = ap.permissionManagers
  //   let roleString = "Manager: " + manager + " Role: " + roleName
  //   pms.push(roleString)
  //   ap.permissionManagers = pms
  //
  //   store.set("AppPermission", id, ap as AppPermission)
  // }
}

// hasnt been called on my app, but it will be
export function handleSetPermissionParams(event: SetPermissionParams): void {
  // let id = event.params.reg.toHex()
  // let reg = new EVMScriptRegistry()
  // store.set("EVMScriptRegistry", id, reg)
}

// 99% sure we dont need
export function handleScriptResult(event: ScriptResult): void {

}

function roleResolver(roleHash: string, appAddress: string, entity: string): AppRole {

  let app = store.get("ProxyApp", appAddress) as ProxyApp
  let appID = app.appID.toHex()

  let appRole = store.get("AppRole", appAddress) as AppRole
  if (appRole == null) {
    appRole = new AppRole()
  }

  let roleName: string

  // Finance roles
  if (appID == APP_DEFAULT_FINANCE_APP_ID) {
    if (roleHash == FINANCE_MANAGE_PAYMENTS_ROLE_HASH) {
      roleName = "manage_payments_role"
      appRole.manage_payments_role = entity
    }
    else if (roleHash == FINANCE_CHANGE_BUDGETS_ROLE_HASH) {
      roleName = "CHANGE_BUDGET_ROLE"
      appRole.CHANGE_BUDGET_ROLE = entity

    }
    else if (roleHash == FINANCE_CHANGE_PERIOD_ROLE_HASH_HASH) {
      roleName = "CHANGE_PERIOD_ROLE"
      appRole.CHANGE_PERIOD_ROLE = entity

    }
    else if (roleHash == FINANCE_CREATE_PAYMENTS_ROLE_HASH) {
      roleName = "CREATE_PAYMENTS_ROLE"
      appRole.CREATE_PAYMENTS_ROLE = entity

    }
    else if (roleHash == FINANCE_EXECUTE_PAYMENTS_ROLE_HASH) {
      roleName = "EXECUTE_PAYMENTS_ROLE"
      appRole.EXECUTE_PAYMENTS_ROLE = entity

    }
    else {
      roleName = "UNKNOWN_FINANCE_ROLE"
      appRole.manage_payments_role = entity

    }
  }

  // Token Manager roles
  else if (appID == APP_DEFAULT_TOKENMANGER_APP_ID) {
    if (roleHash == TOKEN_MANAGER_ASSIGN_ROLE_HASH) {
      roleName = "ASSIGN ROLE"
    }
    else if (roleHash == TOKEN_MANAGER_BURN_ROLE_HASH) {
      roleName = "BURN ROLE"
    }
    else if (roleHash == TOKEN_MANAGER_ISSUE_ROLE_HASH) {
      roleName = "ISSUE ROLE"
    }
    else if (roleHash == TOKEN_MANAGER_MINT_ROLE_HASH) {
      roleName = "MINT ROLE"
    }
    else if (roleHash == TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH) {
      roleName = "REVOKE VESTINGS ROLE"
    }
    else {
      roleName = "UNKNOWN TOKEN MANAGER ROLE"
    }
  }

  // Voting Roles
  else if (appID == APP_DEFAULT_VOTING_APP_ID) {
    if (roleHash == VOTING_CREATE_VOTES_ROLE_HASH) {
      roleName = "CREATE VOTES ROLE"
    }
    else if (roleHash == VOTING_MODIFY_QUORUM_ROLE_HASH) {
      roleName = "MODIFY QUORUM ROLE"
    }
    else if (roleHash == VOTING_MODIFY_SUPPORT_ROLE_HASH) {
      roleName = "MODIFY SUPPORT ROLE"
    }
    else {
      roleName = "UNKNOWN VOTING ROLE"
    }
  }

  // EVM Script Roles
  else if (appID == KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID) {
    if (roleHash == EVM_SCRIPT_REGISTY_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
      roleName = "CREATE VOTES ROLE"
    }
    else if (roleHash == EVM_SCRIPT_REGISTY_REGISTRY_MANAGER_ROLE_HASH) {
      roleName = "MODIFY QUORUM ROLE"
    }
    else {
      roleName = "UNKNOWN EVM SCRIPT ROLE"
    }
  }

  // Vault Role
  else if (appID == KERNEL_DEFAULT_VAULT_APP_ID) {
    if (roleHash == VAULT_TRANSFER_ROLE_HASH) {
      roleName = "TRANSFER ROLE"
    }
    else {
      roleName = "UNKNOWN VAULT ROLE"
    }
  }

  // ACL Role
  else if (appID == KERNEL_DEFAULT_ACL_APP_ID) {
    if (roleHash == ACL_CREATE_PERMISSIONS_ROLE_HASH) {
      roleName = "CREATE PERMISSIONS ROLE"
    }
    else {
      roleName = "UNKNOWN ACL ROLE"
    }
  }

  // Kernel Role
  else { // this assumes unknown is the kernel. this is not safe right now, as it isn't 100% true. this is because right now we don't have the kernel as an app, cuz its event is emitted by DAO Factory
    roleName = "APP MANAGER ROLE"
  }

  return appRole
}