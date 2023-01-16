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

      return {
        deal: deal,
        usdToken: usdToken,
      };
    }
  )();

describe("PaymentManager", () => {
  let userAccount: string = "";
  let deal: Deal;
  let usdToken: IERC20;

  before(async () => {
    const accounts = await getUnnamedAccounts();
    userAccount = accounts[0];
  });

  beforeEach(async () => {
    const config = await setupTest(userAccount);
    deal = config.deal;
    usdToken = config.usdToken;
  });

  it("deposit", async () => {
    const balanceBefore = await deal.getBalance(userAccount);
    const value = ethers.utils.parseEther("1");

    await (await usdToken.approve(deal.address, value)).wait();
    await (await deal.deposit(value)).wait();

    const balanceAfter = await deal.getBalance(userAccount);

    expect(balanceAfter).to.be.equal(balanceBefore.add(value));
  });

  it("withdraw", async () => {
    const value = ethers.utils.parseEther("1");

    await (await usdToken.approve(deal.address, value)).wait();
    await (await deal.deposit(value)).wait();

    const withdrawValue = value.div(2);

    const balanceBefore = await deal.getBalance(userAccount);
    await (await deal.withdraw(withdrawValue)).wait();
    const balanceAfter = await deal.getBalance(userAccount);

    expect(balanceAfter).to.be.equal(balanceBefore.sub(withdrawValue));
  });
});
