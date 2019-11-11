import { Address, Bytes, log } from '@graphprotocol/graph-ts'

import { NewAppProxy, SetApp } from '../../generated/templates/Kernel/Kernel'

import { Agent, Finance, Payroll, Survey, TokenManager, Vault, Voting } from '../../generated/templates'
import { Agent as AgentContract } from '../../generated/templates/Agent/Agent'
import { Finance as FinanceContract } from '../../generated/templates/Finance/Finance'
import { Payroll as PayrollContract } from '../../generated/templates/Payroll/Payroll'
import { TokenManager as TokenManagerContract } from '../../generated/templates/TokenManager/TokenManager'
import { Vault as VaultContract } from '../../generated/templates/Vault/Vault'
import { Voting as VotingContract } from '../../generated/templates/Voting/Voting'

import {
  AgentAppProxy,
  FinanceAppProxy,
  PayrollAppProxy,
  SurveyAppProxy,
  TokenManagerAppProxy,
  VaultAppProxy,
  VotingAppProxy,
} from '../../generated/schema'

const AGENT_APP_ID = '0x9ac98dc5f995bf0211ed589ef022719d1487e5cb2bab505676f0d084c07cf89a'
const FINANCE_APP_ID = '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae'
const PAYROLL_APP_ID = '0x463f596a96d808cb28b5d080181e4a398bc793df2c222f6445189eb801001991'
const SURVEY_APP_ID = '0x030b2ab880b88e228f2da5a3d19a2a31bc10dbf91fb1143776a6de489389471e'
const TOKEN_MANAGER_APP_ID = '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f'
const VAULT_APP_ID = '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1'
const VOTING_APP_ID = '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4'

export function handleNewAppProxy(event: NewAppProxy): void {
  let appId = event.params.appId.toHexString()

  if (appId == AGENT_APP_ID) {
    registerAgentProxy(event.params.proxy)
  }

  if (appId == FINANCE_APP_ID) {
    registerFinanceProxy(event.params.proxy)
  }

  if (appId == PAYROLL_APP_ID) {
    registerPayrollProxy(event.params.proxy)
  }

  if (appId == SURVEY_APP_ID) {
    registerSurveyProxy(event.params.proxy)
  }

  if (appId == TOKEN_MANAGER_APP_ID) {
    registerTokenManagerProxy(event.params.proxy)
  }

  if (appId == VAULT_APP_ID) {
    registerVaultProxy(event.params.proxy)
  }

  if (appId == VOTING_APP_ID) {
    registerVotingProxy(event.params.proxy)
  }
}

export function handleSetApp(event: SetApp): void {
  log.debug('[Kernel][SetApp] namespace={}, appId={}, appAddress={}, daoAddress={}', [
    event.params.namespace.toHexString(),
    event.params.appId.toHexString(),
    event.params.app.toHexString(),
    event.address.toHexString(),
  ])

  // TODO
}

function registerAgentProxy(appProxyAddress: Address): void {
  let app = AgentAppProxy.load(appProxyAddress.toHexString())

  if (app == null) {
    let instance = AgentContract.bind(appProxyAddress)

    app = new AgentAppProxy(appProxyAddress.toHexString())
    app.appId = instance.appId()
    app.proxyAddress = appProxyAddress

    // TODO: get other app settings

    app.save()

    // Start indexing app events
    Agent.create(appProxyAddress)
  }
}

function registerFinanceProxy(appProxyAddress: Address): void {
  let app = FinanceAppProxy.load(appProxyAddress.toHexString())

  if (app == null) {
    let instance = FinanceContract.bind(appProxyAddress)

    app = new FinanceAppProxy(appProxyAddress.toHexString())
    app.appId = instance.appId()
    app.proxyAddress = appProxyAddress
    // TODO: get other app settings

    app.save()

    // Start indexing app events
    Finance.create(appProxyAddress)
  }
}

function registerPayrollProxy(appProxyAddress: Address): void {
  let app = PayrollAppProxy.load(appProxyAddress.toHexString())

  if (app == null) {
    // TODO: let instance = PayrollContract.bind(appProxyAddress)

    app = new PayrollAppProxy(appProxyAddress.toHexString())
    app.appId = Bytes.fromHexString(PAYROLL_APP_ID) as Bytes
    app.proxyAddress = appProxyAddress
    // TODO: get other app settings

    app.save()

    // Start indexing app events
    Payroll.create(appProxyAddress)
  }
}

function registerSurveyProxy(appProxyAddress: Address): void {
  let app = SurveyAppProxy.load(appProxyAddress.toHexString())

  if (app == null) {
    // TODO: let instance = PayrollContract.bind(appProxyAddress)

    app = new SurveyAppProxy(appProxyAddress.toHexString())
    app.appId = Bytes.fromHexString(SURVEY_APP_ID) as Bytes
    app.proxyAddress = appProxyAddress
    // TODO: get other app settings

    app.save()

    // Start indexing app events
    Survey.create(appProxyAddress)
  }
}

function registerTokenManagerProxy(appProxyAddress: Address): void {
  let app = TokenManagerAppProxy.load(appProxyAddress.toHexString())

  if (app == null) {
    let instance = TokenManagerContract.bind(appProxyAddress)

    app = new TokenManagerAppProxy(appProxyAddress.toHexString())
    app.appId = instance.appId()
    app.proxyAddress = appProxyAddress

    // TODO: get other app settings

    app.save()

    // Start indexing app events
    TokenManager.create(appProxyAddress)
  }
}

function registerVaultProxy(appProxyAddress: Address): void {
  let app = VaultAppProxy.load(appProxyAddress.toHexString())

  if (app == null) {
    // TODO: let instance = VaultContract.bind(appProxyAddress)

    app = new VaultAppProxy(appProxyAddress.toHexString())
    app.appId = Bytes.fromHexString(VAULT_APP_ID) as Bytes
    app.proxyAddress = appProxyAddress
    // TODO: get other app settings

    app.save()

    // Start indexing app events
    Vault.create(appProxyAddress)
  }
}

function registerVotingProxy(appProxyAddress: Address): void {
  let app = VotingAppProxy.load(appProxyAddress.toHexString())

  if (app == null) {
    let instance = VotingContract.bind(appProxyAddress)

    app = new VotingAppProxy(appProxyAddress.toHexString())
    app.appId = instance.appId()
    app.proxyAddress = appProxyAddress

    app.minQuorumPercent = instance.minAcceptQuorumPct()
    app.supportRequiredPercent = instance.supportRequiredPct()

    app.save()

    // Start indexing app events
    Voting.create(appProxyAddress)
  }
}
