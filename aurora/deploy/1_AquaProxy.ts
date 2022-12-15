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

  const utilsLib = await hre.deployments.deploy("Utils", {
    from: deployer,
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });

  const borshLib = await hre.deployments.deploy("Borsh", {
    from: deployer,
    log: true,
    libraries: {
      Utils: utilsLib.address,
    },
    autoMine: true,
    waitConfirmations: 1,
  });

  const codecLib = await hre.deployments.deploy("Codec", {
    from: deployer,
    log: true,
    libraries: {
      Borsh: borshLib.address,
      Utils: utilsLib.address,
    },
    autoMine: true,
    waitConfirmations: 1,
  });

  const auroraSdkLib = await hre.deployments.deploy("AuroraSdk", {
    from: deployer,
    log: true,
    libraries: {
      Borsh: borshLib.address,
      Codec: codecLib.address,
      Utils: utilsLib.address,
    },
    autoMine: true,
    waitConfirmations: 1,
  });

  const transactionCount = await hre.ethers.provider.getTransactionCount(
    deployer
  );

  const expectedAquaProxyAddress = getContractAddress({
    from: deployer,
    nonce: transactionCount + 1,
  });

  const wNEAR = ERC20__factory.connect(
    WNEAR_ADDRESS,
    await hre.ethers.getSigner(deployer)
  );

  let tx = await wNEAR.approve(
    expectedAquaProxyAddress,
    BigNumber.from(2).mul(BigNumber.from(10).pow(24))
  );

  await tx.wait();

  await hre.deployments.deploy("AquaProxy", {
    from: deployer,
    args: [NEAR_AQUA_VM_ADDRESS],
    libraries: {
      AuroraSdk: auroraSdkLib.address,
      Borsh: borshLib.address,
      Codec: codecLib.address,
      Utils: utilsLib.address,
    },
    log: true,
    autoMine: true,
    waitConfirmations: 1,
  });
};

export default func;
