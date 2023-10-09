// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Config.sol";
import "../utils/LinkedListWithUniqueKeys.sol";
import "./interfaces/IStatusController.sol";
import "../global/interfaces/IGlobalCore.sol";

abstract contract StatusController is Config, IStatusController {
    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1.statusController")) - 1);

    struct StatusControllerStorage {
        Status status;
        uint startedEpoch;
        uint endedEpoch;
    }

    StatusControllerStorage private _storage;

    function _getStatusControllerStorage() private pure returns (StatusControllerStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Public Mutable Functions ---------------------
    function getCommittedStatus() public view returns (Status) {
        return _getStatusControllerStorage().status;
    }

    function startedEpoch() public view returns (uint) {
        return _getStatusControllerStorage().startedEpoch;
    }

    function endedEpoch() public view returns (uint) {
        return _getStatusControllerStorage().endedEpoch;
    }

    // ------------------ Internal Mutable Functions ------------------
    function _setStatus(Status status) internal {
        StatusControllerStorage storage statusControllerStorage = _getStatusControllerStorage();

        statusControllerStorage.status = status;

        if (status == Status.ACTIVE && statusControllerStorage.startedEpoch == 0) {
            statusControllerStorage.startedEpoch = _globalCore().currentEpoch();
        } else if (status == Status.ENDED && statusControllerStorage.endedEpoch == 0) {
            statusControllerStorage.endedEpoch = _globalCore().currentEpoch();
        }
    }
}
