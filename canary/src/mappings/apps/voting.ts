import { Address, log } from '@graphprotocol/graph-ts'

import {
  Voting as VotingContract,
  StartVote,
  CastVote,
  ExecuteVote,
  ChangeSupportRequired,
  ChangeMinQuorum,
  RecoverToVault,
  ScriptResult,
} from '../../../generated/templates/Voting/Voting'

import { VotingApp, NonSupportVote, SupportVote, Vote } from '../../../generated/schema'
import { Voting } from '../../../generated/templates'

export function handleStartVote(event: StartVote): void {
  let app = registerVotingApp(event.address)

  let vote = new Vote(event.params.voteId.toString())
  vote.app = app.id
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
  let app = registerVotingApp(event.address)

  let voteId = event.params.voteId
  let voter = event.params.voter

  let txHash = event.transaction.hash.toHex()

  if (event.params.supports) {
    let vote = new SupportVote(voteId.toString() + '-' + voter.toHexString() + '-YES' + '-' + txHash)
    vote.app = app.id
    vote.stake = event.params.stake
    vote.voter = event.params.voter

    vote.save()
  } else {
    let vote = new NonSupportVote(voteId.toString() + '-' + voter.toHexString() + '-NO' + '-' + txHash)
    vote.app = app.id
    vote.stake = event.params.stake
    vote.voter = event.params.voter

    vote.save()
  }
}

export function handleExecuteVote(event: ExecuteVote): void {
  let vote = new Vote(event.params.voteId.toString())
  vote.executed = true
  vote.updated = event.block.timestamp

  vote.save()
}

export function handleChangeSupportRequired(event: ChangeSupportRequired): void {
  let app = registerVotingApp(event.address)
  app.supportRequiredPercent = event.params.supportRequiredPct

  app.save()
}

export function handleChangeMinQuorum(event: ChangeMinQuorum): void {
  let app = registerVotingApp(event.address)
  app.minQuorumPercent = event.params.minAcceptQuorumPct

  app.save()
}

export function handleScriptResult(event: ScriptResult): void {
  log.debug('[Voting][ScriptResult] executor={}, script={}, input={}, returnData={}', [
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.debug('[Voting][RecoverToVault] vault={}, token={}, amount={}', [
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}

export function registerVotingApp(appAddress: Address): VotingApp {
  let app = VotingApp.load(appAddress.toHexString())

  if (app == null) {
    let instance = VotingContract.bind(appAddress)

    app = new VotingApp(appAddress.toHexString())
    app.appAddress = appAddress
    app.appId = instance.appId()

    app.minQuorumPercent = instance.minAcceptQuorumPct()
    app.supportRequiredPercent = instance.supportRequiredPct()

    app.save()

    // Start indexing app events
    // Enable next line when https://github.com/graphprotocol/graph-node/issues/1105 is resolved.
    /* Voting.create(appAddress) */
  }

  return app as VotingApp
}
