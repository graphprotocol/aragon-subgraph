// Import APIs from graph-ts
import {Bytes, BigInt} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {StartVote, CastVote, ExecuteVote, ChangeSupportRequired, ChangeMinQuorum} from '../types/Voting/Voting'

// Import entity types from the schema
import {Vote, Voting} from '../types/schema'

export function handleStartVote(event: StartVote): void {
  let id = event.params.voteId.toString()
  let creator = event.params.creator
  let metadata = event.params.metadata

  let vote = new Vote(id)
  vote.appAddress = event.address
  vote.creator = creator
  vote.metadata = metadata
  vote.nonSupporters = new Array<Bytes>()
  vote.nonSupportersStake = new Array<BigInt>()
  vote.supporters = new Array<Bytes>()
  vote.supportersStake = new Array<BigInt>()
  vote.executed = false // still getting an error where false shows up as null

  vote.save()
}

// Note: getting one instance where there is a double vote, not sure why, but it might be okay, you only vote with some of your stake, then do it again
export function handleCastVote(event: CastVote): void {
  let id = event.params.voteId.toString()
  let voter = event.params.voter
  let stake = event.params.stake

  let vote = Vote.load(id)

  if (event.params.supports == true) {
    let voters = vote.supporters
    let stakes = vote.supportersStake
    voters.push(voter)
    stakes.push(stake)
    vote.supporters = voters
    vote.supportersStake = stakes
    vote.save()
  } else {
    let nonSupportVoters = vote.nonSupporters
    let nonSupportStakes = vote.nonSupportersStake
    nonSupportVoters.push(voter)
    nonSupportStakes.push(stake)
    vote.nonSupporters = nonSupportVoters
    vote.nonSupportersStake = nonSupportStakes
    vote.save()
  }

}

export function handleExecuteVote(event: ExecuteVote): void {
  let id = event.params.voteId.toString()
  let vote = Vote.load(id)
  vote.executed = true
  vote.save()

}

// Untested, as it is not in the dapp
export function handleChangeSupportRequired(event: ChangeSupportRequired): void {
  let id = event.address.toHex()
  let voting = Voting.load(id)
  voting.supportRequiredPercent = event.params.supportRequiredPct
  voting.save()
}

// Untested, as it is not in the dapp
export function handleChangeMinQuorum(event: ChangeMinQuorum): void {
  let id = event.address.toHex()
  let voting = Voting.load(id)
  voting.minQuorumPercent = event.params.minAcceptQuorumPct
  voting.save()
}

