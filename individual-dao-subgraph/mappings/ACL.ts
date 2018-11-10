import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// // Import event types from the registrar contract ABI
// import {DeployDAO, DeployEVMScriptRegistry} from '../types/DAOFactory/DAOFactory'
//
// // Import entity types from the schema
// import {DAO, EVMScriptRegistry} from '../types/schema'
//
//
// export function handleDeployDAO(event: DeployDAO): void {
//   let id = event.params.dao.toHex()
//   let dao = new DAO()
//   store.set("DAO", id, dao)
// }
//
// export function handleDeployScriptRegistry(event: DeployEVMScriptRegistry): void {
//   let id = event.params.reg.toHex()
//   let reg = new EVMScriptRegistry()
//   store.set("EVMScriptRegistry", id, reg)
// }
