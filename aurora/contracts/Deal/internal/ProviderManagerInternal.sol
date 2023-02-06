pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "../external/interfaces/IProviderManager.sol";
import "./interfaces/PMInternalInterface.sol";
import "./interfaces/DCInternalInterface.sol";
import "./interfaces/WMInternalInterface.sol";

abstract contract ProviderManagerInternal is
    WMInternalInterface,
    PMInternalInterface,
    DCInternalInterface
{
    using SafeERC20 for IERC20;

    bytes32 private constant _PREFIX_PAT_OWNER_SLOT =
        keccak256("network.fluence.ProviderManager.pat.owner.");

    mapping(IProviderManager.PATId => uint256) private _collaterals;

    function _getPATOwner(IProviderManager.PATId id)
        internal
        view
        override
        returns (address)
    {
        return StorageSlot.getAddressSlot(_getSlotPATOwner(id)).value;
    }

    function _createPAT(IProviderManager.PATId id, address owner)
        internal
        override
    {
        StorageSlot.AddressSlot storage ownerSlot = StorageSlot.getAddressSlot(
            _getSlotPATOwner(id)
        );
        require(ownerSlot.value == address(0x00), "Id already used");

        uint256 requiredStake = _requiredStake();

        _fluenceToken().safeTransferFrom(owner, address(this), requiredStake);

        ownerSlot.value = owner;
        _collaterals[id] = requiredStake;
    }

    function _removePAT(IProviderManager.PATId id) internal override {
        StorageSlot.AddressSlot storage ownerSlot = StorageSlot.getAddressSlot(
            _getSlotPATOwner(id)
        );
        uint256 collateral = _collaterals[id];

        _createWithdrawRequest(_fluenceToken(), ownerSlot.value, collateral);

        delete ownerSlot.value;
        delete _collaterals[id];
    }

    function _getSlotPATOwner(IProviderManager.PATId id)
        internal
        pure
        returns (bytes32)
    {
        bytes32 bytes32Id = IProviderManager.PATId.unwrap(id);
        return
            bytes32(
                uint256(
                    keccak256(
                        abi.encodePacked(_PREFIX_PAT_OWNER_SLOT, bytes32Id)
                    )
                ) - 1
            );
    }
}
