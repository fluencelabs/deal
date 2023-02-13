import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { DeveloperFaucet__factory } from "../../typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.getUnnamedAccounts();
  const deployer = accounts[0];

  const coreDeploy = await hre.deployments.get("Core");

  const developerFaucetDeploy = await hre.deployments.get("DeveloperFaucet");

  const developerFaucet = new DeveloperFaucet__factory(
    await hre.ethers.getSigner(deployer)
  ).attach(developerFaucetDeploy.address);

  const paymentTokenAddress = await developerFaucet.usdToken();

  await hre.deployments.deploy("DealFactory", {
    from: deployer,
    args: [coreDeploy.address, paymentTokenAddress],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });
};

export default func;

module.exports.tags = ["localnet"];
