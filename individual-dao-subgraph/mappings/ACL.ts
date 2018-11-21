import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store, Bytes, Value, BigInt} from '@graphprotocol/graph-ts'

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
  EVM_SCRIPT_REGISTY_REGISTRY_MANAGER_ROLE_HASH, // alias for enable and disable executors

  // might not need, since they are the only roles, and did not have to distingush
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

export function handleSetPermission(event: SetPermission): void {
  let id = event.params.app.toHex()
  let role = event.params.role.toHex()
  let entity = event.params.entity.toHex()

// VAULT //////////////////////
  if (store.get("Vault", id) != null) {
    let vp = store.get("VaultPermission", id) as VaultPermission | null
    if (vp == null) {
      vp = new VaultPermission()
      vp.canTransfer = new Array<string>()
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
      tmp.canIssue = new Array<string>()
      tmp.canRevokeVestings = new Array<string>()
      tmp.canMint = new Array<string>()
      tmp.canBurn = new Array<string>()
      tmp.canAssign = new Array<string>()
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
        if (minters.indexOf(entity) == -1) {
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

        // NOTE - getting some weird results with splice here.  it seems to me like there is an error with how it is written.
        // Because i use it the same way 5 times, and in this instance it deletes the wrong element, and then replaces it with a duplicate of a different element.
        // I saw this while testing on rinkeby. Must keep an eye on it ( i can't reproduce it at the moment
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
  } else if (store.get("Finance", id) != null) {
    let fp = store.get("FinancePermission", id) as FinancePermission | null
    if (fp == null) {
      fp = new FinancePermission()
      fp.canChangeBudget = new Array<string>()
      fp.canChangePeriod = new Array<string>()
      fp.canCreatePayments = new Array<string>()
      fp.canExecutePayments = new Array<string>()
      fp.canManagePayments = new Array<string>()
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

        //Seem to be getting an error here too... usually with 0xffffffff
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
        // missing 0xfffff here too
      } else if (role == FINANCE_CHANGE_PERIOD_ROLE_HASH) {
        let changesPeriod = fp.canChangePeriod
        let i = changesPeriod.indexOf(entity)
        changesPeriod.splice(i, 1)
        fp.canChangePeriod = changesPeriod
        store.set("FinancePermission", id, fp as FinancePermission)
      }

    }

    // VOTING
  } else if (store.get("Voting", id) != null) {
    let vp = store.get("VotingPermission", id) as VotingPermission | null
    if (vp == null) {
      vp = new VotingPermission()
      vp.canCreateVotes = new Array<string>()
      vp.canModifyQuorum = new Array<string>()
      vp.canModifySupport = new Array<string>()
    }
    if (event.params.allowed == true) {
      if (role == VOTING_MODIFY_SUPPORT_ROLE_HASH) {
        let modifyingSupport = vp.canModifySupport
        if (modifyingSupport.indexOf(entity) == -1) {
          modifyingSupport.push(entity)
          vp.canModifySupport = modifyingSupport
          store.set("VotingPermission", id, vp as VotingPermission)
        }
      } else if (role == VOTING_MODIFY_QUORUM_ROLE_HASH) {
        let modifyingQuorum = vp.canModifyQuorum
        if (modifyingQuorum.indexOf(entity) == -1) {
          modifyingQuorum.push(entity)
          vp.canModifyQuorum = modifyingQuorum
          store.set("VotingPermission", id, vp as VotingPermission)
        }
      } else if (role == VOTING_CREATE_VOTES_ROLE_HASH) {
        let creatingVotes = vp.canCreateVotes
        if (creatingVotes.indexOf(entity) == -1) {
          creatingVotes.push(entity)
          vp.canCreateVotes = creatingVotes
          store.set("VotingPermission", id, vp as VotingPermission)
        }
      }
    } else if (event.params.allowed == false) {
      if (role == VOTING_MODIFY_SUPPORT_ROLE_HASH) {
        let modifyingSupport = vp.canModifySupport
        let i = modifyingSupport.indexOf(entity)
        modifyingSupport.splice(i, 1)
        vp.canModifySupport = modifyingSupport
        store.set("VotingPermission", id, vp as VotingPermission)
      } else if (role == VOTING_MODIFY_QUORUM_ROLE_HASH) {
        let modifyingQuorum = vp.canModifyQuorum
        let i = modifyingQuorum.indexOf(entity)
        modifyingQuorum.splice(i, 1)
        vp.canModifyQuorum = modifyingQuorum
        store.set("VotingPermission", id, vp as VotingPermission)
      } else if (role == VOTING_CREATE_VOTES_ROLE_HASH) {
        let creatingVotes = vp.canCreateVotes
        let i = creatingVotes.indexOf(entity)
        creatingVotes.splice(i, 1)
        vp.canCreateVotes = creatingVotes
        store.set("VotingPermission", id, vp as VotingPermission)
      }
    }
    //EVMScriptRegistry
  } else if (store.get("EVMScriptRegistry", id) != null) {
    let evmsr = store.get("EVMScriptRegistryPermission", id) as EVMScriptRegistryPermission | null
    if (evmsr == null) {
      evmsr = new EVMScriptRegistryPermission()
      evmsr.canAddExecutor = new Array<string>()
      evmsr.canEnableAndDisableExecutors = new Array<string>()
    }
    if (event.params.allowed == true) {
      if (role == EVM_SCRIPT_REGISTY_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
        let addingExecutor = evmsr.canAddExecutor
        if (addingExecutor.indexOf(entity) == -1) {
          addingExecutor.push(entity)
          evmsr.canAddExecutor = addingExecutor
          store.set("EVMScriptRegistryPermission", id, evmsr as EVMScriptRegistryPermission)
        }
      } else if (role == EVM_SCRIPT_REGISTY_REGISTRY_MANAGER_ROLE_HASH) {
        let enableDisable = evmsr.canEnableAndDisableExecutors
        if (enableDisable.indexOf(entity) == -1) {
          enableDisable.push(entity)
          evmsr.canEnableAndDisableExecutors = enableDisable
          store.set("EVMScriptRegistryPermission", id, evmsr as EVMScriptRegistryPermission)
        }
      }
    } else if (event.params.allowed == false) {
      if (role == EVM_SCRIPT_REGISTY_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
        let addingExecutor = evmsr.canAddExecutor
        let i = addingExecutor.indexOf(entity)
        addingExecutor.splice(i, 1)
        evmsr.canAddExecutor = addingExecutor
        store.set("EVMScriptRegistryPermission", id, evmsr as EVMScriptRegistryPermission)
      } else if (role == EVM_SCRIPT_REGISTY_REGISTRY_MANAGER_ROLE_HASH) {
        let enableDisable = evmsr.canEnableAndDisableExecutors
        let i = enableDisable.indexOf(entity)
        enableDisable.splice(i, 1)
        evmsr.canEnableAndDisableExecutors = enableDisable
        store.set("EVMScriptRegistryPermission", id, evmsr as EVMScriptRegistryPermission)
      }
    }
  } else if (store.get("ACL", id) != null) {
    let aclp = store.get("ACLPermission", id) as ACLPermission | null
    if (aclp == null) {
      aclp = new ACLPermission()
      aclp.canCreatePermissions = new Array<string>()
    }
    if (event.params.allowed == true) {
      let createPermissions = aclp.canCreatePermissions
      createPermissions.push(entity)
      aclp.canCreatePermissions = createPermissions
      store.set("ACLPermission", id, aclp as ACLPermission)
    } else {
      let createPermissions = aclp.canCreatePermissions
      let i = createPermissions.indexOf(entity)
      createPermissions.splice(i, 1)
      aclp.canCreatePermissions = createPermissions
      store.set("ACLPermission", id, aclp as ACLPermission)
    }
    //TODO: this currently doesnt work, because the kernel app has't been registered, so it does == null
  } else if (store.get("Kernel", id) != null) {
    let kp = store.get("KernelPermission", id) as KernelPermission | null
    if (kp == null) {
      kp = new KernelPermission()
      kp.canManageApps = new Array<string>()
    }
    if (event.params.allowed == true) {
      let managingApps = kp.canManageApps
      managingApps.push(entity)
      kp.canManageApps = managingApps
      store.set("KernelPermission", id, kp as KernelPermission)
    } else {
      let managingApps = kp.canManageApps
      let i = managingApps.indexOf(entity)
      managingApps.splice(i, 1)
      kp.canManageApps = managingApps
      store.set("KernelPermission", id, kp as KernelPermission)
    }

  }
}


// -     event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager); f3addc8b8


export function handleChangePermissionManager(event: ChangePermissionManager): void {
  let id = event.params.app.toHex()
  let role = event.params.role.toHex()
  let manager = event.params.manager

  // VAULT //////////////////////
  if (store.get("Vault", id) != null) {
    let vp = store.get("VaultPermission", id) as VaultPermission | null
    if (vp == null) {
      vp = new VaultPermission()
      vp.canTransfer = new Array<string>()
    }
    vp.managesTransfers = manager
    store.set("VaultPermission", id, vp as VaultPermission)

  }

  // TOKEN MANAGER //////////////////////
  else if (store.get("TokenManager", id) != null) {
    let tmp = store.get("TokenManagerPermission", id) as TokenManagerPermission | null
    if (tmp == null) {
      tmp = new TokenManagerPermission()
      tmp.canIssue = new Array<string>()
      tmp.canRevokeVestings = new Array<string>()
      tmp.canMint = new Array<string>()
      tmp.canBurn = new Array<string>()
      tmp.canAssign = new Array<string>()
    }
    if (role == TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH) {
      tmp.managesRevokeVestings = manager
      store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)

    } else if (role == TOKEN_MANAGER_MINT_ROLE_HASH) {
      tmp.managesMint = manager
      store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)

    } else if (role == TOKEN_MANAGER_ISSUE_ROLE_HASH) {
      tmp.managesIssue = manager
      store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)

    } else if (role == TOKEN_MANAGER_BURN_ROLE_HASH) {
      tmp.managesBurn = manager
      store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)

    } else if (role == TOKEN_MANAGER_ASSIGN_ROLE_HASH) {
      tmp.managesAssign = manager
      store.set("TokenManagerPermission", id, tmp as TokenManagerPermission)
    }

    // FINANCE //////////////////////
  } else if (store.get("Finance", id) != null) {
    let fp = store.get("FinancePermission", id) as FinancePermission | null
    if (fp == null) {
      fp = new FinancePermission()
      fp.canChangeBudget = new Array<string>()
      fp.canChangePeriod = new Array<string>()
      fp.canCreatePayments = new Array<string>()
      fp.canExecutePayments = new Array<string>()
      fp.canManagePayments = new Array<string>()
    }
    if (role == FINANCE_EXECUTE_PAYMENTS_ROLE_HASH) {

      fp.managesExecutePayments = manager
      store.set("FinancePermission", id, fp as FinancePermission)

    } else if (role == FINANCE_MANAGE_PAYMENTS_ROLE_HASH) {

      fp.managesManagePayments = manager
      store.set("FinancePermission", id, fp as FinancePermission)

    } else if (role == FINANCE_CREATE_PAYMENTS_ROLE_HASH) {

      fp.managesCreatePayments = manager
      store.set("FinancePermission", id, fp as FinancePermission)

    } else if (role == FINANCE_CHANGE_BUDGETS_ROLE_HASH) {

      fp.managesChangeBudget = manager
      store.set("FinancePermission", id, fp as FinancePermission)

    } else if (role == FINANCE_CHANGE_PERIOD_ROLE_HASH) {
      fp.managesChangePeriod = manager
      store.set("FinancePermission", id, fp as FinancePermission)

    }


    // VOTING
  } else if (store.get("Voting", id) != null) {
    let vp = store.get("VotingPermission", id) as VotingPermission | null
    if (vp == null) {
      vp = new VotingPermission()
      vp.canCreateVotes = new Array<string>()
      vp.canModifyQuorum = new Array<string>()
      vp.canModifySupport = new Array<string>()
    }
    if (role == VOTING_MODIFY_SUPPORT_ROLE_HASH) {
      vp.managesModifySupport = manager
      store.set("VotingPermission", id, vp as VotingPermission)

    } else if (role == VOTING_MODIFY_QUORUM_ROLE_HASH) {
      vp.managesModifyQuorum = manager
      store.set("VotingPermission", id, vp as VotingPermission)

    } else if (role == VOTING_CREATE_VOTES_ROLE_HASH) {
      vp.managesCreateVotes = manager
      store.set("VotingPermission", id, vp as VotingPermission)
    }

    //EVMScriptRegistry
  } else if (store.get("EVMScriptRegistry", id) != null) {
    let evmsr = store.get("EVMScriptRegistryPermission", id) as EVMScriptRegistryPermission | null
    if (evmsr == null) {
      evmsr = new EVMScriptRegistryPermission()
      evmsr.canAddExecutor = new Array<string>()
      evmsr.canEnableAndDisableExecutors = new Array<string>()
    }
    if (role == EVM_SCRIPT_REGISTY_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
      evmsr.managesAddExecutor = manager
      store.set("EVMScriptRegistryPermission", id, evmsr as EVMScriptRegistryPermission)
    } else if (role == EVM_SCRIPT_REGISTY_REGISTRY_MANAGER_ROLE_HASH) {
      evmsr.managesEnableAndDisableExecutors = manager
      store.set("EVMScriptRegistryPermission", id, evmsr as EVMScriptRegistryPermission)
    }

    //ACL ////////////////////
  } else if (store.get("ACL", id) != null) {
    let aclp = store.get("ACLPermission", id) as ACLPermission | null
    if (aclp == null) {
      aclp = new ACLPermission()
      aclp.canCreatePermissions = new Array<string>()
    }
    aclp.managesCreatePermissions = manager
    store.set("ACLPermission", id, aclp as ACLPermission)
  }

  //Kernel ////////////////////////
  //TODO: this currently doesnt work, because the kernel app has't been registered, so it does == null
  else if (store.get("Kernel", id) != null) {
    let kp = store.get("KernelPermission", id) as KernelPermission | null
    if (kp == null) {
      kp = new KernelPermission()
      kp.canManageApps = new Array<string>()
    }
    kp.managesManageApps = manager
    store.set("KernelPermission", id, kp as KernelPermission)
  }
}


// hasnt been called on my app, but it will be
export function handleSetPermissionParams(event: SetPermissionParams): void {

}

// 99% sure we dont need
export function handleScriptResult(event: ScriptResult): void {

}
