import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { getContractAddress } from "ethers/lib/utils";
import { ERC20__factory } from "../typechain-types";
import { NEAR_AQUA_VM_ADDRESS, WNEAR_ADDRESS } from "../utils/consts";
import { BigNumber } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.getUnnamedAccounts();
  const deployer = accounts[0];

  await hre.deployments.deploy("EpochManager", {
    from: deployer,
    args: [120],
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });
};

export default func;
