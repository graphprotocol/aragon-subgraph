import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {SetApp, NewAppProxy} from '../types/Kernel/Kernel'

// Import entity types from the schema
import {Kernel} from '../types/schema'


export function handleSetApp(event: SetApp): void {

}

export function handleNewProxyApp(event: NewAppProxy): void {

}
