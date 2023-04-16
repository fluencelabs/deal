// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../Utils/AVLTree.sol";

contract AVLMock {
    AVLTree.Tree tree;

    function insert(uint64 value) external {
        AVLTree.insert(tree, value);
    }

    function getRoot() external view returns (uint64) {
        return tree.root;
    }

    function getNode(uint64 value) external view returns (AVLTree.Node memory) {
        return tree.nodes[value];
    }
}
