pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IProviderManager.sol";
import "./PMInternalInterface.sol";
import "../BalanceManager/BMInternalInterface.sol";

abstract contract ProviderManagerInternal is
    PMInternalInterface,
    BMInternalInterface
{
    mapping(IProviderManager.PATId => address) private _pats;

    function _getPATOwner(
        IProviderManager.PATId id
    ) internal view override returns (address) {
        return _pats[id];
    }

    function _getCollateral(
        IProviderManager.PATId id
    ) internal view override returns (uint) {
        return
            _getBalance(
                IERC20(address(0)),
                _getPATOwner(id),
                uint256(IProviderManager.PATId.unwrap(id))
            );
    }

    function _addCollateral(
        IProviderManager.PATId id,
        address owner,
        IERC20 token,
        uint256 collateral
    ) internal override {
        _deposit(
            token,
            owner,
            uint256(IProviderManager.PATId.unwrap(id)),
            collateral
        );
        _pats[id] = owner;
    }

    function _removeCollateral(
        IProviderManager.PATId id,
        IERC20 token
    ) internal override {
        _createWithdrawRequest(
            token,
            _getCollateral(id),
            uint256(IProviderManager.PATId.unwrap(id)),
            _getPATOwner(id)
        );

        delete _pats[id];
    }
}
