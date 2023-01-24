import { expect } from "chai";
import { deployments, ethers, getUnnamedAccounts } from "hardhat";
import {
  Core,
  Deal,
  DealFactory,
  DeveloperFaucet,
  IERC20,
} from "../../typechain-types";
import { core } from "../../typechain-types/contracts";

const pricePerEpoch = ethers.utils.parseEther("1");
const requiredStake = ethers.utils.parseEther("1");

const setupTest = async (account: string) =>
  deployments.createFixture(
    async ({ deployments, getNamedAccounts, ethers }, options) => {
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
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("123123")),
        {
          paymentToken: faucet.usdToken(),
          pricePerEpoch: pricePerEpoch,
          requiredStake: requiredStake,
        }
      );

      const eventTopic = factory.interface.getEventTopic("CreateDeal");
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
    }
  )();

describe("DealConfig", () => {
  let userAccount: string = "";
  let deal: Deal;
  let usdToken: IERC20;
  let fltToken: IERC20;
  let core: Core;

  const setTimeNextTime = async (time: number) => {
    await ethers.provider.send("evm_setNextBlockTimestamp", [time]);
    await ethers.provider.send("evm_mine", []);
  };

  before(async () => {
    const accounts = await getUnnamedAccounts();
    userAccount = accounts[0];
  });

  beforeEach(async () => {
    const config = await setupTest(userAccount);
    deal = config.deal;
    usdToken = config.usdToken;
    fltToken = config.fltToken;
    core = config.core;
  });

  it("updateSettings", async () => {
    const settings = {
      paymentToken: "0x0000000000000000000000000000000000000000",
      pricePerEpoch: ethers.utils.parseEther("12"),
      requiredStake: ethers.utils.parseEther("13"),
    };
    const res = await (await deal.setNewSettings(settings, 7)).wait();

    const block = await ethers.provider.getBlock(res.blockHash);
    const nextTimestamp =
      block.timestamp + (await core.updateSettingsTimeout()).toNumber() + 1;

    await setTimeNextTime(nextTimestamp);

    await (await deal.updateSettings()).wait();

    const newSettings = await deal.settings();

    expect(newSettings.paymentToken).to.be.equal(settings.paymentToken);
    expect(newSettings.pricePerEpoch).to.be.equal(settings.pricePerEpoch);
    expect(newSettings.requiredStake).to.be.equal(settings.requiredStake);
  });
});
