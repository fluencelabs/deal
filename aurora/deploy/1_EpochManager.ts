import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

const EPOCH_DURATION = 5 * 60;
module.exports = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.getUnnamedAccounts();
  const deployer = accounts[0];

  await hre.deployments.deploy("EpochManager", {
    from: deployer,
    args: [EPOCH_DURATION],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });
};

module.exports.dependencies = ["Faucet"];
module.exports.tags = ["common"];
