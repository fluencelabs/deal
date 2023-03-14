pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IWithdrawManagerInternal.sol";
import "./interfaces/IDealConfigInternal.sol";
import "../../Utils/WithdrawRequests.sol";

abstract contract WithdrawManagerInternal is IDealConfigInternal, IWithdrawManagerInternal {
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    mapping(address => WithdrawRequests.Requests) private _requests;

    modifier onlyFluenceToken(IERC20 token) {
        require(_fluenceToken() == token, "WithdrawManagerInternal: wrong token");
        _;
    }

    function _getUnlockedAmountBy(
        IERC20 token,
        address owner,
        uint256 timestamp
    ) internal view override onlyFluenceToken(token) returns (uint256) {
        return _requests[owner].getAmountBy(timestamp - _core().withdrawTimeout());
    }

    function _createWithdrawRequest(IERC20 token, address owner, uint256 amount) internal override onlyFluenceToken(token) {
        _requests[owner].push(amount);
    }

    function _withdraw(IERC20 token, address owner) internal override onlyFluenceToken(token) {
        uint256 amount = _requests[owner].confirmBy(block.timestamp - _core().withdrawTimeout());

        token.safeTransfer(owner, amount);
    }
}
