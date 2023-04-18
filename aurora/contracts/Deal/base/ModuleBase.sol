// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./Types.sol";
import "../interfaces/ICore.sol";

contract ModuleBase is UUPSUpgradeable {
    bytes32 private constant _CORE_SLOT = keccak256("network.fluence.proxy.core");

    modifier onlyModule(Module module) {
        require(_core().modules(module) == msg.sender, "ModuleBase: caller is not required module");
        _;
    }

    modifier onlyCore() {
        require(address(_core()) == msg.sender, "ModuleBase: caller is not core");
        _;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyCore {
        // TODO: check upgrade from UpgradeManager
    }

    function _core() internal view returns (ICore) {
        return ICore(StorageSlot.getAddressSlot(_CORE_SLOT).value);
    }

    uint256[50] private __gap;
}
