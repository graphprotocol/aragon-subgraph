// Import APIs from graph-ts
import {Bytes} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {EnableExecutor, DisableExecutor} from '../types/EVMScriptRegistry/EVMScriptRegistry'

// Import entity types from the schema
import {EVMScriptRegistry, EVMScriptRegistryPermission} from '../types/schema'


// In order to get the ids of the executor, and make them each into their own entity, we would need to grab the
// address of EVMSCR too. Not really necessary, we can just make executors an array

export function handleEnable(event: EnableExecutor): void {
  let id = event.address.toHex()
  let executor = event.params.executorAddress

  let evmsr = EVMScriptRegistry.load(id)

  if (evmsr == null) {
    evmsr = new EVMScriptRegistry(id)
    evmsr.executors = new Array<Bytes>()
  }

  let executors = evmsr.executors
  executors.push(executor)
  evmsr.executors = executors
  evmsr.save()
}

// NOTE - untested, because I can't use it in the dapp
export function handleDisable(event: DisableExecutor): void {
  let id = event.address.toHex()
  let executor = event.params.executorAddress
  let evmsr = EVMScriptRegistry.load(id)

  let executors = evmsr.executors
  let i = executors.indexOf(executor)
  executors.splice(i, 1)
  evmsr.executors = executors
  evmsr.save()
}
