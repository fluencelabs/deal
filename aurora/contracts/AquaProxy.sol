pragma solidity ^0.8.17;

import "./AuroraSDK/Types.sol";
import "./AuroraSDK/Codec.sol";

contract AquaProxy {
    using Codec for PromiseCreateArgs;

    struct Particle {
        string air;
        string prevData;
        string params;
        string callResults;
    }

    address constant XCC_PRECOMPILE =
        0x516Cded1D16af10CAd47D6D49128E2eB7d27b372;
    uint64 constant VS_NEAR_GAS = 300_000_000_000_000;

    string nearAddress;

    constructor(string memory nearAddress_) {
        nearAddress = nearAddress_;
    }

    function isValidScript(Particle calldata particle) public returns (bool) {
        PromiseCreateArgs memory nearPromise = PromiseCreateArgs(
            nearAddress,
            "verify_script",
            abi.encodePacked(
                bytes(particle.air).length,
                particle.air,
                bytes(particle.prevData).length,
                particle.prevData,
                bytes(particle.params).length,
                particle.params,
                bytes(particle.callResults).length,
                particle.callResults
            ),
            0,
            VS_NEAR_GAS
        );

        (bool success, bytes memory returnData) = XCC_PRECOMPILE.call(
            nearPromise.encodeCrossContractCallArgs(ExecutionMode.Eager)
        );

        if (!success) {
            revert(string(returnData));
        }

        return true;
    }
}
