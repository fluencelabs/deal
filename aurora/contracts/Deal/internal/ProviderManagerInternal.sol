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

    struct OwnerInfo {
        uint256 patsCount;
    }

    bytes32 private constant _PREFIX_PAT_OWNER_SLOT =
        keccak256("network.fluence.ProviderManager.pat.owner.");
    bytes32 private constant _PREFIX_PAT_COLLATERAL_SLOT =
        keccak256("network.fluence.ProviderManager.pat.collateral.");

    mapping(address => OwnerInfo) private _ownersInfo;

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

        uint256 patsCountByOwner = _ownersInfo[owner].patsCount;

        require(
            patsCountByOwner < _maxWorkersPerProvider(),
            "Max workers per provider reached"
        );
        require(ownerSlot.value == address(0x00), "Id already used");

        uint256 requiredStake = _requiredStake();

        _fluenceToken().safeTransferFrom(owner, address(this), requiredStake);

        StorageSlot.Uint256Slot storage collateralSlot = StorageSlot
            .getUint256Slot(_getSlotPATCollateral(id));

        ownerSlot.value = owner;
        collateralSlot.value = requiredStake;

        _ownersInfo[owner].patsCount = patsCountByOwner + 1;
    }

    function _removePAT(IProviderManager.PATId id) internal override {
        StorageSlot.AddressSlot storage ownerSlot = StorageSlot.getAddressSlot(
            _getSlotPATOwner(id)
        );
        StorageSlot.Uint256Slot storage collateralSlot = StorageSlot
            .getUint256Slot(_getSlotPATCollateral(id));

        uint256 collateral = collateralSlot.value;
        address owner = ownerSlot.value;

        _createWithdrawRequest(_fluenceToken(), owner, collateral);

        delete ownerSlot.value;
        delete collateralSlot.value;

        _ownersInfo[owner].patsCount--;
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

    function _getSlotPATCollateral(IProviderManager.PATId id)
        internal
        pure
        returns (bytes32)
    {
        bytes32 bytes32Id = IProviderManager.PATId.unwrap(id);
        return
            bytes32(
                uint256(
                    keccak256(
                        abi.encodePacked(_PREFIX_PAT_COLLATERAL_SLOT, bytes32Id)
                    )
                ) - 1
            );
    }
}
