pragma solidity ^0.8.17;

import "./LinkedList.sol";

library WithdrawRequests {
    using LinkedList for LinkedList.Bytes32List;

    struct Info {
        uint _totalAmount;
        LinkedList.Bytes32List list;
        mapping(uint256 => uint256) requests;
    }

    struct Request {
        uint timestamp;
        uint amount;
    }

    function totalAmount(Info storage self) internal view returns (uint) {
        return self._totalAmount;
    }

    function first(
        Info storage self
    ) internal view returns (Request memory request, bool isOk) {
        bytes32 firstKey = self.list.first();
        if (firstKey == NULL) return (request, false);

        request.timestamp = uint256(firstKey);
        request.amount = self.requests[request.timestamp];
    }

    function last(
        Info storage self
    ) internal view returns (Request memory request, bool isOk) {
        bytes32 lastKey = self.list.last();
        if (lastKey == NULL) return (request, false);

        request.timestamp = uint256(lastKey);
        request.amount = self.requests[request.timestamp];
    }

    function createOrAddAmount(Info storage self, uint256 amount) internal {
        uint timestamp = block.timestamp;

        if (self.requests[timestamp] == 0) {
            self.list.push(bytes32(timestamp));
        }

        self.requests[timestamp] += amount;
        self._totalAmount += amount;
    }

    function remove(Info storage self, uint256 timestamp) internal {
        self.list.remove(bytes32(timestamp));

        self._totalAmount -= self.requests[timestamp];
        delete self.requests[timestamp];
    }

    function get(
        Info storage self,
        uint timestamp
    ) internal view returns (Request memory request, bool isOk) {
        isOk = self.list.exist(bytes32(timestamp));
        if (!isOk) {
            return (request, false);
        }

        request.timestamp = timestamp;
        request.amount = self.requests[timestamp];
    }

    function next(
        Info storage self,
        uint timestamp
    ) internal view returns (Request memory request, bool isOk) {
        (bytes32 nextKey, bool isExist) = self.list.next(bytes32(timestamp));
        if (!isExist) {
            return (request, false);
        }
        isOk = true;

        request.timestamp = uint256(nextKey);
        request.amount = self.requests[uint256(nextKey)];
    }
}
