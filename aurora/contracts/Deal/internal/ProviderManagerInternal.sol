pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
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

    struct Collateral {
        address owner;
        uint256 collateral;
    }
    mapping(IProviderManager.PATId => Collateral) private _pats;

    function _getPATOwner(IProviderManager.PATId id)
        internal
        view
        override
        returns (address)
    {
        return _pats[id].owner;
    }

    function _createPAT(IProviderManager.PATId id, address owner)
        internal
        override
    {
        uint256 requiredStake = _requiredStake();

        _fluenceToken().safeTransferFrom(owner, address(this), requiredStake);

        _pats[id].owner = owner;
        _pats[id].collateral = requiredStake;
    }

    function _removePAT(IProviderManager.PATId id) internal override {
        address owner = _pats[id].owner;
        uint256 collateral = _pats[id].collateral;

        _createWithdrawRequest(_fluenceToken(), owner, collateral);

        delete _pats[id];
    }
}
