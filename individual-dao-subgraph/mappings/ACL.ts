import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetPermission, SetPermissionParams, ChangePermissionManager, ScriptResult} from '../types/ACL/ACL'

// Import entity types from the schema
import {AppPermissions, ProxyApp} from '../types/schema'

import {kernalConstants, aclConstants} from './constants'

// -     event SetPermission(address indexed entity, address indexed app, bytes32 indexed role, bool allowed); 759b9a74d
// -     event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash);
// -     event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager); f3addc8b8
// -     event ScriptResult(address indexed executor, bytes script, bytes input, bytes returnData);

//so i need to take into account that bool allowed means we have added a guy, and that bool remove will remove a guy
// okay, ultimately I gotta figure out how to pop out stuff from arrays, so i should learn now
export function handleSetPermission(event: SetPermission): void {
  let id = event.params.app.toHex()
  let ap = store.get("AppPermissions", id) as AppPermissions | null

  if (ap == null) {
    ap = new AppPermissions()

    let app = store.get("ProxyApp", id) as ProxyApp
    ap.appName = app.appName

    let roleName = roleResolver(event.params.role.toHex(), id)
    let roles = new Array()
    let roleString = `Entity: ${event.params.entity}  Role: ${roleName}  Allowed: ${event.params.allowed}`
    roles.push(roleString)
    ap.roles = roles

    store.set("AppPermissions", id, ap as AppPermissions)

  } else {
    let roleName = roleResolver(event.params.role.toHex(), id)
    let roles = ap.roles
    let roleString = `Entity: ${event.params.entity}  Role: ${roleName}  Allowed: ${event.params.allowed}`
    roles.push(roleString)
    ap.roles = roles

    store.set("AppPermissions", id, ap as AppPermissions)
  }
}

// hasnt been called on my app, but it will be
export function handleSetPermissionParams(event: SetPermissionParams): void {
  // let id = event.params.reg.toHex()
  // let reg = new EVMScriptRegistry()
  // store.set("EVMScriptRegistry", id, reg)
}

//f3addc8b8
export function handleChangePermissionManager(event: ChangePermissionManager): void {
  // let id = event.params.reg.toHex()
  // let reg = new EVMScriptRegistry()
  // store.set("EVMScriptRegistry", id, reg)
}

// 99% sure we dont need
export function handleScriptResult(event: ScriptResult): void {

}

function roleResolver(roleHash: string, appAddress: string): string {

  let app = store.get("ProxyApp", appAddress) as ProxyApp
  let appID = app.appID.toHex()

  let roleName: string

  // Finance roles
  if (appID == kernalConstants.APP_DEFAULT_FINANCE_APP_ID) {
    if (roleHash == aclConstants.FINANCE_MANAGE_PAYMENTS_ROLE_HASH) {
      roleName = "MANAGE PAYMENTS ROLE"
    }
    else if (roleHash == aclConstants.FINANCE_CHANGE_BUDGETS_ROLE_HASH) {
      roleName = "CHANGE BUDGET ROLE"
    }
    else if (roleHash == aclConstants.FINANCE_CHANGE_PERIOD_ROLE_HASH_HASH) {
      roleName = "CHANGE PERIOD ROLE"
    }
    else if (roleHash == aclConstants.FINANCE_CREATE_PAYMENTS_ROLE_HASH) {
      roleName = "CREATE PAYMENTS ROLE"
    }
    else if (roleHash == aclConstants.FINANCE_EXECUTE_PAYMENTS_ROLE_HASH) {
      roleName = "EXECUTE PAYMENTS ROLE"
    }
    else {
      roleName = "UNKNOWN FINANCE ROLE"
    }
  }

  // Token Manager roles
  else if (appID == kernalConstants.APP_DEFAULT_TOKENMANGER_APP_ID) {
    if (roleHash == aclConstants.TOKEN_MANAGER_ASSIGN_ROLE_HASH) {
      roleName = "ASSIGN ROLE"
    }
    else if (roleHash == aclConstants.TOKEN_MANAGER_BURN_ROLE_HASH) {
      roleName = "BURN ROLE"
    }
    else if (roleHash == aclConstants.TOKEN_MANAGER_ISSUE_ROLE_HASH) {
      roleName = "ISSUE ROLE"
    }
    else if (roleHash == aclConstants.TOKEN_MANAGER_MINT_ROLE_HASH) {
      roleName = "MINT ROLE"
    }
    else if (roleHash == aclConstants.TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH) {
      roleName = "REVOKE VESTINGS ROLE"
    }
    else {
      roleName = "UNKNOWN TOKEN MANAGER ROLE"
    }
  }

  // Voting Roles
  else if (appID == kernalConstants.APP_DEFAULT_VOTING_APP_ID) {
    if (roleHash == aclConstants.VOTING_CREATE_VOTES_ROLE_HASH) {
      roleName = "CREATE VOTES ROLE"
    }
    else if (roleHash == aclConstants.VOTING_MODIFY_QUORUM_ROLE_HASH) {
      roleName = "MODIFY QUORUM ROLE"
    }
    else if (roleHash == aclConstants.VOTING_MODIFY_SUPPORT_ROLE_HASH) {
      roleName = "MODIFY SUPPORT ROLE"
    }
    else {
      roleName = "UNKNOWN VOTING ROLE"
    }
  }

  // EVM Script Roles
  else if (appID == kernalConstants.KERNEL_DEFAULT_EVM_SCRIPT_REGISTRY_ID) {
    if (roleHash == aclConstants.EVM_SCRIPT_REGISTY_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
      roleName = "CREATE VOTES ROLE"
    }
    else if (roleHash == aclConstants.EVM_SCRIPT_REGISTY_REGISTRY_MANAGER_ROLE_HASH) {
      roleName = "MODIFY QUORUM ROLE"
    }
    else {
      roleName = "UNKNOWN EVM SCRIPT ROLE"
    }
  }

  // Vault Role
  else if (appID == kernalConstants.KERNEL_DEFAULT_VAULT_APP_ID) {
    if (roleHash == aclConstants.VAULT_TRANSFER_ROLE_HASH) {
      roleName = "TRANSFER ROLE"
    }
    else {
      roleName = "UNKNOWN VAULT ROLE"
    }
  }

  // ACL Role
  else if (appID == kernalConstants.KERNEL_DEFAULT_ACL_APP_ID) {
    if (roleHash == aclConstants.ACL_CREATE_PERMISSIONS_ROLE_HASH) {
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

  return roleName
}