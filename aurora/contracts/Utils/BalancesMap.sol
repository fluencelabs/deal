pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library BalancesMap {
    struct AddressToBalance {
        mapping(address => Balances) _balances;
    }

    struct Balances {
        mapping(IERC20 => uint256) _byToken;
    }

    function getBalance(
        AddressToBalance storage self,
        IERC20 token,
        address owner
    ) internal view returns (uint256) {
        return self._balances[owner]._byToken[token];
    }

    function add(
        AddressToBalance storage self,
        IERC20 token,
        address owner,
        uint256 amount
    ) internal {
        self._balances[owner]._byToken[token] += amount;
    }

    function sub(
        AddressToBalance storage self,
        IERC20 token,
        address owner,
        uint256 amount
    ) internal {
        uint256 balance = self._balances[owner]._byToken[token];

        require((balance - amount) >= 0, "Not enough balance");

        self._balances[owner]._byToken[token] = balance - amount;
    }
}
