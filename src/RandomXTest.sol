// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/utils/RandomXProxy.sol";
import "src/utils/BytesConverter.sol";


contract RandomXTest {
  using BytesConverter for bytes;

  RandomXProxy randomXProxy;

  constructor () {
    randomXProxy = new RandomXProxy();
  }

  function getProxy() external view returns (address) {
    return address(randomXProxy);
  }

  function submitProof(
    bytes32 globalNonce,
    bytes32 unitId,
    bytes32 localUnitNonce,
    bytes32 targetHash
  ) external {
    bytes32 globalUnitNonce_ = keccak256(abi.encodePacked(globalNonce, unitId));
    (bool success, bytes memory randomXTargetHash) = address(randomXProxy).delegatecall(
      abi.encodeWithSelector(RandomXProxy.run.selector, globalUnitNonce_, localUnitNonce)
    );
    require(randomXTargetHash.toBytes32() == targetHash, "Wrong hash");
    require(success, "No success");
  }
}
