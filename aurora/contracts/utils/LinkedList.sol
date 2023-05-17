// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "./Consts.sol";

library LinkedList {
    struct Element {
        bytes32 prev;
        bytes32 next;
    }

    struct Bytes32List {
        bytes32 _first;
        bytes32 _last;
        mapping(bytes32 => Element) _elements;
    }

    function _init(Bytes32List storage self, bytes32 key) private {
        self._first = key;
        self._last = key;
    }

    function push(Bytes32List storage self, bytes32 key) internal {
        bytes32 oldLast = self._last;

        require(key != NULL, "Key cannot be NULL");
        require(!exist(self, key), "Key already exists");

        if (oldLast == 0) {
            _init(self, key);
            return;
        }

        self._last = key;
        self._elements[key].prev = oldLast;
        self._elements[oldLast].next = key;
    }

    function first(Bytes32List storage self) internal view returns (bytes32) {
        return self._first;
    }

    function last(Bytes32List storage self) internal view returns (bytes32) {
        return self._last;
    }

    function remove(Bytes32List storage self, bytes32 key) internal {
        Element memory element = self._elements[key];

        if (!exist(self, key)) {
            return; //TODO: error?
        }

        delete self._elements[key];

        if (element.prev != NULL) {
            self._elements[element.prev].next = element.next;
        } else {
            self._first = element.next;
        }

        if (element.next != NULL) {
            self._elements[element.next].prev = element.prev;
        } else {
            self._last = element.prev;
        }
    }

    function exist(Bytes32List storage self, bytes32 key) internal view returns (bool) {
        Element storage element = self._elements[key];
        return element.prev != NULL || element.next != NULL;
    }

    function next(Bytes32List storage self, bytes32 key) internal view returns (bytes32) {
        bytes32 nextElement = self._elements[key].next;
        if (nextElement == NULL) {
            return NULL;
        }

        return nextElement;
    }

    function prev(Bytes32List storage self, bytes32 key) internal view returns (bytes32) {
        bytes32 prevElement = self._elements[key].prev;
        if (prevElement == NULL) {
            return (NULL);
        }

        return prevElement;
    }
}
