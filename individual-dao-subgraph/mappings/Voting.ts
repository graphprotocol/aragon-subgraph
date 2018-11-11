import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {StartVote, CastVote, ExecuteVote, ChangeSupportRequired, ChangeMinQuorum} from '../types/Voting/Voting'

// Import entity types from the schema
import {Voting} from '../types/schema'


export function handleStartVote(event: StartVote): void {

}

export function handleCastVote(event: CastVote): void {

}

export function handleExecuteVote(event: ExecuteVote): void {

}

export function handleChangeSupportRequired(event: ChangeSupportRequired): void {

}

export function handleChangeMinQuorum(event: ChangeMinQuorum): void {

}

