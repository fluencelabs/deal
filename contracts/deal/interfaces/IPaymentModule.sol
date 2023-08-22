// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "../base/Types.sol";

interface IPaymentModule {
    // ----------------- Types -----------------
    struct Particle {
        string air;
        string prevData;
        string params;
        string callResults;
    }

    // ----------------- View -----------------
    function getRewardAmount(bytes32 particleHash, bytes32 patId) external view returns (uint);

    function getPaymentBalance() external view returns (uint256);

    function getLockedBalance() external view returns (uint256);

    // ----------------- Mutable -----------------
    function depositToPaymentBalance(uint256 amount) external;

    function withdrawFromPaymentBalance(uint256 amount) external;

    function commitParticle(Particle calldata particle, bytes32[] memory patIds) external;

    function withdrawReward(bytes32 patId, bytes32[] calldata particlesHashes) external;
}
