import {
  createOrLoadGraphNetwork,
} from "../models";
import {Initialized} from "../../generated/Core/Core";
import {getEpochDuration, getInitTimestamp} from "../contracts";

export function handleInitialized(event: Initialized): void {
  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.coreEpochDuration = getEpochDuration(event.address);
  graphNetwork.initTimestamp = getInitTimestamp(event.address);
  graphNetwork.save()
}
