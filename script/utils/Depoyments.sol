// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "forge-std/Script.sol";
import "forge-std/Vm.sol";
import "src/deal/Deal.sol";
import "src/core/Core.sol";
import "src/dev/OwnableFaucet.sol";
import "src/dev/TestERC20.sol";

contract Depoyments is ScriptBase {
    using Strings for string;
    using stdJson for string;

    // ------------------ Types ------------------

    struct DeployedContract {
        address addr;
        bytes32 codeHash;
        bytes32 creationCodeHash;
    }

    struct Deployments {
        string[] contractNames;
        mapping(string => DeployedContract) contracts;
    }

    // ------------------ Variables ------------------
    Deployments deployments;

    // ------------------ Internal functions ------------------
    function _loadDepoyments(string memory path) internal {
        if (!vm.exists(path)) {
            return;
        }

        string memory file = vm.readFile(path);
        string[] memory keys = vm.parseJsonKeys(file, "");

        deployments.contractNames = keys;
        for (uint256 i = 0; i < keys.length; i++) {
            string memory key = keys[i];

            DeployedContract memory deployedContract;

            deployedContract.addr = abi.decode(vm.parseJson(file, string.concat(".", key, ".addr")), (address));
            deployedContract.codeHash = abi.decode(vm.parseJson(file, string.concat(".", key, ".codeHash")), (bytes32));
            deployedContract.creationCodeHash =
                abi.decode(vm.parseJson(file, string.concat(".", key, ".creationCodeHash")), (bytes32));

            deployments.contracts[key] = deployedContract;
        }
    }

    function _saveDeployments(string memory path) internal {
        string memory mainJsonKey = "";
        string memory json = "";
        for (uint256 i = 0; i < deployments.contractNames.length; i++) {
            string memory name = deployments.contractNames[i];

            DeployedContract memory deployedContract = deployments.contracts[name];
            name.serialize("addr", deployedContract.addr);
            name.serialize("codeHash", deployedContract.codeHash);
            string memory deployedContractObject = name.serialize("creationCodeHash", deployedContract.creationCodeHash);

            json = mainJsonKey.serialize(name, deployedContractObject);
        }

        if (json.equal("")) {
            return;
        }

        json.write(path);
    }

    function _deployContract(string memory contractName, string memory artifactName, bytes memory args)
        internal
        returns (address)
    {
        (address addr,) = _tryDeployContract(contractName, artifactName, args);

        return addr;
    }

    function _forceDeployContract(string memory contractName, string memory artifactName, bytes memory args)
        internal
        returns (address)
    {
        delete deployments.contracts[contractName];
        (address addr,) = _tryDeployContract(contractName, artifactName, args);

        return addr;
    }

    function _tryDeployContract(string memory contractName, string memory artifactName, bytes memory args)
        internal
        returns (address, bool)
    {
        DeployedContract memory deployedContract = deployments.contracts[contractName];

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

        deployedContract = DeployedContract({addr: addr, codeHash: codeHash, creationCodeHash: creationCodeHash});
        deployments.contracts[contractName] = deployedContract;

        if (isNew) {
            deployments.contractNames.push(contractName);
        }

        return (addr, isNew);
    }

    function _printDeployments() internal view {
        console.log("\n");
        console.log("----------------- Deployments -----------------");
        for (uint256 i = 0; i < deployments.contractNames.length; i++) {
            string memory name = deployments.contractNames[i];
            DeployedContract memory deployedContract = deployments.contracts[name];

            console.log(StdStyle.green(name), deployedContract.addr);
        }
    }

    // ------------------ Privat functions ------------------
    function _extcodehash(address addr) private view returns (bytes32 hash) {
        assembly {
            hash := extcodehash(addr)
        }
    }
}
