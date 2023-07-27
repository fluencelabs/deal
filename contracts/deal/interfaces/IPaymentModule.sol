// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "../base/Types.sol";

interface IPaymentModule {
    function balance() external view returns (uint256);

    function rewardAmount(bytes32 particleHash, bytes32 patId) external view returns (uint);

    function depositToPaymentBalance(uint256 amount) external;

    function withdrawFromPaymentBalance(uint256 amount) external;

    function commitParticle(Particle calldata particle) external;

    function withdrawReward(bytes32 patId, bytes32[] calldata particlesHashes) external;
}
