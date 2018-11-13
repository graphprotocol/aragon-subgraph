import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {EnableExecutor, DisableExecutor} from '../types/EVMScriptRegistry/EVMScriptRegistry'

// Import entity types from the schema
 import {} from '../types/schema'


export function handleEnable(event: EnableExecutor): void {

}

export function handleDisable(event: DisableExecutor): void {

}
