import { log } from '@graphprotocol/graph-ts'

import {
  CastVote,
  ChangeMinParticipation,
  RecoverToVault,
  ResetVote,
  StartSurvey,
  ScriptResult,
} from '../../../generated/templates/Survey/Survey'

import { Survey } from '../../../generated/schema'

export function handleStartSurvey(event: StartSurvey): void {
  let appAddress = event.address.toHexString()

  let survey = new Survey(appAddress + '-' + event.params.surveyId.toString())
  survey.app = appAddress
  survey.creator = event.params.creator
  survey.metadata = event.params.metadata

  survey.created = event.block.timestamp
  survey.createdAtBlock = event.block.number
  survey.createdAtTransaction = event.transaction.hash

  survey.updated = event.block.timestamp

  survey.save()
}

export function handleCastVote(event: CastVote): void {
  log.warning('[Survey][CastVote] proxyAddress={}, surveyId={}, voter={}, option={}, stake={}, optionPower={}', [
    event.address.toHexString(),
    event.params.surveyId.toString(),
    event.params.voter.toHex(),
    event.params.option.toString(),
    event.params.stake.toString(),
    event.params.optionPower.toString(),
  ])

  // TODO
}

export function handleResetVote(event: ResetVote): void {
  log.warning('[Survey][ResetVote] proxyAddress={}, surveyId={}, voter={}, option={}, previousStake={}, optionPower={}', [
    event.address.toHexString(),
    event.params.surveyId.toString(),
    event.params.voter.toHex(),
    event.params.option.toString(),
    event.params.previousStake.toString(),
    event.params.optionPower.toString(),
  ])

  // TODO
}

export function handleChangeMinParticipation(event: ChangeMinParticipation): void {
  log.warning('[Survey][ChangeMinParticipation] proxyAddress={}, minParticipationPct={}', [
    event.address.toHexString(),
    event.params.minParticipationPct.toString(),
  ])

  // TODO
}

export function handleScriptResult(event: ScriptResult): void {
  log.warning('[Survey][ScriptResult] proxyAddress={}, executor={}, script={}, input={}, returnData={}', [
    event.address.toHexString(),
    event.params.executor.toHex(),
    event.params.script.toHex(),
    event.params.input.toHex(),
    event.params.returnData.toHex(),
  ])

  // TODO
}

export function handleRecoverToVault(event: RecoverToVault): void {
  log.warning('[Survey][RecoverToVault] proxyAddress={}, vault={}, token={}, amount={}', [
    event.address.toHexString(),
    event.params.vault.toHex(),
    event.params.token.toHex(),
    event.params.amount.toString(),
  ])

  // TODO
}
