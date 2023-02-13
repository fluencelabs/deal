import { BigNumber } from "ethers";
import { deployments, ethers } from "hardhat";
import {
  Core,
  Deal,
  DealFactory,
  DeveloperFaucet,
  IERC20,
} from "../typechain-types";

const setupTestEnv = async (
  account: string,
  pricePerEpoch: BigNumber,
  requiredStake: BigNumber,
  minWorkers: BigNumber,
  maxWorkers: BigNumber,
  targetWorkers: BigNumber
) =>
  deployments.createFixture(async ({ deployments, ethers }) => {
    await deployments.fixture();

    const faucet = (await ethers.getContractAt(
      "DeveloperFaucet",
      (
        await deployments.get("DeveloperFaucet")
      ).address
    )) as DeveloperFaucet;

    faucet.receiveUSD(account, ethers.utils.parseEther("1000000"));
    faucet.receiveFLT(account, ethers.utils.parseEther("1000000"));

    const factory = (await ethers.getContractAt(
      "DealFactory",
      (
        await deployments.get("DealFactory")
      ).address
    )) as DealFactory;

    const tx = await factory.createDeal(
      minWorkers,
      targetWorkers,
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("testApp"))
    );

    const eventTopic = factory.interface.getEventTopic("DealCreated");
    const log = (await tx.wait()).logs.find(
      ({ topics }: any) => topics[0] === eventTopic
    );

    const dealAddress: string = factory.interface.parseLog(log!).args["deal"];

    const deal: Deal = (await ethers.getContractAt(
      "Deal",
      dealAddress
    )) as Deal;

    const usdToken = (await ethers.getContractAt(
      "IERC20",
      await faucet.usdToken()
    )) as IERC20;

    const fltToken = (await ethers.getContractAt(
      "IERC20",
      await faucet.fluenceToken()
    )) as IERC20;

    const core = (await ethers.getContractAt(
      "Core",
      (
        await deployments.get("Core")
      ).address
    )) as Core;

    return {
      deal: deal,
      usdToken: usdToken,
      fltToken: fltToken,
      core: core,
    };
  })();

const setTimeNextTime = async (time: number) => {
  await ethers.provider.send("evm_setNextBlockTimestamp", [time]);
  await ethers.provider.send("evm_mine", []);
};

export { setupTestEnv, setTimeNextTime };
