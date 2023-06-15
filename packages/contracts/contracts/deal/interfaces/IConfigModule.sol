// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../global/interfaces/IParticleVerifyer.sol";
import "../../global/interfaces/IGlobalConfig.sol";

interface IConfigModule {
    function initialize(
        IERC20 paymentToken_,
        uint256 pricePerEpoch_,
        uint256 requiredCollateral_,
        string memory appCID_,
        uint256 minWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 targetWorkers_,
        string[] memory effectorWasmsCids_
    ) external;

    function globalConfig() external view returns (IGlobalConfig);

    function fluenceToken() external view returns (IERC20);

    function particleVerifyer() external view returns (IParticleVerifyer);

    function paymentToken() external view returns (IERC20);

    function pricePerEpoch() external view returns (uint256);

    function requiredCollateral() external view returns (uint256);

    function appCID() external view returns (string memory);

    function minWorkers() external view returns (uint256);

    function maxWorkersPerProvider() external view returns (uint256);

    function targetWorkers() external view returns (uint256);

    function effectors() external view returns (string[] memory);

    function setAppCID(string calldata appCID_) external;
}
