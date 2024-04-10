// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../script/utils/Deployment.sol";
// import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "src/core/modules/capacity/Capacity.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "src/utils/OwnableUpgradableDiamond.sol";


contract UpgradeFork is Script, Deployment {
    string constant DEPLOYMENTS_PATH = "/deployments/";
    string private fullDeploymentsPath;

    function setUp() external {
        // string memory envName = vm.envString("CONTRACTS_ENV_NAME");
        string memory fileNames = string.concat("kras", ".json");
        fullDeploymentsPath = string.concat(vm.projectRoot(), DEPLOYMENTS_PATH, fileNames);
    }

    function run () external {
        // you do:
        // vm.createSelectFork("https://ipc.kras.fluence.dev");
        // or run `anvil --fork-url https://ipc.kras.fluence.dev`
        // to run: `FOUNDRY_PROFILE=test forge script UpgradeFork --via-ir --rpc-url http://127.0.0.1:8545`
        _loadDeployment(fullDeploymentsPath);
        DeployedContract storage capacityData = deployment.contracts["Capacity"];
        address payable capacity = payable(capacityData.addr);
        Capacity impl = new Capacity(ICore(deployment.contracts["Capacity"].addr));
        address coreOwner = OwnableUpgradableDiamond(address(Capacity(capacity).core())).owner();

        
        vm.prank(coreOwner);
        UUPSUpgradeable(capacity).upgradeTo(address(impl));
    }
}
