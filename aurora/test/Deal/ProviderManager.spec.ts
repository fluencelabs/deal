import { expect } from "chai";
import { deployments, ethers, getUnnamedAccounts } from "hardhat";
import {
  Deal,
  DealFactory,
  DeveloperFaucet,
  IERC20,
} from "../../typechain-types";

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

const setTimeNextTime = async (time: number) => {
  await ethers.provider.send("evm_setNextBlockTimestamp", [time]);
  await ethers.provider.send("evm_mine", []);
};

describe("ProviderManager", () => {
  let userAccount: string = "";
  let deal: Deal;
  let core: Core;
  let usdToken: IERC20;
  let fltToken: IERC20;

  let patId: string = "";

  before(async () => {
    const accounts = await getUnnamedAccounts();
    userAccount = accounts[0];

    const config = await setupTest(userAccount);
    deal = config.deal;
    usdToken = config.usdToken;
    fltToken = config.fltToken;
    core = config.core;
  });

  it("createProviderToken", async () => {
    await (await deal.register()).wait();

    await (await fltToken.approve(deal.address, requiredStake)).wait();
    const tx = await deal.createProviderToken(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("salt"))
    );

    const eventTopic = deal.interface.getEventTopic("AddProviderToken");
    const log = (await tx.wait()).logs.find(
      ({ topics }: any) => topics[0] === eventTopic
    );

    const args = deal.interface.parseLog(log!).args;

    const owner: string = args["owner"];
    patId = args["id"];

    expect(patId).not.to.be.undefined;

    expect(owner).to.be.equal(await deal.getPATOwner(patId));
    expect(owner).to.be.equal(userAccount);
  });

  it("removeProviderToken", async () => {
    const removeTokenTx = await deal.removeProviderToken(patId);

    const removeEventTopic = deal.interface.getEventTopic(
      "RemoveProviderToken"
    );
    const logRemoveTopic = (await removeTokenTx.wait()).logs.find(
      ({ topics }: any) => topics[0] === removeEventTopic
    );

    expect(deal.interface.parseLog(logRemoveTopic!).args["id"]).to.be.equal(
      patId
    );
  });

  it("withdraw", async () => {
    const balanceBefore = await fltToken.balanceOf(userAccount);

    const timeout = await core.withdrawTimeout();
    const block = await ethers.provider.getBlock("latest");
    const settings = await deal.settings();

    setTimeNextTime(block.timestamp + timeout);

    const withdrawTx = await deal.withdraw(fltToken.address, 0);
    await withdrawTx.wait();

    const balanceAfter = await fltToken.balanceOf(userAccount);

    expect(balanceAfter).to.be.eq(balanceBefore.add(settings.requiredStake));
  });
});
