pragma solidity ^0.8.17;

library RedBlackTree {
    enum Color {
        Red,
        Black
    }
    struct Tree {
        mapping(uint64 => Node) nodes;
        uint64 root;
        uint64 height;
    }

    struct Node {
        Color color;
        uint64 parent;
        uint64 value;
        uint64 left;
        uint64 right;
    }

    function insert(Tree storage self, uint64 value) internal {
        if (self.root == 0) {
            self.nodes[value] = Node({ color: Color.Black, parent: 0, value: value, left: 0, right: 0 });
            self.root = value;
            self.height = 1;
            return;
        }

        uint height = self.height;
        uint[] memory path = new uint[](height);

        uint64 nextValue = self.root;
        uint64 currentHeight = 1;

        while (true) {
            Node memory node = self.nodes[nextValue];
            _writeNodeToPath(path, 0, node);

            uint64 nodeValue = nextValue;

            if (value < nodeValue) {
                nextValue = node.left;

                if (nextValue == 0) {
                    self.nodes[nodeValue].left = value;
                    break;
                }
            } else if (value > nodeValue) {
                nextValue = node.right;

                if (nextValue == 0) {
                    self.nodes[nodeValue].right = value;
                    break;
                }
            } else {
                revert("Value already exists");
            }

            if (nextValue == 0) {
                self.nodes[value] = Node({ color: Color.Red, parent: nodeValue, value: value, left: 0, right: 0 });
            }

            currentHeight++;
        }

        if (currentHeight > height) {
            self.height = currentHeight;
        }

        _fix(self, path, currentHeight - 1);
    }

    function _fix(Tree storage self, uint[] memory path, uint nodeIndex) private {
        Node memory node = _getNodeFromMemory(path[nodeIndex]);
        if (node.parent == 0) {
            self.nodes[node.value].color = Color.Black;
        } else {
            Node memory nodeParent = _getNodeFromMemory(path[nodeIndex - 1]);
            if (nodeParent.color == Color.Black) {
                return;
            }

            Node memory nodeGrandparent = _getNodeFromMemory(path[nodeIndex - 2]);

            uint64 uncleValue;
            if (nodeGrandparent.left == nodeParent.value) {
                uncleValue = nodeGrandparent.right;
            } else {
                uncleValue = nodeGrandparent.left;
            }

            if (uncleValue != 0) {
                Node storage uncle = self.nodes[uncleValue];
                if (uncle.color == Color.Red) {
                    self.nodes[nodeParent.value].color = Color.Black;
                    uncle.color = Color.Black;

                    self.nodes[nodeGrandparent.value].color = Color.Red;
                    _fix(self, path, nodeIndex - 2);
                    return;
                }
            } else {
                _rotate(self, node, nodeParent, nodeGrandparent);
            }
        }
    }

    function _rotate(Tree storage self, Node memory node, Node memory nodeParent, Node memory nodeGrandparent) private {
        if (node.value == nodeParent.right && nodeParent.value == nodeGrandparent.left) {
            _rotateLeft(self, self.nodes[nodeParent.value]);
        } else if (node.value == nodeParent.left && nodeParent.value == nodeGrandparent.right) {
            _rotateRight(self, self.nodes[nodeParent.value]);
        }

        Node storage nodeParentStorage = self.nodes[nodeParent.value];
        Node storage nodeGrandparentStorage = self.nodes[nodeGrandparent.value];

        nodeParentStorage.color = Color.Black;
        nodeGrandparentStorage.color = Color.Red;

        if (node.value == nodeParentStorage.left && nodeParentStorage.value == nodeGrandparentStorage.left) {
            _rotateRight(self, nodeGrandparentStorage);
        } else {
            _rotateLeft(self, nodeGrandparentStorage);
        }
    }

    function _rotateLeft(Tree storage self, Node storage node) private {
        Node storage pivot = self.nodes[node.right];

        uint64 nodeParentValue = node.parent;
        pivot.parent = nodeParentValue;

        if (nodeParentValue == 0) {
            self.root = pivot.value;
        } else {
            Node storage nodeParent = self.nodes[nodeParentValue];

            if (nodeParent.left == node.value) {
                nodeParent.left = pivot.value;
            } else {
                nodeParent.right = pivot.value;
            }
        }

        uint64 pivotLeft;
        node.right = pivotLeft;
        if (pivotLeft != 0) {
            Node storage pivotLeftNode = self.nodes[pivotLeft];
            pivotLeftNode.parent = node.value;
        }

        node.parent = pivot.value;
        pivot.left = node.value;
    }

    function _rotateRight(Tree storage self, Node storage node) private {
        Node storage pivot = self.nodes[node.left];

        uint64 nodeParentValue = node.parent;
        pivot.parent = nodeParentValue;

        if (nodeParentValue == 0) {
            self.root = pivot.value;
        } else {
            Node storage nodeParent = self.nodes[nodeParentValue];

            if (nodeParent.left == node.value) {
                nodeParent.left = pivot.value;
            } else {
                nodeParent.right = pivot.value;
            }
        }

        uint64 pivotRight;
        node.left = pivotRight;
        if (pivotRight != 0) {
            Node storage pivotRightNode = self.nodes[pivotRight];
            pivotRightNode.parent = node.value;
        }

        node.parent = pivot.value;
        pivot.right = node.value;
    }

    function _getNodeFromMemory(uint offset) private pure returns (Node memory node) {
        assembly {
            node := offset
        }
    }

    function _writeNodeToPath(uint256[] memory path, uint index, Node memory node) private pure {
        uint offset;
        assembly {
            offset := node
        }

        path[index] = offset;
    }
}
