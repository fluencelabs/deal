pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IProviderManager.sol";
import "./PMInternalInterface.sol";

abstract contract ProviderManagerInternal is
    PMInternalInterface,
    DMInternalInterface
{
    mapping(IProviderManager.PATId => IProviderManager.PAT) private _pats;

    function _getPAT(
        IProviderManager.PATId id
    ) internal view override returns (IProviderManager.PAT memory) {
        return _pats[id];
    }

    function _addCollateral(
        IProviderManager.PATId id,
        IProviderManager.PAT memory pat,
        IERC20 token,
        uint256 stake
    ) internal override {
        require(pat.collateral > 0, ""); //TODO: text

        _subBalance(token, pat.collateral, pat.owner);

        _pats[id].collateral += stake;
    }

    function _removeCollateral(
        IProviderManager.PATId id,
        IProviderManager.PAT memory pat,
        IERC20 token
    ) internal override {
        require(pat.collateral > 0, ""); //TODO: text
        _addBalance(token, pat.collateral, pat.owner);

        delete _pats[id];
    }
}
