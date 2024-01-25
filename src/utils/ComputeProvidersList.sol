// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

library ComputeProvidersList {
    // ------------------ TYPES ------------------
    struct List {
        bytes32 firstPtr;
        bytes32 lastPtr;
        uint256 length;
    }

    struct ComputePeersList {
        bytes32 firstPtr;
        bytes32 lastPtr;
        uint256 length;
    }

    struct ComputeProvider {
        address value;
        bytes32 nextPtr;
        bytes32 computePeersListPtr;
    }

    struct ComputePeer {
        bytes32 value;
        bytes32 nextPtr;
    }

    struct CPsAndPeersBytes32Array {
        address[] computeProviders;
        bytes32[][] computePeers;
    }

    // ------------------ PRIVATE ------------------
    function _push(bytes32 listPointer, bytes32 elementPtr) private pure {
        assembly ("memory-safe") {
            let firstPtrPtr := listPointer
            let propLastPtrPtr := add(firstPtrPtr, 32) // list.firstPtr
            let propLengthPtr := add(propLastPtrPtr, 32) // ptr -> list.length

            let firstPtr := mload(listPointer) // list.firstPtr
            let lastPtr := mload(propLastPtrPtr) // list.lastPtr
            let length := mload(propLengthPtr) // list.length

            mstore(propLastPtrPtr, elementPtr) // list.lastPtr = elementPtr
            mstore(propLengthPtr, add(length, 1)) // list.length++

            switch eq(firstPtr, 0)
            case true { mstore(firstPtrPtr, elementPtr) }
                // list.firstPtr = elementPtr
            case false {
                let propNextPtrPtr := add(lastPtr, 32) // ptr -> element.nextPtr
                mstore(propNextPtrPtr, elementPtr) // element.nextPtr = elementPtr
            }
        }
    }

    // ------------------ VIEWS ------------------
    function toBytes32Array(List memory self)
        internal
        pure
        returns (CPsAndPeersBytes32Array memory cpAndPeersBytes32Array)
    {
        uint256 length = self.length;

        cpAndPeersBytes32Array.computeProviders = new address[](length);
        cpAndPeersBytes32Array.computePeers = new bytes32[][](length);

        bytes32 ptr = self.firstPtr;
        for (uint256 i = 0; i < length; i++) {
            address value;
            bytes32 computePeersListPtr;
            assembly ("memory-safe") {
                value := mload(ptr) // value
                computePeersListPtr := mload(add(ptr, 64)) // computePeersListPtr
                ptr := mload(add(ptr, 32)) // nextPtr
            }

            cpAndPeersBytes32Array.computeProviders[i] = value;

            bytes32 peersPtr;
            uint256 peersLength;
            assembly ("memory-safe") {
                peersPtr := mload(computePeersListPtr) // firstPtr
                peersLength := mload(add(computePeersListPtr, 64)) // length
            }

            cpAndPeersBytes32Array.computePeers[i] = new bytes32[](peersLength);
            for (uint256 j = 0; j < peersLength; j++) {
                bytes32 peerId;
                assembly ("memory-safe") {
                    peerId := mload(peersPtr) // value
                    peersPtr := mload(add(peersPtr, 32)) // nextPtr
                }
                cpAndPeersBytes32Array.computePeers[i][j] = peerId;
            }
        }
    }

    // -------------- MEMORY MUTABLES ----------------
    function add(List memory self, address value) internal pure returns (ComputePeersList memory computePeersList) {
        ComputeProvider memory cp;

        bytes32 cpPtr;
        bytes32 cpListPtr;
        bytes32 computePeersListPtr;

        assembly ("memory-safe") {
            cpPtr := cp
            cpListPtr := self
            computePeersListPtr := computePeersList
        }

        cp.value = value;
        cp.computePeersListPtr = computePeersListPtr;

        _push(cpListPtr, cpPtr);
    }

    function add(ComputePeersList memory self, bytes32 value) internal pure {
        ComputePeer memory peer = ComputePeer({value: value, nextPtr: bytes32(0)});

        bytes32 peerPtr;
        bytes32 listPt;

        assembly ("memory-safe") {
            peerPtr := peer
            listPt := self
        }

        _push(listPt, peerPtr);
    }
}
