import { log } from '@graphprotocol/graph-ts'

import {
  StartVote,
  CastVote,
  ExecuteVote,
  ChangeSupportRequired,
  ChangeMinQuorum,
  RecoverToVault,
  ScriptResult,
} from '../../../generated/templates/Voting/Voting'

import { NonSupportVote, SupportVote, Vote, VotingApp } from '../../../generated/schema'

export function handleStartVote(event: StartVote): void {
  let appAddress = event.address.toHexString()

  let vote = new Vote(appAddress + '-' + event.params.voteId.toString())
  vote.app = appAddress
  vote.creator = event.params.creator
  vote.executed = false
  vote.metadata = event.params.metadata

  vote.created = event.block.timestamp
  vote.createdAtBlock = event.block.number
  vote.createdAtTransaction = event.transaction.hash

  vote.updated = event.block.timestamp

  vote.save()
}

export function handleCastVote(event: CastVote): void {
  let appAddress = event.address.toHexString()
  let voteId = event.params.voteId
  let voter = event.params.voter

  let txHash = event.transaction.hash.toHex()

  if (event.params.supports) {
    let vote = new SupportVote(appAddress + '-' + voteId.toString() + '-' + voter.toHexString() + '-YES' + '-' + txHash)
    vote.app = event.address.toHexString()
    vote.stake = event.params.stake
    vote.voter = event.params.voter

    vote.save()
  } else {
    let vote = new NonSupportVote(appAddress + '-' + voteId.toString() + '-' + voter.toHexString() + '-NO' + '-' + txHash)
    vote.app = event.address.toHexString()
    vote.stake = event.params.stake
    vote.voter = event.params.voter

    vote.save()
  }
}

export function handleExecuteVote(event: ExecuteVote): void {
  let vote = new Vote(event.address.toHexString() + '-' + event.params.voteId.toString())
  vote.executed = true
  vote.updated = event.block.timestamp

  vote.save()
}

export function handleChangeSupportRequired(event: ChangeSupportRequired): void {
  let app = new VotingApp(event.address.toHexString())
  app.supportRequiredPercent = event.params.supportRequiredPct

  app.save()
}

export function handleChangeMinQuorum(event: ChangeMinQuorum): void {
  let app = new VotingApp(event.address.toHexString())
  app.minQuorumPercent = event.params.minAcceptQuorumPct

  app.save()
}

export function handleScriptResult(event: ScriptResult): void {
  log.debug('[Voting][ScriptResult] appAddress={}, executor={}, script={}, input={}, returnData={}', [
    event.address.toHexString(),
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.debug('[Voting][RecoverToVault] appAddress={}, vault={}, token={}, amount={}', [
    event.address.toHexString(),
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}
