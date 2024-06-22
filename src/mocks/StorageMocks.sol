// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {CoreFacet} from "src/core/CoreFacet.sol";
import {CoreStorage} from "src/lib/LibCore.sol";
import {CapacityConstStorage} from "src/lib/LibCapacityConst.sol";
import {EpochControllerStorage} from "src/lib/LibEpochController.sol";
import {GlobalConstStorage} from "src/lib/LibGlobalConst.sol";
import {MatcherStorage} from "src/lib/LibMatcher.sol";

import "src/core/CapacityConst.sol";
import "src/core/GlobalConst.sol";

import "src/core/modules/capacity/CapacityFacet.sol";

import {MarketFacet} from "src/core/modules/market/MarketFacet.sol";
import {Matcher} from "src/core/modules/market/Matcher.sol";
import "src/core/modules/market/Offer.sol";
import {DealFactoryFacet} from "src/core/modules/market/DealFactoryFacet.sol";

import "src/deal/Deal.sol";
import "src/deal/Config.sol";
import "src/deal/WorkerManager.sol";

import "src/utils/OwnableUpgradableDiamond.sol";
import "src/utils/Whitelist.sol";

// #region core
contract CoreStorageMock {
    CoreStorage internal _coreStorage;
}

contract CapacityConstStorageMock {
    CapacityConstStorage internal _capacityConstStorage;
}

contract EpochControllerStorageMock {
    EpochControllerStorage internal _epochControllerStorage;
}

contract GlobalStorageMock {
    GlobalConstStorage internal _globalStorage;
}
// #endregion

// #region capacity
contract CapacityStorageMock {
    CommitmentStorage internal _capacityStorage;
}
// #endregion
// #region market

contract MatcherStorageMock {
    MatcherStorage internal _matcherStorage;
}

contract OfferStorageMock {
    OfferStorage internal _offerStorage;
}

contract DealFactoryStorageMock {
    DealFactoryFacet.DealFactoryStorage internal _dealFactoryStorage;
}

// #endregion

// #region deal

contract DealStorageMock {
    Deal.DealStorage internal _dealStorage;
}

contract ConfigStorageMock {
    Config.ConfigStorage internal _configStorage;
}

contract WorkerManagerStorageMock {
    WorkerManager.WorkerManagerStorage internal _workerManagerStorage;
}
// #endregion

// #region utils
contract OwnableUpgradableDiamondStorageMock {
    OwnableUpgradableDiamond.OwnableStorage internal _ownableUpgradableDiamondStorage;
}

contract WhitelistStorageMock {
    Whitelist.WhitelistStorage internal _whitelistStorage;
}
// #endregion utils
