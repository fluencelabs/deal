pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../Core/Core.sol";
import "./PeersManager.sol";

//TODO
/*
contract PaymentManagerState is PeersManagerState {
    struct Particle {
        PATId[] PATs;
    }

    struct State {
        mapping(PATId => mapping(uint256 => uint256)) epochBitmapByPAT;
        mapping(uint256 => Particle[]) pendingParticlesByEpoch;
    }

    State internal _paymentManagerState;
}

abstract contract PaymentManagerPrivate is PeersManager, PaymentManagerState {
    using SafeERC20 for IERC20;

    function _hashEpoch(PATId id, uint256 epoch) internal view returns (bool) {
        uint256 wordIndex = epoch / 256;
        uint256 bitIndex = epoch % 256;
        uint256 word = _paymentManagerState.epochBitmapByPAT[id][wordIndex];
        uint256 mask = (1 << bitIndex);

        return word & mask == mask;
    }

    function _setEpoch(PATId id, uint256 epoch) internal {
        uint256 wordIndex = epoch / 256;
        uint256 bitIndex = epoch % 256;
        _paymentManagerState.epochBitmapByPAT[id][wordIndex] =
            epochBitmapByPAT[id][wordIndex] |
            (1 << bitIndex);
    }

    function _confirmPrevEpochReward(
        uint256 currentEpoch,
        uint256 particleIndex
    ) internal {
        uint256 epochDelayForReward = _dealConfigState
            .core
            .epochDelayForReward();

        uint256 minAmountOfEpochsForReward = _dealConfigState
            .core
            .minAmountOfEpochsForReward();

        uint256 prevConfirmedEpoch = currentEpoch - epochDelayForReward;
        Particle memory particle = _paymentManagerState.pendingParticlesByEpoch[prevConfirmedEpoch][
            particleIndex
        ];

        if (particle.PATs.length > 0) {
            PATId[] memory rewardedPATs = new PATId[](particle.PATs.length);

            uint rewardedPATIndex = 0;

            for (uint256 i = 0; i < particle.PATs.length; i++) {
                PATId id = particle.PATs[i];

                if (
                    _canBeRewarded(
                        id,
                        prevConfirmedEpoch,
                        currentEpoch,
                        minAmountOfEpochsForReward
                    )
                ) {
                    rewardedPATs[i] = id;
                    rewardedPATIndex++;
                }
            }

            uint256 rewardByParticle = settings.pricePerEpoch /
                (2 ^ (particleIndex + 1));
            uint256 amount = rewardByParticle / rewardedPATIndex;

            IERC20 token = settings.paymentToken;
            for (uint256 i = 0; i < rewardedPATIndex; i++) {
                PAT storage pat = PATs[rewardedPATs[i]];
                balances[pat.owner].balanceByToken[token] += amount;
            }

            // unlock deposit

            delete pendingParticlesByEpoch[prevConfirmedEpoch];
        }
    }

    function _canBeRewarded(
        PATId id,
        uint256 fromEpoch,
        uint256 toEpoch,
        uint256 minAmountOfEpochsForReward
    ) internal view returns (bool) {
        uint256 epochCount = 0;

        for (uint256 j = fromEpoch; j <= toEpoch; j++) {
            //TODO: optimize
            if (_hashEpoch(id, j)) {
                epochCount++;
            }
        }

        return epochCount >= minAmountOfEpochsForReward;
    }
}

abstract contract PaymentManager is PaymentManagerPrivate {
    using SafeERC20 for IERC20;

    function submitGoldenParticle(
        PATId[] calldata pats,
        AquaProxy.Particle calldata particle
    ) external {
        aquaProxy().verifyParticle(particle);

        uint256 epoch = core.epochManager().getEpoch();

        //TODO: get pats from particle
        pendingParticlesByEpoch[epoch].push(Particle({PATs: pats}));
    }
}
*/
