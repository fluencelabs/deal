pragma solidity ^0.8.17;

import "../AuroraSDK/AuroraSdk.sol";

contract AquaProxy {
    using AuroraSdk for NEAR;
    using AuroraSdk for PromiseWithCallback;
    using AuroraSdk for PromiseCreateArgs;

    enum ParticleStatus {
        None,
        Pending,
        Success,
        Failure
    }

    struct Particle {
        string air;
        string prevData;
        string params;
        string callResults;
    }

    IERC20 constant wNEAR = IERC20(0x4861825E75ab14553E5aF711EbbE6873d369d146);

    address public immutable selfReprsentativeImplicitAddress;
    address public immutable aquaVMImplicitAddress;

    NEAR public near;
    string public aquaVMAddress;

    uint64 constant VS_NEAR_GAS = 30_000_000_000_000;

    constructor(string memory aquaVMAddress_) {
        aquaVMAddress = aquaVMAddress_;
        aquaVMImplicitAddress = AuroraSdk.implicitAuroraAddress(aquaVMAddress);

        near = AuroraSdk.initNear(wNEAR);

        selfReprsentativeImplicitAddress = AuroraSdk
            .nearRepresentitiveImplicitAddress(address(this));
    }

    function verifyParticle(Particle calldata particle) public {
        PromiseCreateArgs memory verifyScriptCall = near.call(
            aquaVMAddress,
            "verify_script",
            abi.encodePacked(
                Codec.encode(bytes(particle.air)),
                Codec.encode(bytes(particle.prevData)),
                Codec.encode(bytes(particle.params)),
                Codec.encode(bytes(particle.callResults))
            ),
            0,
            VS_NEAR_GAS
        );

        verifyScriptCall.transact();
    }
}
