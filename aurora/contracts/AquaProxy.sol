pragma solidity ^0.8.17;

import "./auroraSDK/AuroraSdk.sol";

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
    mapping(bytes32 => ParticleStatus) public particlesStatuses;

    event VerifyParticle(
        bytes32 hash,
        string air,
        string prevData,
        string params,
        string callResults
    );

    uint64 constant VS_NEAR_GAS = 30_000_000_000_000;

    constructor(string memory aquaVMAddress_) {
        aquaVMAddress = aquaVMAddress_;
        aquaVMImplicitAddress = AuroraSdk.implicitAuroraAddress(aquaVMAddress);

        near = AuroraSdk.initNear(wNEAR);

        selfReprsentativeImplicitAddress = AuroraSdk
            .nearRepresentitiveImplicitAddress(address(this));
    }

    function verifyParticle(Particle calldata particle) public {
        bytes32 particleHash = keccak256(
            abi.encodePacked(
                particle.air,
                particle.prevData,
                particle.params,
                particle.callResults
            )
        );

        require(
            particlesStatuses[particleHash] == ParticleStatus.None,
            "Particle already executed"
        );

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

        PromiseCreateArgs memory callbackPromise = near.auroraCall(
            address(this),
            abi.encodeWithSelector(this.callback.selector, particleHash),
            0,
            VS_NEAR_GAS
        );

        verifyScriptCall.then(callbackPromise).lazy_transact();

        particlesStatuses[particleHash] = ParticleStatus.Pending;

        emit VerifyParticle(
            particleHash,
            particle.air,
            particle.prevData,
            particle.params,
            particle.callResults
        );
    }

    function callback(bytes32 particleHash) public {
        require(
            msg.sender == selfReprsentativeImplicitAddress,
            "ERR_ACCESS_DENIED"
        );

        require(
            particlesStatuses[particleHash] == ParticleStatus.Pending,
            "Particle already executed"
        );

        if (
            AuroraSdk.promiseResult(0).status != PromiseResultStatus.Successful
        ) {
            particlesStatuses[particleHash] = ParticleStatus.Failure;
        } else {
            particlesStatuses[particleHash] = ParticleStatus.Success;
        }
    }
}
