// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

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

        require(key != bytes32(0x00), "Key cannot be ZERO");

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

        require(_exist(self, element, key), "Key does not exist");

        delete self._elements[key];

        if (element.prev != bytes32(0x00)) {
            self._elements[element.prev].next = element.next;
        } else {
            self._first = element.next;
        }

        if (element.next != bytes32(0x00)) {
            self._elements[element.next].prev = element.prev;
        } else {
            self._last = element.prev;
        }
    }

    function exist(Bytes32List storage self, bytes32 key) internal view returns (bool) {
        return _exist(self, self._elements[key], key);
    }

    function _exist(Bytes32List storage self, Element memory element, bytes32 key) private view returns (bool) {
        return element.prev != bytes32(0x00) || element.next != bytes32(0x00) || key == self._first || key == self._last;
    }

    function next(Bytes32List storage self, bytes32 key) internal view returns (bytes32) {
        return self._elements[key].next;
    }

    function prev(Bytes32List storage self, bytes32 key) internal view returns (bytes32) {
        return self._elements[key].prev;
    }
}
