pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library AVLTree {
    struct Tree {
        mapping(uint256 => Node) nodes;
        uint256 root;
    }

    struct Node {
        uint64 color;
        uint64 value;
        uint64 left;
        uint64 right;
    }

    function insert(Tree storage self, uint256 value) internal {}
}
