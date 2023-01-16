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

describe("RoleManager", () => {
  let userAccount: string = "";
  let deal: Deal;

  before(async () => {
    const accounts = await getUnnamedAccounts();
    userAccount = accounts[0];
  });

  beforeEach(async () => {
    const config = await setupTest(userAccount);
    deal = config.deal;
  });

  it("register", async () => {
    await (await deal.register()).wait();
    expect(await deal.getRole(userAccount)).to.be.equal(1);
  });
});
