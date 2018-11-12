import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetPermission, SetPermissionParams, ChangePermissionManager, ScriptResult} from '../types/ACL/ACL'

// Import entity types from the schema
import {ACL, App} from '../types/schema'

// event SetPermission(address indexed entity, address indexed app, bytes32 indexed role, bool allowed);
// event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash);
// event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager);


export function handleSetPermission(event: SetPermission): void {
  // let id = event.params.app.toHex()
  // let app = new ACLApp()
  // store.set("ACLApp", id, app)



}

export function handleSetPermissionParams(event: SetPermissionParams): void {
  // let id = event.params.reg.toHex()
  // let reg = new EVMScriptRegistry()
  // store.set("EVMScriptRegistry", id, reg)
}

export function handleChangePermissionManager(event: ChangePermissionManager): void {
  // let id = event.params.reg.toHex()
  // let reg = new EVMScriptRegistry()
  // store.set("EVMScriptRegistry", id, reg)
}

export function handleScriptResult(event: ScriptResult): void {

}