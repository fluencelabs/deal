// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

library LinkedListWithUniqueKeys {
    // ------------------ TYPES ------------------
    struct Element {
        bytes32 prev;
        bytes32 next;
    }

    struct Bytes32List {
        bytes32 _first;
        bytes32 _last;
        uint256 _length;
        mapping(bytes32 => Element) _elements;
    }

    // ------------------ PRIVATE ------------------
    function _has(Bytes32List storage self, Element memory element, bytes32 key) private view returns (bool) {
        return element.prev != bytes32(0x00) || element.next != bytes32(0x00) || key == self._first || key == self._last;
    }

    // ------------------ VIEWS ------------------

    function first(Bytes32List storage self) internal view returns (bytes32) {
        return self._first;
    }

    function last(Bytes32List storage self) internal view returns (bytes32) {
        return self._last;
    }

    function length(Bytes32List storage self) internal view returns (uint256) {
        return self._length;
    }

    function has(Bytes32List storage self, bytes32 key) internal view returns (bool) {
        return _has(self, self._elements[key], key);
    }

    function next(Bytes32List storage self, bytes32 key) internal view returns (bytes32) {
        return self._elements[key].next;
    }

    function prev(Bytes32List storage self, bytes32 key) internal view returns (bytes32) {
        return self._elements[key].prev;
    }

    function toArray(Bytes32List storage self) internal view returns (bytes32[] memory) {
        uint256 arrayLength = self._length;
        bytes32[] memory array = new bytes32[](arrayLength);

        bytes32 current = self._first;
        for (uint256 i = 0; i < arrayLength; i++) {
            array[i] = current;
            current = self._elements[current].next;
        }

        return array;
    }

    // ------------------ MUTABLES ------------------
    function push(Bytes32List storage self, bytes32 key) internal {
        require(key != bytes32(0x00), "Key cannot be ZERO");
        require(!has(self, key), "Key already exists");

        bytes32 oldLast = self._last;

        self._length++;

        if (oldLast == 0) {
            self._first = key;
            self._last = key;
            return;
        }

        self._last = key;
        self._elements[key].prev = oldLast;
        self._elements[oldLast].next = key;
    }

    function remove(Bytes32List storage self, bytes32 key) internal {
        Element memory element = self._elements[key];

        require(_has(self, element, key), "Key does not exist");

        if (element.prev == bytes32(0x00)) {
            self._first = element.next;
        }

        if (element.next == bytes32(0x00)) {
            self._last = element.prev;
        }

        if (element.prev != bytes32(0x00)) {
            self._elements[element.prev].next = element.next;
        }

        if (element.next != bytes32(0x00)) {
            self._elements[element.next].prev = element.prev;
        }

        delete self._elements[key];

        self._length--;
    }
}
