import { log } from '@graphprotocol/graph-ts'

import {
  ChangePermissionManager as ChangePermissionManagerEvent,
  SetPermission as SetPermissionEvent,
  SetPermissionParams as SetPermissionParamsEvent,
} from '../../generated/templates/ACL/ACL'

export function handleSetPermission(event: SetPermissionEvent): void {
  log.warning('[ACL][SetPermission] entity={}, app={}, role={}, allowed={}', [
    event.params.entity.toHex(),
    event.params.app.toHex(),
    event.params.role.toHex(),
    event.params.allowed ? 'yes' : 'no',
  ])
}

export function handleSetPermissionParams(event: SetPermissionParamsEvent): void {
  log.warning('[ACL][SetPermissionParams] entity={}, app={}, role={}, paramsHash={}', [
    event.params.entity.toHex(),
    event.params.app.toHex(),
    event.params.role.toHex(),
    event.params.paramsHash.toHex(),
  ])
}

export function handleChangePermissionManager(event: ChangePermissionManagerEvent): void {
  log.warning('[ACL][ChangePermissionManager] app={}, role={}, manager={}', [
    event.params.app.toHex(),
    event.params.role.toHex(),
    event.params.manager.toHex(),
  ])
}
