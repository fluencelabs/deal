import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  AdminChanged,
  BeaconUpgraded,
  Initialized,
  ResourceOwnerRegistred,
  ResourceOwnerRemoved,
  Upgraded
} from "../generated/Matcher/Matcher"

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createResourceOwnerRegistredEvent(
  owner: Address,
  info: ethereum.Tuple
): ResourceOwnerRegistred {
  let resourceOwnerRegistredEvent = changetype<ResourceOwnerRegistred>(
    newMockEvent()
  )

  resourceOwnerRegistredEvent.parameters = new Array()

  resourceOwnerRegistredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  resourceOwnerRegistredEvent.parameters.push(
    new ethereum.EventParam("info", ethereum.Value.fromTuple(info))
  )

  return resourceOwnerRegistredEvent
}

export function createResourceOwnerRemovedEvent(
  owner: Address
): ResourceOwnerRemoved {
  let resourceOwnerRemovedEvent = changetype<ResourceOwnerRemoved>(
    newMockEvent()
  )

  resourceOwnerRemovedEvent.parameters = new Array()

  resourceOwnerRemovedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return resourceOwnerRemovedEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
