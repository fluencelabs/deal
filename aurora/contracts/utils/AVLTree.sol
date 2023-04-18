pragma solidity ^0.8.17;

import "hardhat/console.sol";

library AVLTree {
    struct Tree {
        mapping(uint64 => Node) nodes;
        uint64 root;
        uint64 height;
    }

    struct Node {
        int8 balance;
        uint64 parent;
        uint64 value;
        uint64 left;
        uint64 right;
    }

    function insert(Tree storage self, uint64 value) internal {
        if (self.root == 0) {
            self.nodes[value] = Node({ balance: 0, parent: 0, value: value, left: 0, right: 0 });
            self.root = value;
            self.height = 1;
            return;
        }

        uint height = self.height;
        Node[] memory path = new Node[](height);
        path[0] = self.nodes[self.root];

        (uint64 newHeight, Node memory newNode) = _insert(self, path, value, 1);

        uint256 prevValue = newNode.value;
        for (int64 index = int64(newHeight - 2); index >= 0; index--) {
            uint64 i = uint64(index);
            Node memory node = path[i];

            int8 nodeBalance = node.balance;
            if (node.left == prevValue) {
                nodeBalance++;
            } else if (node.right == prevValue) {
                nodeBalance--;
            } else {
                revert("Invalid path");
            }

            // TODO: root is not updated
            Node storage nodeStorage = self.nodes[node.value];
            nodeStorage.balance = nodeBalance;

            console.logInt(nodeBalance);
            if (nodeBalance > 1) {
                if (self.nodes[node.left].balance >= 0) {
                    prevValue = _smallRotateRight(self, nodeStorage);
                } else {
                    prevValue = _bigRotateRight(self, nodeStorage);
                }
                break;
            } else if (nodeBalance < -1) {
                if (self.nodes[node.right].balance >= 0) {
                    prevValue = _bigRotateLeft(self, nodeStorage);
                } else {
                    prevValue = _smallRotateLeft(self, nodeStorage);
                }
                break;
            } else {
                prevValue = node.value;
            }
        }

        if (newHeight > height) {
            self.height = newHeight;
        }
    }

    function searchGTE(Tree storage self, uint value) internal returns (uint) {
        if (self.root == 0) {
            return 0;
        }

        Node memory node = self.nodes[self.root];
        return _searchGTE(self, node, 0, value);
    }

    function _searchGTE(Tree storage self, Node memory node, uint lastFinded, uint value) private returns (uint) {
        if (value > node.value) {
            if (node.right != 0) {
                return _searchGTE(self, self.nodes[node.right], lastFinded, value);
            }
        } else if (value < node.value) {
            lastFinded = node.value;
            if (node.left != 0) {
                return _searchGTE(self, self.nodes[node.left], lastFinded, value);
            }
        } else {
            return node.value;
        }

        return lastFinded;
    }

    function _insert(Tree storage self, Node[] memory path, uint64 value, uint64 height) private returns (uint64, Node memory) {
        Node memory node = path[height - 1];
        uint64 nextValue;
        uint64 nodeValue = node.value;

        if (value < nodeValue) {
            nextValue = node.left;

            if (nextValue == 0) {
                node.left = value;
                self.nodes[nodeValue].left = value;
            }
        } else if (value > nodeValue) {
            nextValue = node.right;

            if (nextValue == 0) {
                node.right = value;
                self.nodes[nodeValue].right = value;
            }
        } else {
            revert("Value already exists");
        }

        if (nextValue == 0) {
            Node memory newNode = Node({ balance: 0, parent: nodeValue, value: value, left: 0, right: 0 });
            self.nodes[value] = newNode;
            return (height + 1, newNode);
        }

        path[height] = self.nodes[nextValue];

        return _insert(self, path, value, height + 1); //TODO: link or copy?
    }

    function _smallRotateLeft(Tree storage self, Node storage a) private returns (uint64) {
        /* 
                 a                               b
                / \                             / \
            left   b           ->              a  right
                  / \                         / \   
             center  right                  left center
        */

        Node storage parent = self.nodes[a.parent];
        Node storage b = self.nodes[a.right];
        Node storage center = self.nodes[b.left];

        console.logString("Rotate left");
        console.logString("Parent");
        console.logUint(parent.value);

        b.left = a.value;
        b.balance++;
        b.parent = a.parent;
        if (a.parent == 0) {
            self.root = b.value;
        }

        if (parent.left == a.value) {
            parent.left = b.value;
        } else {
            parent.right = b.value;
        }

        a.parent = b.value;
        a.balance += 2;
        a.right = center.value;

        if (center.value != 0) {
            center.parent = a.value;
        }
        return b.value;
    }

    function _smallRotateRight(Tree storage self, Node storage a) private returns (uint64) {
        /* 
                 a                               b
                / \                             / \
               b  right          ->         left   a
              / \                                 / \   
           left center                      center  right
        */

        Node storage parent = self.nodes[a.parent];
        Node storage b = self.nodes[a.left];
        Node storage center = self.nodes[b.right];

        console.logString("Rotate right");
        console.logString("Parent");
        console.logUint(parent.value);

        b.right = a.value;
        b.balance--;
        b.parent = a.parent;
        if (a.parent == 0) {
            self.root = b.value;
        }

        if (parent.left == a.value) {
            parent.left = b.value;
        } else {
            parent.right = b.value;
        }

        a.parent = b.value;
        a.balance -= 2;
        a.left = center.value;

        if (center.value != 0) {
            center.parent = a.value;
        }

        return b.value;
    }

    function _bigRotateLeft(Tree storage self, Node storage a) private returns (uint64) {
        console.logString("Rotate big left");

        Node storage b = self.nodes[a.right];
        Node storage c = self.nodes[b.left];
        Node storage m = self.nodes[c.left];
        Node storage n = self.nodes[c.right];

        c.left = a.value;
        a.parent = c.value;

        c.right = b.value;
        b.parent = c.value;

        a.right = m.value;
        if (m.parent != 0) {
            m.parent = a.value;
        }

        b.left = n.value;
        if (n.parent != 0) {
            n.parent = b.value;
        }

        return c.value;
    }

    function _bigRotateRight(Tree storage self, Node storage a) private returns (uint64) {
        console.logString("Rotate big right");

        Node storage b = self.nodes[a.left];
        Node storage c = self.nodes[b.right];
        Node storage m = self.nodes[c.left];
        Node storage n = self.nodes[c.right];

        c.left = b.value;
        b.parent = c.value;

        c.right = a.value;
        a.parent = c.value;

        b.right = m.value;
        if (m.parent != 0) {
            m.parent = b.value;
        }

        a.left = n.value;
        if (n.parent != 0) {
            n.parent = a.value;
        }

        return c.value;
    }
}
