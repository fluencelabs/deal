import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.getUnnamedAccounts();
  const deployer = accounts[0];

  const coreDeploy = await hre.deployments.get("Core");

  await hre.deployments.deploy("DealFactory", {
    from: deployer,
    args: [coreDeploy.address],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });
};

export default func;
