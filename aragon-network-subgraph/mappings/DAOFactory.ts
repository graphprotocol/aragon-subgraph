// Import event types from the registrar contract ABI
import {DeployDAO, DeployEVMScriptRegistry} from '../types/DAOFactory/DAOFactory'

// Import entity types from the schema
import {DAO, EVMScriptRegistry} from '../types/schema'


export function handleDeployDAO(event: DeployDAO): void {
  let id = event.params.dao.toHex()
  let dao = new DAO(id)
  dao.save()
}

export function handleDeployScriptRegistry(event: DeployEVMScriptRegistry): void {
  let id = event.params.reg.toHex()
  let reg = new EVMScriptRegistry(id)
  reg.save()
}
