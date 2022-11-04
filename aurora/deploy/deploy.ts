import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import {
  AquaProxy__factory,
  DeveloperFaucet__factory,
  ERC20__factory,
} from "../typechain-types";
import { BigNumber, ethers } from "ethers";
import { getContractAddress } from "ethers/lib/utils";

const NEAR_AQUA_VM_ADDRESS = "dev-1666986633374-40574705536935";
const WNEAR_ADDRESS = "0x4861825E75ab14553E5aF711EbbE6873d369d146";

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

  const wNEAR = ERC20__factory.connect(
    WNEAR_ADDRESS,
    await hre.ethers.getSigner(deployer)
  );

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

  let tx = await wNEAR.approve(
    expectedAquaProxyAddress,
    BigNumber.from(2).mul(BigNumber.from(10).pow(24))
  );

  await tx.wait();

  const aquaProxyDeploy = await hre.deployments.deploy("AquaProxy", {
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

  if (aquaProxyDeploy.address != expectedAquaProxyAddress) {
    throw new Error("AquaProxy address mismatch");
  }

  const aquaProxy = AquaProxy__factory.connect(
    aquaProxyDeploy.address,
    await hre.ethers.getSigner(deployer)
  );

  await tx.wait();

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
