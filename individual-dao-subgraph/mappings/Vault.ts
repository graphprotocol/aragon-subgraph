import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store, BigInt, Bytes } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {VaultTransfer, VaultDeposit} from '../types/Vault/Vault'

// Import entity types from the schema
import {VaultTransferList, VaultDepositList} from '../types/schema'


export function handleVaultTransfer(event: VaultTransfer): void {
  let amount = event.params.amount
  let tokenAddress = event.params.token
  let to = event.params.to

  let id = event.address.toHex()

  let vt = store.get("VaultTransferList", id) as VaultTransferList | null
  if (vt == null) {
    vt = new VaultTransferList()
    vt.amount = new Array<BigInt>()
    vt.tokenAddress = new Array<Bytes>()
    vt.to = new Array<Bytes>()
  }

  let amounts = vt.amount
  let tokens = vt.tokenAddress
  let receivers = vt.to

  amounts.push(amount)
  tokens.push(tokenAddress)
  receivers.push(to)

  vt.amount = amounts
  vt.tokenAddress = tokens
  vt.to = receivers

  store.set("VaultTransferList", id, vt as VaultTransferList)


}

export function handleVaultDeposit(event: VaultDeposit): void {
  let amount = event.params.amount
  let tokenAddress = event.params.token
  let sender = event.params.sender

  let id = event.address.toHex()

  let vd = store.get("VaultDepositList", id) as VaultDepositList | null
  if (vd == null) {
    vd = new VaultDepositList()
    vd.amount = new Array<BigInt>()
    vd.tokenAddress = new Array<Bytes>()
    vd.sender = new Array<Bytes>()
  }

  let amounts = vd.amount
  let tokens = vd.tokenAddress
  let senders = vd.sender

  amounts.push(amount)
  tokens.push(tokenAddress)
  senders.push(sender)

  vd.amount = amounts
  vd.tokenAddress = tokens
  vd.sender = senders

  store.set("VaultDepositList", id, vd as VaultDepositList)

}
