import {
  createOrLoadGraphNetwork,
} from "../models";
import {Initialized} from "../../generated/Core/Core";
import {getEpochDuration} from "../contracts";

export function handleInitialized(event: Initialized): void {
  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.coreEpochDuration = getEpochDuration(event.address);
  graphNetwork.save()
}
