pragma solidity ^0.8.17;

import "./Consts.sol";

library WithdrawRequests {
    struct Requests {
        Request[] _requests;
        uint256 _indexOffset;
    }

    struct Request {
        uint32 _createTimestamp;
        uint224 _cumulative;
    }

    function getAt(Requests storage self, uint256 index) internal view returns (uint256 timestamp, uint256 amount) {
        uint256 realLength = self._requests.length;
        uint256 realIndex = index + self._indexOffset;

        if (realIndex >= realLength) {
            revert("Index is out of range");
        }

        Request storage request = self._requests[realIndex];

        amount = request._cumulative;
        if (realIndex != 0) {
            Request storage previousRequest = self._requests[realIndex - 1];
            amount -= previousRequest._cumulative;
        }

        return (request._createTimestamp, amount);
    }

    function length(Requests storage self) internal view returns (uint256) {
        return self._requests.length - self._indexOffset;
    }

    function getAmountBy(Requests storage self, uint256 timestamp) internal view returns (uint256) {
        (, uint256 amount) = _getIndexAndAmountBy(self, timestamp);
        return amount;
    }

    function push(Requests storage self, uint256 amount) internal {
        uint32 timestamp = uint32(block.timestamp);

        require(amount > 0, "Amount can't be zero");
        require(amount <= type(uint224).max, "Amount is too big");

        //TODO: check overflow
        uint224 uint224Amount = uint224(amount);
        uint256 realLength = self._requests.length;
        uint256 currentLength = realLength - self._indexOffset;

        if (currentLength != 0) {
            Request storage last = self._requests[realLength - 1];
            if (last._createTimestamp == timestamp) {
                last._cumulative += uint224Amount;
                return;
            } else {
                self._requests.push(Request(timestamp, last._cumulative + uint224Amount));
            }
        } else {
            self._requests.push(Request(timestamp, uint224Amount));
        }
    }

    function removeFromLast(Requests storage self, uint256 amount) internal {
        uint256 realLength = self._requests.length;
        uint256 currentLength = realLength - self._indexOffset;

        require(currentLength != 0, "Requests is empty");
        require(amount <= type(uint224).max, "Amount is too big");

        //TODO: check overflow
        uint224 uint224Amount = uint224(amount);

        Request storage last = self._requests[currentLength - 1];
        uint256 currentAmount = last._cumulative;

        require(currentAmount >= uint224Amount, "Not enough amount");

        if (uint224Amount < currentAmount) {
            last._cumulative -= uint224Amount;
        } else {
            self._requests.pop();
        }
    }

    function confirmBy(Requests storage self, uint256 timestamp) internal returns (uint256) {
        (uint256 index, uint256 amount) = _getIndexAndAmountBy(self, timestamp);
        self._indexOffset = index + 1;
        return amount;
    }

    function _getIndexAndAmountBy(Requests storage self, uint256 timestamp) private view returns (uint256, uint256) {
        uint256 realLength = self._requests.length;
        uint256 indexOffset = self._indexOffset;

        uint256 currentLength = realLength - indexOffset;

        require(currentLength != 0, "Requests is empty");

        (uint256 index, Request storage request) = _getIndexBy(self, indexOffset, realLength - 1, timestamp);
        uint256 amount = request._cumulative;
        if (indexOffset != 0) {
            amount -= self._requests[indexOffset - 1]._cumulative;
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
        request = self._requests[mid];

        while (low != high) {
            uint256 midTimestamp = request._createTimestamp;
            if (midTimestamp == timestamp) {
                return (mid, request);
            } else if (midTimestamp < timestamp) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }

            mid = (low + high) / 2;
            request = self._requests[mid];
        }

        return (mid, request);
    }
}
