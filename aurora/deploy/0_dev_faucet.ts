import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.getUnnamedAccounts();
  const deployer = accounts[0];

  console.log("Deploying account:", deployer);
  console.log("Block number:", await hre.ethers.provider.getBlockNumber());

  await hre.deployments.deploy("Faucet", {
    from: deployer,
    contract: "DeveloperFaucet",
    args: [],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });

  for (const account of accounts) {
    await hre.deployments.execute(
      "Faucet",
      { from: deployer, log: true, waitConfirmations: 1 },
      "receiveUSD",
      account,
      hre.ethers.utils.parseEther("100")
    );

    await hre.deployments.execute(
      "Faucet",
      { from: deployer, log: true, waitConfirmations: 1 },
      "receiveFLT",
      account,
      hre.ethers.utils.parseEther("100")
    );
  }
};

module.exports.tags = ["localnet"];
