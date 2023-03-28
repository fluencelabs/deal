// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "../Core/Core.sol";
import "../Deal/Deal.sol";

contract DealFactory {
    Core public core;
    address public defaultPaymentToken;
    Deal public dealImpl;

    bytes32 private constant _PREFIX_DEAL_SLOT = keccak256("network.fluence.DealFactory.deal.");

    event DealCreated(
        address deal,
        address paymentToken,
        uint256 pricePerEpoch,
        uint256 requiredStake,
        uint256 minWorkers,
        uint256 maxWorkersPerProvider,
        uint256 targetWorkers,
        string appCID,
        string[] effectorWasmsCids,
        uint256 epoch
    );

    constructor(Core core_, address defaultPaymentToken_, Deal dealImpl_) {
        core = core_;
        defaultPaymentToken = defaultPaymentToken_;
        dealImpl = dealImpl_;
    }

    function createDeal(uint256 minWorkers_, uint256 targetWorkers_, string memory appCID_) external {
        //TODO: args varables
        uint256 pricePerEpoch_ = 83 * 10 ** 15;
        uint256 requiredStake_ = 1 * 10 ** 18;
        uint256 maxWorkersPerProvider_ = 10000000;
        address paymentToken_ = defaultPaymentToken;

        string[] memory effectorWasmsCids_ = new string[](0);

        // TODO: create2 function
        Deal deal = new Deal(
            core,
            paymentToken_,
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkersPerProvider_,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_
        );

        _setDeal(address(deal));

        deal.transferOwnership(msg.sender);

        emit DealCreated(
            address(deal),
            address(paymentToken_),
            pricePerEpoch_,
            requiredStake_,
            minWorkers_,
            maxWorkersPerProvider_,
            targetWorkers_,
            appCID_,
            effectorWasmsCids_,
            core.epochManager().currentEpoch()
        );
    }

    function _setDeal(address deal) internal {
        _getDealSlot(deal).value = true;
    }

    function _hasDeal(address deal) internal view returns (bool) {
        return _getDealSlot(deal).value;
    }

    function _getDealSlot(address deal) private pure returns (StorageSlot.BooleanSlot storage) {
        bytes32 slot = bytes32(uint256(keccak256(abi.encode(_PREFIX_DEAL_SLOT, deal))) - 1);

        return StorageSlot.getBooleanSlot(slot);
    }
}
