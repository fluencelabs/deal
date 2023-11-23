// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

interface IGlobalConst {
    function fluenceToken() external view returns (address);

    function minDepositedEpoches() external view returns (uint);

    function minRematchingEpoches() external view returns (uint);
}
