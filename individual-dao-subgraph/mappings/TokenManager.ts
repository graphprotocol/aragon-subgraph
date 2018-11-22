import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {NewVesting, RevokeVesting} from '../types/TokenManager/TokenManager'

// Import entity types from the schema
import {} from '../types/schema'


//TODO: Not implementing right now, because there doesn't appear to be any functionality in the aragon dapp that allows for vesting. Focusing on just the dapp for V1

export function handleNewVesting(event: NewVesting): void {

}

export function handleRevokeVesting(event: RevokeVesting): void {

}
