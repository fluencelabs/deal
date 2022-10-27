import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { DeveloperFaucet__factory } from "../typechain-types";

const NEAR_AQUA_VM_ADDRESS = "123";
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.getUnnamedAccounts();
  const deployer = accounts[0];
  const daoAddress = accounts[0];

  const developerFaucetDeploy = await hre.deployments.deploy(
    "DeveloperFaucet",
    {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
      waitConfirmations: 1,
    }
  );

  const developerFaucet = new DeveloperFaucet__factory(
    await hre.ethers.getSigner(deployer)
  ).attach(developerFaucetDeploy.address);

  const fluenceToken = await developerFaucet.fluenceToken();
  const usdTokenAddress = await developerFaucet.usdToken();

  const aquaProxyDeploy = await hre.deployments.deploy("AquaProxy", {
    from: deployer,
    args: [NEAR_AQUA_VM_ADDRESS],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });

  await hre.deployments.deploy("DealFactory", {
    from: deployer,
    args: [daoAddress, aquaProxyDeploy.address, fluenceToken],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });
};

export default func;
func.tags = ["FluenceToken"];
