import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { DeveloperFaucet__factory } from "../../typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.getUnnamedAccounts();
  const deployer = accounts[0];

  const coreDeploy = await hre.deployments.get("Core");

  const faucetDeployFactory = await hre.deployments.get("OwnableFaucet");

  const faucetDeploy = new DeveloperFaucet__factory(
    await hre.ethers.getSigner(deployer)
  ).attach(faucetDeployFactory.address);

  const paymentTokenAddress = await faucetDeploy.usdToken();

  await hre.deployments.deploy("DealFactory", {
    from: deployer,
    args: [coreDeploy.address, paymentTokenAddress],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });
};

export default func;

module.exports.tags = ["testnet"];
module.exports.dependencies = ["Core", "OwnableFaucet"];
