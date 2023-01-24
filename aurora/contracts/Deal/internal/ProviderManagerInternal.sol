pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../external/interfaces/IProviderManager.sol";
import "./interfaces/PMInternalInterface.sol";
import "./interfaces/BMInternalInterface.sol";

abstract contract ProviderManagerInternal is
    BMInternalInterface,
    PMInternalInterface
{
    struct Collateral {
        address owner;
        IERC20 token;
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

    function _getPATToken(IProviderManager.PATId id)
        internal
        view
        override
        returns (IERC20)
    {
        return _pats[id].token;
    }

    function _getCollateral(IProviderManager.PATId id)
        internal
        view
        override
        returns (uint256)
    {
        return
            _getBalance(
                _getPATToken(id),
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
        _pats[id].owner = owner;
        _pats[id].token = token;
    }

    function _removeCollateral(IProviderManager.PATId id) internal override {
        uint256 balanceIdForPAT = uint256(IProviderManager.PATId.unwrap(id));
        address owner = _getPATOwner(id);
        IERC20 tokenForPAT = _getPATToken(id);
        uint256 collateral = _getCollateral(id);

        _transferBetweenBalances(
            tokenForPAT,
            owner,
            balanceIdForPAT,
            0,
            collateral
        );

        _createWithdrawRequest(tokenForPAT, collateral, 0, owner);

        delete _pats[id];
    }
}
