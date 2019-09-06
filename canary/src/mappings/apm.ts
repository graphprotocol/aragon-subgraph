import { DeployAPM as DeployAPMEvent } from '../../generated/APM/APMRegistryFactory'
import { NewRepo as NewRepoEvent } from '../../generated/templates/APMRegistry/APMRegistry'
import {
  NewVersion as NewVersionEvent,
  Repo as RepoContract,
} from '../../generated/templates/Repo/Repo'

import * as templates from '../../generated/templates'

import * as schema from '../../generated/schema'

export function handleDeployAPM(event: DeployAPMEvent): void {
  let apm = new schema.PackageRegistry(event.params.apm.toHex())
  apm.address = event.params.apm
  apm.node = event.params.node

  apm.created = event.block.timestamp
  apm.createdAtBlock = event.block.number
  apm.createdAtTransaction = event.transaction.hash

  apm.save()

  templates.APMRegistry.create(event.params.apm)
}

export function handleNewRepo(event: NewRepoEvent): void {
  let repo = new schema.Package(event.params.id.toHex())
  repo.address = event.params.repo
  repo.name = event.params.name.toString()
  repo.registry = event.address.toHex()

  repo.created = event.block.timestamp
  repo.createdAtBlock = event.block.number
  repo.createdAtTransaction = event.transaction.hash

  repo.save()

  // Right now the following line produce this error: "Subgraph instance failed to run: A dynamic data source, in the
  // same block that it was created, attempted to create another dynamic data source. To let us know that you are
  // affected by this bug, please comment in https://github.com/graphprotocol/graph-node/issues/1105 [...]".
  // Enable next line when that ticket is resolved.
  /* templates.Repo.create(event.params.repo) */
}

export function handleNewVersion(event: NewVersionEvent): void {
  let repo = RepoContract.bind(event.address)

  let info = repo.getByVersionId(event.params.versionId)

  let version = new schema.PackageVersion(event.params.versionId.toHex())
  version.pkg = repo.appId().toHex()
  version.version = event.params.semanticVersion.join('.')
  version.contract = info.value1
  version.contentURI = info.value2.toString()

  version.created = event.block.timestamp
  version.createdAtBlock = event.block.number
  version.createdAtTransaction = event.transaction.hash

  version.save()
}
