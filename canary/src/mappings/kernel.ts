import { log } from '@graphprotocol/graph-ts'

import { NewAppProxy, SetApp } from '../../generated/templates/Kernel/Kernel'

import { registerFinanceApp } from './apps/finance'
import { registerTokenManagerApp } from './apps/token-manager'
import { registerVotingApp } from './apps/voting'

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
