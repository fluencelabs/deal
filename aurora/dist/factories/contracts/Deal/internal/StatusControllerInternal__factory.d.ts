import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { StatusControllerInternal, StatusControllerInternalInterface } from "../../../../contracts/Deal/internal/StatusControllerInternal";
export declare class StatusControllerInternal__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "enum IStatusControllerInternal.Status";
            readonly name: "newStatus";
            readonly type: "uint8";
        }];
        readonly name: "StatusChanged";
        readonly type: "event";
    }];
    static createInterface(): StatusControllerInternalInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): StatusControllerInternal;
}
