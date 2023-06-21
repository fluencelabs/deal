// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./Types.sol";
import "../interfaces/ICore.sol";

contract ModuleBase is UUPSUpgradeable {
    bytes32 private constant _CORE_SLOT = keccak256("network.fluence.proxy.core");

    modifier onlyModule(Module module) {
        require(_core().moduleByType(module) == msg.sender, "ModuleBase: caller is not required module");
        _;
    }

    modifier onlyModules(Module[] calldata modules) {
        Module callerModule = _core().moduleByAddress(msg.sender);

        bool isRequiredModule = false;
        for (uint256 i = 0; i < modules.length; i++) {
            if (modules[i] != callerModule) {
                continue;
            }

            isRequiredModule = true;
            break;
        }

        require(isRequiredModule, "ModuleBase: caller is not required module");
        _;
    }

    modifier onlyOwner() {
        require(_core().owner() == msg.sender, "ModuleBase: caller is not owner");
        _;
    }

    modifier onlyCore() {
        require(address(_core()) == msg.sender, "ModuleBase: caller is not core");
        _;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyCore {
        //TODO: check that new implementation from DAO
    }

    function _core() internal view returns (ICore) {
        return ICore(StorageSlot.getAddressSlot(_CORE_SLOT).value);
    }

    uint256[50] private __gap;
}
