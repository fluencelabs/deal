// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

interface IStatusController {
    // ------------------ Types ------------------
    enum Status {
        INACTIVE,
        ACTIVE,
        ENDED
    }

    // ------------------ Views ------------------
    function getCommittedStatus() external view returns (Status);

    function startedEpoch() external view returns (uint);
}
