import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store, Bytes} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {EnableExecutor, DisableExecutor} from '../types/EVMScriptRegistry/EVMScriptRegistry'

// Import entity types from the schema
import {EVMScriptRegistry, EVMScriptRegistryPermission} from '../types/schema'


// In order to get the ids of the executor, and make them each into their own entity, we would need to grab the
// address of EVMSCR too. Not really necessary, we can just make executors an array

export function handleEnable(event: EnableExecutor): void {
  let id = event.address.toHex()
  let executor = event.params.executorAddress

  let evmsr = store.get("EVMScriptRegistry", id) as EVMScriptRegistry | null

  if (evmsr == null) {
    evmsr = new EVMScriptRegistry()
    evmsr.executors = new Array<Bytes>()
  }

  let executors = evmsr.executors
  executors.push(executor)
  evmsr.executors = executors
  store.set("EVMScriptRegistry", id, evmsr as EVMScriptRegistry)

}

// NOTE - untested, because I can't use it in the dapp
export function handleDisable(event: DisableExecutor): void {
  let id = event.address.toHex()
  let executor = event.params.executorAddress
  let evmsr = store.get("EVMScriptRegistry", id) as EVMScriptRegistry

  let executors = evmsr.executors
  let i = executors.indexOf(executor)
  executors.splice(i, 1)
  evmsr.executors = executors
  store.set("EVMScriptRegistry", id, evmsr as EVMScriptRegistry)



}
