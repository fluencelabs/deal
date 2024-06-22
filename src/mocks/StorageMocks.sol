// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {OwnableUpgradableDiamond} from "src/utils/OwnableUpgradableDiamond.sol";
import {CoreStorage} from "src/lib/LibCore.sol";
import {CapacityConstStorage} from "src/lib/LibCapacityConst.sol";
import {EpochControllerStorage} from "src/lib/LibEpochController.sol";
import {GlobalConstStorage} from "src/lib/LibGlobalConst.sol";
import {MatcherStorage} from "src/lib/LibMatcher.sol";
import {CommitmentStorage} from "src/lib/LibCapacity.sol";
import {OfferStorage} from "src/lib/LibOffer.sol";
import {DealFactoryStorage} from "src/lib/LibDealFactory.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {Config} from "src/deal/Config.sol";
import {WorkerManager} from "src/deal/WorkerManager.sol";
import {WhitelistStorage} from "src/lib/LibWhitelist.sol";


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
    DealFactoryStorage internal _dealFactoryStorage;
}

// #endregion

// #region deal

contract DealStorageMock {
    IDeal.DealStorage internal _dealStorage;
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
    WhitelistStorage internal _whitelistStorage;
}
// #endregion utils
