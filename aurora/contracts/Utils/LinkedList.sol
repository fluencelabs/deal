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

    function pushToStart(Bytes32List storage self, bytes32 key) internal {
        bytes32 old_first = self._first;

        if (old_first == 0) {
            _init(self, key);
            return;
        }

        self._first = key;
        self._elements[key].next = old_first;
        self._elements[old_first].prev = key;
    }

    function push(Bytes32List storage self, bytes32 key) internal {
        bytes32 old_last = self._last;

        if (old_last == 0) {
            _init(self, key);
            return;
        }

        self._last = key;
        self._elements[key].prev = old_last;
        self._elements[old_last].next = key;
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
        return element.prev != NULL || element.next == NULL;
    }

    function next(Bytes32List storage self, bytes32 key) internal view returns (bytes32, bool isOk) {
        bytes32 nextElement = self._elements[key].next;
        if (nextElement == NULL) {
            return (NULL, false);
        }

        return (nextElement, true);
    }

    function prev(Bytes32List storage self, bytes32 key) internal view returns (bytes32, bool isOk) {
        bytes32 prevElement = self._elements[key].prev;
        if (prevElement == NULL) {
            return (NULL, false);
        }

        return (prevElement, true);
    }
}
