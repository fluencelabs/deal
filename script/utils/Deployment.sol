/*
 * Fluence Compute Marketplace
 *
 * Copyright (C) 2024 Fluence DAO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
pragma solidity ^0.8.19;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ScriptBase, stdJson, StdStyle, console} from "forge-std/Script.sol";

contract Deployment is ScriptBase {
    using Strings for string;
    using stdJson for string;

    // ------------------ Types ------------------

    struct DeployedContract {
        address addr;
        bytes32 codeHash;
        uint256 blockNumber;
        bytes32 creationCodeHash;
    }

    struct DeploymentInfo {
        string[] contractNames;
        mapping(string => DeployedContract) contracts;
    }

    // ------------------ Variables ------------------
    DeploymentInfo deployment;

    // ------------------ Internal functions ------------------
    function _loadDeployment(string memory path) internal {
        if (!vm.exists(path)) {
            return;
        }

        string memory file = vm.readFile(path);
        string[] memory keys = vm.parseJsonKeys(file, "");

        deployment.contractNames = keys;
        for (uint256 i = 0; i < keys.length; i++) {
            string memory key = keys[i];

            DeployedContract memory deployedContract;

            deployedContract.addr = abi.decode(vm.parseJson(file, string.concat(".", key, ".addr")), (address));
            deployedContract.codeHash = abi.decode(vm.parseJson(file, string.concat(".", key, ".codeHash")), (bytes32));
            deployedContract.blockNumber =
                abi.decode(vm.parseJson(file, string.concat(".", key, ".blockNumber")), (uint256));
            deployedContract.creationCodeHash =
                abi.decode(vm.parseJson(file, string.concat(".", key, ".creationCodeHash")), (bytes32));

            deployment.contracts[key] = deployedContract;
        }
    }

    function _saveDeployment(string memory path) internal {
        string memory mainJsonKey = "";
        string memory json = "";
        for (uint256 i = 0; i < deployment.contractNames.length; i++) {
            string memory name = deployment.contractNames[i];

            DeployedContract memory deployedContract = deployment.contracts[name];
            name.serialize("addr", deployedContract.addr);
            name.serialize("codeHash", deployedContract.codeHash);
            name.serialize("blockNumber", deployedContract.blockNumber);
            string memory deployedContractObject = name.serialize("creationCodeHash", deployedContract.creationCodeHash);

            json = mainJsonKey.serialize(name, deployedContractObject);
        }

        if (json.equal("")) {
            return;
        }

        json.write(path);

        // TODO: rm hack below on solving https://github.com/foundry-rs/forge-std/issues/488.
        string memory a = "";
        json = a.serialize(a, a.serialize("creationCodeHash", a));
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

        DeployedContract memory deployedContract = deployment.contracts[contractName];

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

        deployedContract = DeployedContract({
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
        DeployedContract memory deployedContract = deployment.contracts[contractName];

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
            DeployedContract memory deployedContract = deployment.contracts[name];

            console.log(StdStyle.green(name), deployedContract.addr);
        }
    }

    function _setContract(string memory contractName, address addr, bytes32 codeHash, bytes32 creationCodeHash)
        internal
    {
        if (deployment.contracts[contractName].addr == address(0)) {
            deployment.contractNames.push(contractName);
        }

        deployment.contracts[contractName] = DeployedContract({
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
