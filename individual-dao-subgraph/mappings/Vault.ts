import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {VaultTransfer, VaultDeposit} from '../types/Vault/Vault'

// Import entity types from the schema
import {EVMScriptRegistry} from '../types/schema'


export function handleVaultTransfer(event: VaultTransfer): void {

}

export function handleVaultDeposit(event: VaultDeposit): void {

}
