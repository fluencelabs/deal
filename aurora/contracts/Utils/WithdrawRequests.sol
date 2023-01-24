pragma solidity ^0.8.17;

import "./LinkedList.sol";

library WithdrawRequests {
    using LinkedList for LinkedList.Bytes32List;

    struct Requests {
        Request[] requests;
        uint256 indexOffset;
    }

    struct Request {
        uint32 createTimestamp;
        uint224 cumulative;
    }

    function getAt(Requests storage self, uint256 index)
        internal
        view
        returns (uint256 timestamp, uint256 amount)
    {
        uint256 realLength = self.requests.length;
        uint256 realIndex = index + self.indexOffset;

        if (realIndex >= realLength) {
            revert("Index is out of range");
        }

        Request storage request = self.requests[realIndex];

        amount = request.cumulative;
        if (realIndex != 0) {
            Request storage previousRequest = self.requests[realIndex - 1];
            amount -= previousRequest.cumulative;
        }

        return (request.createTimestamp, amount);
    }

    function length(Requests storage self) internal view returns (uint256) {
        return self.requests.length - self.indexOffset;
    }

    function getAmountBy(Requests storage self, uint256 timestamp)
        internal
        view
        returns (uint256)
    {
        (, uint256 amount) = _getIndexAndAmountBy(self, timestamp);
        return amount;
    }

    function push(Requests storage self, uint256 amount) internal {
        uint32 timestamp = uint32(block.timestamp);

        require(amount > 0, "Amount can't be zero");
        require(amount <= UINT224_MAX, "Amount is too big");

        //TODO: check overflow
        uint224 uint224Amount = uint224(amount);
        uint256 realLength = self.requests.length;
        uint256 currentLength = realLength - self.indexOffset;

        if (currentLength != 0) {
            Request storage last = self.requests[realLength - 1];
            if (last.createTimestamp == timestamp) {
                last.cumulative += uint224Amount;
                return;
            } else {
                self.requests.push(
                    Request(timestamp, last.cumulative + uint224Amount)
                );
            }
        } else {
            self.requests.push(Request(timestamp, uint224Amount));
        }
    }

    function removeFromLast(Requests storage self, uint256 amount) internal {
        uint256 realLength = self.requests.length;
        uint256 currentLength = realLength - self.indexOffset;

        require(currentLength != 0, "Requests is empty");
        require(amount <= UINT224_MAX, "Amount is too big");

        //TODO: check overflow
        uint224 uint224Amount = uint224(amount);

        Request storage last = self.requests[currentLength - 1];
        uint256 currentAmount = last.cumulative;

        require(currentAmount >= uint224Amount, "Not enough amount");

        if (uint224Amount < currentAmount) {
            last.cumulative -= uint224Amount;
        } else {
            self.requests.pop();
        }
    }

    function confirmBy(Requests storage self, uint256 timestamp)
        internal
        returns (uint256)
    {
        (uint256 index, uint256 amount) = _getIndexAndAmountBy(self, timestamp);
        self.indexOffset = index + 1;
        return amount;
    }

    function _getIndexAndAmountBy(Requests storage self, uint256 timestamp)
        private
        view
        returns (uint256, uint256)
    {
        uint256 realLength = self.requests.length;
        uint256 indexOffset = self.indexOffset;

        uint256 currentLength = realLength - indexOffset;

        require(currentLength != 0, "Requests is empty");

        (uint256 index, Request storage request) = _getIndexBy(
            self,
            indexOffset,
            realLength - 1,
            timestamp
        );
        uint256 amount = request.cumulative;
        if (indexOffset != 0) {
            amount -= self.requests[indexOffset - 1].cumulative;
        }

        return (index, amount);
    }

    function _getIndexBy(
        Requests storage self,
        uint256 startLow,
        uint256 startHigh,
        uint256 timestamp
    ) private view returns (uint256, Request storage request) {
        uint256 low = startLow;
        uint256 high = startHigh;

        uint256 mid = (low + high) / 2;
        request = self.requests[mid];

        while (low != high) {
            uint256 midTimestamp = request.createTimestamp;
            if (midTimestamp == timestamp) {
                return (mid, request);
            } else if (midTimestamp < timestamp) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }

            mid = (low + high) / 2;
            request = self.requests[mid];
        }

        return (mid, request);
    }
}
