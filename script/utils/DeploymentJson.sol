// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import "forge-std/Script.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";

library DeploymentJson {
    using Strings for string;
    using stdJson for string;

    enum Environment {
        Local,
        Dar,
        Stage,
        Kras
    }

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

    function load(DeploymentInfo storage deployment, Vm vm, string memory env) internal {
        string memory path = _getPath(vm, env);

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

    function save(DeploymentInfo storage deployment, Vm vm, string memory env) internal {
        string memory path = _getPath(vm, env);

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

    function _getPath(Vm vm, string memory env) private view returns (string memory) {
        return _getPath(vm, _stringToEnv(env));
    }

    function _getPath(Vm vm, Environment env) private view returns (string memory) {
        string memory path = "";

        if (env == Environment.Local) {
            path = "/deployments/local.json";
        } else if (env == Environment.Dar) {
            path = "/deployments/dar.json";
        } else if (env == Environment.Stage) {
            path = "/deployments/stage.json";
        } else if (env == Environment.Kras) {
            path = "/deployments/kras.json";
        }

        console.log("Deployment path: ", string.concat(vm.projectRoot(), path));

        return string.concat(vm.projectRoot(), path);
    }

    function _stringToEnv(string memory env) private pure returns (Environment) {
        if (env.equal("local")) {
            return Environment.Local;
        } else if (env.equal("dar")) {
            return Environment.Dar;
        } else if (env.equal("stage")) {
            return Environment.Stage;
        } else if (env.equal("kras")) {
            return Environment.Kras;
        }

        revert("Invalid deployment environment");
    }
}
