// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import "forge-std/Script.sol";
import "forge-std/Vm.sol";

import "./DeploymentJson.sol";

contract Deployment is ScriptBase {
    using DeploymentJson for DeploymentJson.DeploymentInfo;

    using Strings for string;
    using stdJson for string;

    // ------------------ Variables ------------------
    DeploymentJson.DeploymentInfo deployment;

    // ------------------ Internal functions ------------------
    function _loadDeployment(string memory env) internal {
        deployment.load(vm, env);
    }

    function _saveDeployment(string memory env) internal {
        deployment.save(vm, env);
    }

    function _deployContract(string memory contractName, string memory artifactName, bytes memory args)
        internal
        returns (address)
    {
        (address addr,) = _tryDeployContract(contractName, artifactName, args);

        return addr;
    }

    function _deployContract(string memory contractName, string memory artifactName, bytes memory args, bool force)
        internal
        returns (address)
    {
        (address addr,) = _tryDeployContract(contractName, artifactName, args, force);

        return addr;
    }

    function _tryDeployContract(string memory contractName, string memory artifactName, bytes memory args)
        internal
        returns (address, bool)
    {
        return _tryDeployContract(contractName, artifactName, args, false);
    }

    function _tryDeployContract(string memory contractName, string memory artifactName, bytes memory args, bool force)
        internal
        returns (address, bool)
    {
        if (force) {
            delete deployment.contracts[contractName];
        }

       DeploymentJson.DeployedContract memory deployedContract = deployment.contracts[contractName];

        string memory artifact = string.concat(artifactName, ".sol");
        bytes memory creationCode = abi.encodePacked(vm.getCode(artifact), args);
        bytes memory code = vm.getDeployedCode(artifact);

        bytes32 codeHash = keccak256(code);
        bytes32 creationCodeHash = keccak256(creationCode);

        bool isNew = deployedContract.addr == address(0) || deployedContract.codeHash != codeHash
            || deployedContract.creationCodeHash != creationCodeHash || _extcodehash(deployedContract.addr) == bytes32(0x00);

        if (!isNew) {
            address deployedAddr = deployedContract.addr;
            console.log("Reusing %s at %s", contractName, deployedAddr);
            return (deployedAddr, isNew);
        }

        address addr;

        assembly ("memory-safe") {
            addr := create(0, add(creationCode, 0x20), mload(creationCode))
        }

        require(addr != address(0), "Failed to deploy contract");

        console.log("Deploy %s at %s", contractName, addr);

        deployedContract = DeploymentJson.DeployedContract({
            addr: addr,
            codeHash: codeHash,
            blockNumber: block.number,
            creationCodeHash: creationCodeHash
        });
        deployment.contracts[contractName] = deployedContract;

        if (isNew) {
            deployment.contractNames.push(contractName);
        }

        return (addr, isNew);
    }

    function _doNeedToRedeploy(string memory contractName, string memory artifactName) internal view returns (bool) {
        DeploymentJson.DeployedContract memory deployedContract = deployment.contracts[contractName];

        string memory artifact = string.concat(artifactName, ".sol");
        bytes memory code = vm.getDeployedCode(artifact);
        bytes32 codeHash = keccak256(code);

        bool isNew = deployedContract.addr == address(0) || _extcodehash(deployedContract.addr) == bytes32(0x00)
            || deployedContract.codeHash != codeHash;

        return isNew;
    }

    function _printDeployments() internal view {
        console.log("\n");
        console.log("----------------- Deployments -----------------");
        for (uint256 i = 0; i < deployment.contractNames.length; i++) {
            string memory name = deployment.contractNames[i];
            DeploymentJson.DeployedContract memory deployedContract = deployment.contracts[name];

            console.log(StdStyle.green(name), deployedContract.addr);
        }
    }

    function _setContract(string memory contractName, address addr, bytes32 codeHash, bytes32 creationCodeHash)
        internal
    {
        if (deployment.contracts[contractName].addr == address(0)) {
            deployment.contractNames.push(contractName);
        }

        deployment.contracts[contractName] = DeploymentJson.DeployedContract({
            addr: addr,
            codeHash: codeHash,
            blockNumber: block.number,
            creationCodeHash: creationCodeHash
        });
    }

    // ------------------ Private functions ------------------
    function _extcodehash(address addr) private view returns (bytes32 hash) {
        assembly {
            hash := extcodehash(addr)
        }
    }
}
