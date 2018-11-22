import 'allocator/arena'

export {allocate_memory}

// Import APIs from graph-ts
import {store, Bytes, BigInt} from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {StartVote, CastVote, ExecuteVote, ChangeSupportRequired, ChangeMinQuorum} from '../types/Voting/Voting'

// Import entity types from the schema
import {Vote, Voting} from '../types/schema'


// event StartVote(uint256 indexed voteId, address indexed creator, string metadata);
// event CastVote(uint256 indexed voteId, address indexed voter, bool supports, uint256 stake);
// event ExecuteVote(uint256 indexed voteId);
// event ChangeSupportRequired(uint64 supportRequiredPct);
// event ChangeMinQuorum(uint64 minAcceptQuorumPct);

export function handleStartVote(event: StartVote): void {
  let id = event.params.voteId.toString()
  let creator = event.params.creator
  let metadata = event.params.metadata

  let vote = new Vote()
  vote.appAddress = event.address
  vote.creator = creator
  vote.metadata = metadata
  vote.nonSupporters = new Array<Bytes>()
  vote.nonSupportersStake = new Array<BigInt>()
  vote.supporters = new Array<Bytes>()
  vote.supportersStake = new Array<BigInt>()
  vote.executed = false // still getting an error where false shows up as null

  store.set("Vote", id, vote)
}

// TODO: getting one instance where there is a double vote, not sure why
// MIght be okay, you only vote with some of your stake, then do it again
export function handleCastVote(event: CastVote): void {
  let id = event.params.voteId.toString()
  let voter = event.params.voter
  let stake = event.params.stake

  let vote = store.get("Vote", id) as Vote

  if (event.params.supports == true) {
    let voters = vote.supporters
    let stakes = vote.supportersStake
    voters.push(voter)
    stakes.push(stake)
    vote.supporters = voters
    vote.supportersStake = stakes
    store.set("Vote", id, vote)
  } else {
    let nonSupportVoters = vote.nonSupporters
    let nonSupportStakes = vote.nonSupportersStake
    nonSupportVoters.push(voter)
    nonSupportStakes.push(stake)
    vote.nonSupporters = nonSupportVoters
    vote.nonSupportersStake = nonSupportStakes
    store.set("Vote", id, vote)
  }

}

export function handleExecuteVote(event: ExecuteVote): void {
  let id = event.params.voteId.toString()
  let vote = store.get("Vote", id) as Vote
  vote.executed = true
  store.set("Vote", id, vote)

}

// Untested
export function handleChangeSupportRequired(event: ChangeSupportRequired): void {
  let id = event.address.toHex()
  let voting = store.get("Voting", id) as Voting
  voting.supportRequiredPercent = event.params.supportRequiredPct
  store.set("Voting", id, voting)
}

// Untested
export function handleChangeMinQuorum(event: ChangeMinQuorum): void {
  let id = event.address.toHex()
  let voting = store.get("Voting", id) as Voting
  voting.minQuorumPercent = event.params.minAcceptQuorumPct
  store.set("Voting", id, voting)
}

