/*
 * Fluence Compute Marketplace
 *
 * Copyright (C) 2024 Fluence DAO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

pragma solidity ^0.8.19;

import "src/core/Core.sol";
import "src/core/CapacityConst.sol";
import "src/core/EpochController.sol";
import "src/core/GlobalConst.sol";

import "src/core/modules/capacity/Capacity.sol";

import "src/core/modules/market/Market.sol";
import "src/core/modules/market/Matcher.sol";
import "src/core/modules/market/Offer.sol";
import "src/core/modules/market/DealFactory.sol";

import "src/deal/Deal.sol";
import "src/deal/Config.sol";
import "src/deal/WorkerManager.sol";

import "src/utils/OwnableUpgradableDiamond.sol";
import "src/utils/Whitelist.sol";

// #region core
contract CoreStorageMock {
    Core.CoreStorage internal _coreStorage;
}

contract CapacityConstStorageMock {
    CapacityConst.ConstStorage internal _capacityConstStorage;
}

contract EpochControllerStorageMock {
    EpochController.EpochControllerStorage internal _epochControllerStorage;
}

contract GlobalStorageMock {
    GlobalConst.GlobalConstStorage internal _globalStorage;
}
// #endregion

// #region capacity
contract CapacityStorageMock {
    Capacity.CommitmentStorage internal _capacityStorage;
}
// #endregion
// #region market

contract MatcherStorageMock {
    Matcher.MatcherStorage internal _matcherStorage;
}

contract OfferStorageMock {
    Offer.OfferStorage internal _offerStorage;
}

contract DealFactoryStorageMock {
    DealFactory.DealFactoryStorage internal _dealFactoryStorage;
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
