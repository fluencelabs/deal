// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MatcherConfig.sol";
import "./interfaces/IMatcher.sol";
import "../../deal/interfaces/IDeal.sol";
import "../../deal/interfaces/IConfig.sol";

contract Matcher is MatcherConfig, IMatcher {
    using SafeERC20 for IERC20;
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;
    using ComputeProvidersList for ComputeProvidersList.List;
    using ComputeProvidersList for ComputeProvidersList.ComputePeersList;

    // ----------------- Constants -----------------
    uint256 private constant _MIN_REMATCHING_EPOCHS = 2;

    // ----------------- Constructor -----------------
    constructor(IGlobalCore globalCore_) MatcherConfig(globalCore_) {}

    // ----------------- View -----------------
    // TODO: move this logic to offchain. Temp solution
    function findComputePeers(IDeal deal) external view returns (address[] memory computeProviders, bytes32[][] memory computePeers) {
        ConfigStorage storage configStorage = _getConfigStorage();

        uint pricePerWorkerEpoch = deal.pricePerWorkerEpoch();
        uint collateralPerWorker = deal.collateralPerWorker();
        uint freeWorkerSlots = deal.targetWorkers() - deal.getComputeUnitCount();
        CIDV1[] memory effectors = deal.effectors();
        IDeal.AccessType accessType = deal.accessType();

        bytes32 currentId = configStorage.computeProvidersList.first();
        ComputeProvidersList.List memory foundComputeProviders;

        // TODO: optimize with white list
        while (currentId != bytes32(0x00) && freeWorkerSlots > 0) {
            address computeProviderAddress = address(bytes20(currentId));

            if (
                (accessType == IConfig.AccessType.BLACKLIST && deal.isInAccessList(computeProviderAddress)) ||
                (accessType == IConfig.AccessType.WHITELIST && !deal.isInAccessList(computeProviderAddress)) ||
                pricePerWorkerEpoch < configStorage.computeProviderByOwner[computeProviderAddress].minPricePerEpoch ||
                collateralPerWorker > configStorage.computeProviderByOwner[computeProviderAddress].maxCollateral ||
                !_doComputeProviderHasEffectors(computeProviderAddress, effectors)
            ) {
                currentId = configStorage.computeProvidersList.next(currentId);
                continue;
            }

            ComputeProvidersList.ComputePeersList memory foundComputePeers = foundComputeProviders.add(computeProviderAddress);

            LinkedListWithUniqueKeys.Bytes32List storage computePeersList = configStorage.computePeersListByProvider[
                computeProviderAddress
            ];
            bytes32 peerId = computePeersList.first();

            while (peerId != bytes32(0x00) && freeWorkerSlots > 0) {
                foundComputePeers.add(peerId);
                freeWorkerSlots--;

                peerId = computePeersList.next(peerId);
            }

            // get next compute provider
            currentId = configStorage.computeProvidersList.next(currentId);
        }

        ComputeProvidersList.CPsAndPeersBytes32Array memory result = foundComputeProviders.toBytes32Array();

        //TODO: fix double copy for ABI encoder with asm
        return (result.computeProviders, result.computePeers);
    }

    // ----------------- Mutable -----------------
    //TODO: refactoring
    function matchDeal(IDeal deal, address[] calldata providers, bytes32[][] calldata peers) external {
        ConfigStorage storage configStorage = _getConfigStorage();

        uint currentEpoch = _globalCore.currentEpoch();
        require(currentEpoch > configStorage.minMatchingEpochByDeal[deal], "Deal is not ready for matching");
        require(_globalCore.factory().hasDeal(deal), "Deal is not from factory");

        IERC20 fluenceToken = _globalCore.fluenceToken();

        // load deal config
        CIDV1[] memory effectors = deal.effectors();
        uint dealRequiredCollateral = deal.collateralPerWorker();
        uint dealPricePerEpoch = deal.pricePerWorkerEpoch();
        uint freeWorkerSlotsInDeal = deal.targetWorkers() - deal.getComputeUnitCount();
        IDeal.AccessType accessType = deal.accessType();

        CIDV1 memory dealAppCID = deal.appCID(); //TODO: temp solution for peers. Remove from event in future.
        uint dealCreationBlock = deal.creationBlock(); //TODO: temp solution for peers. Remove from event in future.

        bool isMatched = false;
        uint providersLength = providers.length;
        for (uint i = 0; i < providersLength; i++) {
            address computeProviderAddress = providers[i];

            if (accessType == IConfig.AccessType.WHITELIST) {
                require(deal.isInAccessList(computeProviderAddress), "Compute provider is not in whitelist");
            } else if (accessType == IConfig.AccessType.BLACKLIST) {
                require(!deal.isInAccessList(computeProviderAddress), "Compute provider is in blacklist");
            }

            uint maxCollateral = configStorage.computeProviderByOwner[computeProviderAddress].maxCollateral;
            uint minPricePerEpoch = configStorage.computeProviderByOwner[computeProviderAddress].minPricePerEpoch;

            if (
                minPricePerEpoch > dealPricePerEpoch ||
                maxCollateral < dealRequiredCollateral ||
                !_doComputeProviderHasEffectors(computeProviderAddress, effectors)
            ) {
                continue;
            }

            uint peersLength = peers[i].length;
            for (uint j = 0; j < peersLength; j++) {
                bytes32 peerId = peers[i][j];

                // create ComputeUnits
                fluenceToken.approve(address(deal), dealRequiredCollateral);
                bytes32 computeUnitId = deal.createComputeUnit(computeProviderAddress, peerId);

                // refound collateral
                uint refoundByWorker = maxCollateral - dealRequiredCollateral;
                if (refoundByWorker > 0) {
                    fluenceToken.transfer(computeProviderAddress, refoundByWorker);
                }

                freeWorkerSlotsInDeal--;

                uint freeWorkerSlots = configStorage.computePeerByPeerId[peerId].freeWorkerSlots;
                freeWorkerSlots--;

                // update free worker slots
                if (freeWorkerSlots == 0) {
                    delete configStorage.computePeerByPeerId[peerId];
                    configStorage.computePeersListByProvider[computeProviderAddress].remove(peerId);
                } else {
                    configStorage.computePeerByPeerId[peerId].freeWorkerSlots = freeWorkerSlots;
                }

                emit ComputePeerMatched(peerId, deal, computeUnitId, dealCreationBlock, dealAppCID);
                isMatched = true;

                if (freeWorkerSlotsInDeal == 0) {
                    return;
                }
            }
        }

        if (isMatched) {
            configStorage.minMatchingEpochByDeal[deal] = currentEpoch + _MIN_REMATCHING_EPOCHS;
        }
    }
}
