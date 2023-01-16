import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.getUnnamedAccounts();
  const deployer = accounts[0];

  await hre.deployments.deploy("DeveloperFaucet", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });
};

export default func;
