// Import event types from the registrar contract ABI
import {SetPermission, SetPermissionParams, ChangePermissionManager} from '../types/ACL/ACL'

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
  ACLManagers,
  KernelManagers,
  Vault,
  TokenManager,
  Finance,
  Voting,
  EVMScriptRegistry,
  ACL,
  Kernel
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
  roleLookupTable
} from './constants'

// TODO: - getting some weird results with splice here, on random instance (see the queries.  it seems to me like there is an error with how it is written. Because i use it the same way 5 times, and in this instance it deletes the wrong element, and then replaces it with a duplicate of a different element.
export function handleSetPermission(event: SetPermission): void {
  let id = event.params.app.toHex()
  let role = event.params.role.toHex()
  let entity = event.params.entity.toHex()

  // Vault
  if (Vault.load(id) != null) {
    let vp = VaultPermission.load(role)
    if (vp == null) {
      vp = new VaultPermission(role)
      vp.entities = new Array<string>()
      vp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      vp.role = roleName
      let entities = vp.entities
      let i = entities.indexOf(entity)
      if (i == -1) {
        entities.push(entity)
        vp.entities = entities
        vp.save()
      }
    } else if (event.params.allowed == false) {
      let entities = vp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      vp.entities = entities
      vp.save()
    }
  }

  // Token Manager
  else if (TokenManager.load(id) != null) {
    let tmp = TokenManagerPermission.load(role)
    if (tmp == null) {
      tmp = new TokenManagerPermission(role)
      tmp.entities = new Array<string>()
      tmp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      tmp.role = roleName
      let entities = tmp.entities
      let i = entities.indexOf(entity)
      if (i == -1) {
        entities.push(entity)
        tmp.entities = entities
        tmp.save()
      }
    } else if (event.params.allowed == false) {
      let entities = tmp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      tmp.entities = entities
      tmp.save()
    }
  }

  // Finance
  else if (Finance.load(id) != null) {
    let fp = FinancePermission.load(role)
    if (fp == null) {
      fp = new FinancePermission(role)
      fp.entities = new Array<string>()
      fp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      fp.role = roleName
      let entities = fp.entities
      let i = entities.indexOf(entity)
      if (i == -1) {
        entities.push(entity)
        fp.entities = entities
        fp.save()
      }
    } else if (event.params.allowed == false) {
      let entities = fp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      fp.entities = entities
      fp.save()
    }
  }


  // Voting
  else if (Voting.load(id) != null) {
    let vp = VotingPermission.load(role)
    if (vp == null) {
      vp = new VotingPermission(role)
      vp.entities = new Array<string>()
      vp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      vp.role = roleName
      let entities = vp.entities
      let i = entities.indexOf(entity)
      if (i == -1) {
        entities.push(entity)
        vp.entities = entities
        vp.save()
      }
    } else if (event.params.allowed == false) {
      let entities = vp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      vp.entities = entities
      vp.save()
    }
  }

  // EVMScriptRegistry
  else if (EVMScriptRegistry.load(id) != null) {
    let evmsr = EVMScriptRegistryPermission.load(role)
    if (evmsr == null) {
      evmsr = new EVMScriptRegistryPermission(role)
      evmsr.entities = new Array<string>()
      evmsr.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      evmsr.role = roleName
      let entities = evmsr.entities
      let i = entities.indexOf(entity)
      if (i == -1) {
        entities.push(entity)
        evmsr.entities = entities
        evmsr.save()
      }
    } else if (event.params.allowed == false) {
      let entities = evmsr.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      evmsr.entities = entities
      evmsr.save()
    }
  }

  // ACL
  else if (ACL.load(id) != null) {
    let aclp = ACLPermission.load(role)
    if (aclp == null) {
      aclp = new ACLPermission(role)
      aclp.entities = new Array<string>()
      aclp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      aclp.role = roleName
      let entities = aclp.entities
      let i = entities.indexOf(entity)
      if (i == -1) {
        entities.push(entity)
        aclp.entities = entities
        aclp.save()
      }
    } else if (event.params.allowed == false) {
      let entities = aclp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      aclp.entities = entities
      aclp.save()
    }
  }

  // Kernel
  else if (Kernel.load(id) != null) {
    let kp = KernelPermission.load(role)
    if (kp == null) {
      kp = new KernelPermission(role)
      kp.entities = new Array<string>()
      kp.appAddress = id
    }
    if (event.params.allowed == true) {
      let roleName = roleLookupTable.get(role) as string
      kp.role = roleName
      let entities = kp.entities
      let i = entities.indexOf(entity)
      if (i == -1) {
        entities.push(entity)
        kp.entities = entities
        kp.save()
      }
    } else if (event.params.allowed == false) {
      let entities = kp.entities
      let i = entities.indexOf(entity)
      entities.splice(i, 1)
      kp.entities = entities
      kp.save()
    }
  }
}

