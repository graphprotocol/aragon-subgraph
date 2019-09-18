import { Address, log } from '@graphprotocol/graph-ts'

import { NewAppProxy, SetApp } from '../../generated/templates/Kernel/Kernel'

import { Finance, TokenManager, Voting } from '../../generated/templates'
import { Finance as FinanceContract } from '../../generated/templates/Finance/Finance'
import { TokenManager as TokenManagerContract } from '../../generated/templates/TokenManager/TokenManager'
import { Voting as VotingContract } from '../../generated/templates/Voting/Voting'

import { FinanceApp, TokenManagerApp, VotingApp } from '../../generated/schema'

const FINANCE_APP_ID = '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae'
const TOKEN_MANAGER_APP_ID = '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f'
const VOTING_APP_ID = '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4'

export function handleNewAppProxy(event: NewAppProxy): void {
  log.debug('[Kernel][NewAppProxy] appId={}, proxy={}, isUpgradeable={}, daoAddress={}', [
    event.params.appId.toHexString(),
    event.params.proxy.toHexString(),
    event.params.isUpgradeable ? 'true' : 'false',
    event.address.toHexString(),
  ])

  let appId = event.params.appId.toHexString()

  if (appId == FINANCE_APP_ID) {
    registerFinanceApp(event.params.proxy)
  }

  if (appId == TOKEN_MANAGER_APP_ID) {
    registerTokenManagerApp(event.params.proxy)
  }

  if (appId == VOTING_APP_ID) {
    registerVotingApp(event.params.proxy)
  }
}

export function handleSetApp(event: SetApp): void {
  log.debug('[Kernel][SetApp] namespace={}, appId={}, appAddress={}, daoAddress={}', [
    event.params.namespace.toHexString(),
    event.params.appId.toHexString(),
    event.params.app.toHexString(),
    event.address.toHexString(),
  ])
}

function registerFinanceApp(appAddress: Address): FinanceApp {
  let app = FinanceApp.load(appAddress.toHexString())

  if (app == null) {
    let instance = FinanceContract.bind(appAddress)

    app = new FinanceApp(appAddress.toHexString())
    app.appAddress = appAddress
    app.appId = instance.appId()

    // TODO: get other contract parameters

    app.save()

    // Start indexing app events
    // Enable next line when https://github.com/graphprotocol/graph-node/issues/1105 is resolved.
    /* Finance.create(appAddress) */
  }

  return app as FinanceApp
}

function registerTokenManagerApp(appAddress: Address): TokenManagerApp {
  let app = TokenManagerApp.load(appAddress.toHexString())

  if (app == null) {
    let instance = TokenManagerContract.bind(appAddress)

    app = new TokenManagerApp(appAddress.toHexString())
    app.appAddress = appAddress
    app.appId = instance.appId()

    // TODO: get other contract parameters

    app.save()

    // Start indexing app events
    // Enable next line when https://github.com/graphprotocol/graph-node/issues/1105 is resolved.
    /* TokenManager.create(appAddress) */
  }

  return app as TokenManagerApp
}

function registerVotingApp(appAddress: Address): VotingApp {
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
