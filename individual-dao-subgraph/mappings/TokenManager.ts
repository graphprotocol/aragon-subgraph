import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {NewVesting, RevokeVesting} from '../types/TokenManager/TokenManager'

// Import entity types from the schema
import {} from '../types/schema'


export function handleNewVesting(event: NewVesting): void {

}

export function handleRevokeVesting(event: RevokeVesting): void {

}