export function handleChangePermissionManager(event: ChangePermissionManager): void {
  let id = event.params.app.toHex()
  let role = event.params.role.toHex()
  let manager = event.params.manager

  // VAULT
  if (Vault.load(id) != null) {
    let vm = VaultManagers.load(id)
    if (vm == null) {
      vm = new VaultManagers(id)
    }
    vm.managesTransfers = manager
    vm.save()
  }

  // TOKEN MANAGER
  else if (TokenManager.load(id) != null) {
    let tmm = TokenManagerManagers.load(id)
    if (tmm == null) {
      tmm = new TokenManagerManagers(id)
    }
    if (role == TOKEN_MANAGER_REVOKE_VESTINGS_ROLE_HASH) {
      tmm.managesRevokeVestings = manager
      tmm.save()

    } else if (role == TOKEN_MANAGER_MINT_ROLE_HASH) {
      tmm.managesMint = manager
      tmm.save()
    } else if (role == TOKEN_MANAGER_ISSUE_ROLE_HASH) {
      tmm.managesIssue = manager
      tmm.save()
    } else if (role == TOKEN_MANAGER_BURN_ROLE_HASH) {
      tmm.managesBurn = manager
      tmm.save()
    } else if (role == TOKEN_MANAGER_ASSIGN_ROLE_HASH) {
      tmm.managesAssign = manager
      tmm.save()
    }

  }

  // FINANCE
  else if (Finance.load(id) != null) {
    let fm = FinanceManagers.load(id)
    if (fm == null) {
      fm = new FinanceManagers(id)
    }
    if (role == FINANCE_EXECUTE_PAYMENTS_ROLE_HASH) {

      fm.managesExecutePayments = manager
      fm.save()

    } else if (role == FINANCE_MANAGE_PAYMENTS_ROLE_HASH) {

      fm.managesManagePayments = manager
      fm.save()

    } else if (role == FINANCE_CREATE_PAYMENTS_ROLE_HASH) {

      fm.managesCreatePayments = manager
      fm.save()

    } else if (role == FINANCE_CHANGE_BUDGETS_ROLE_HASH) {

      fm.managesChangeBudget = manager
      fm.save()

    } else if (role == FINANCE_CHANGE_PERIOD_ROLE_HASH) {
      fm.managesChangePeriod = manager
      fm.save()

    }
  }

  // VOTING
  else if (Voting.load(id) != null) {
    let vm = VotingManagers.load(id)
    if (vm == null) {
      vm = new VotingManagers(id)
    }
    if (role == VOTING_MODIFY_SUPPORT_ROLE_HASH) {
      vm.managesModifySupport = manager
      vm.save()

    } else if (role == VOTING_MODIFY_QUORUM_ROLE_HASH) {
      vm.managesModifyQuorum = manager
      vm.save()

    } else if (role == VOTING_CREATE_VOTES_ROLE_HASH) {
      vm.managesCreateVotes = manager
      vm.save()
    }
  }

  // EVMScriptRegistry
  else if (EVMScriptRegistry.load(id) != null) {
    let evmsr = EVMScriptRegistryManagers.load(id)
    if (evmsr == null) {
      evmsr = new EVMScriptRegistryManagers(id)
    }
    if (role == EVM_SCRIPT_REGISTRY_ADD_EXECUTOR_ROLE_HASH) {
      evmsr.managesAddExecutor = manager
      evmsr.save()
    } else if (role == EVM_SCRIPT_REGISTRY_MANAGER_ROLE_HASH) {
      evmsr.managesEnableAndDisableExecutors = manager
      evmsr.save()
    }
  }

  // ACL
  else if (ACL.load(id) != null) {
    let am = ACLManagers.load(id)
    if (am == null) {
      am = new ACLManagers(id)
    }
    am.managesCreatePermissions = manager
    am.save()
  }

  //Kernel
  else if (Kernel.load(id) != null) {
    let km = KernelManagers.load(id)
    if (km == null) {
      km = new KernelManagers(id)
    }
    km.managesManageApps = manager
    km.save()
  }
}


// hasnt been called on my app, doesnt appear to be used anywhere in the DApp, leaving out
export function handleSetPermissionParams(event: SetPermissionParams): void {

}