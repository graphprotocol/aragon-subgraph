import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetPermission, SetPermissionParams, ChangePermissionManager, ScriptResult} from '../types/ACL/ACL'

// Import entity types from the schema
import {ACL} from '../types/schema'


export function handleSetPermission(event: SetPermission): void {
  // let id = event.params.dao.toHex()
  // let dao = new DAO()
  // store.set("DAO", id, dao)
}

export function handleSetPermissionParams(event: SetPermissionParams): void {
  // let id = event.params.reg.toHex()
  // let reg = new EVMScriptRegistry()
  // store.set("EVMScriptRegistry", id, reg)
}

export function handleChangePermissionParams(event: ChangePermissionManager): void {
  // let id = event.params.reg.toHex()
  // let reg = new EVMScriptRegistry()
  // store.set("EVMScriptRegistry", id, reg)
}

export function handleScriptResult (event: ScriptResult): void {

}