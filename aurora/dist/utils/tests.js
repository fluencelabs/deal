"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTimeNextTime = exports.setupTestEnv = void 0;
const hardhat_1 = require("hardhat");
const setupTestEnv = async (account, pricePerEpoch, requiredStake, minWorkers, maxWorkers, targetWorkers) => hardhat_1.deployments.createFixture(async ({ deployments, ethers }) => {
    console.log("pricePerEpoch", pricePerEpoch);
    console.log("requiredStake", requiredStake);
    console.log("maxWorkers", maxWorkers);
    await deployments.fixture();
    const faucet = (await ethers.getContractAt("DeveloperFaucet", (await deployments.get("DeveloperFaucet")).address));
    faucet.receiveUSD(account, ethers.utils.parseEther("1000000"));
    faucet.receiveFLT(account, ethers.utils.parseEther("1000000"));
    const factory = (await ethers.getContractAt("DealFactory", (await deployments.get("DealFactory")).address));
    const tx = await factory.createDeal(minWorkers, targetWorkers, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("testApp")));
    const eventTopic = factory.interface.getEventTopic("DealCreated");
    const log = (await tx.wait()).logs.find(({ topics }) => topics[0] === eventTopic);
    const dealAddress = factory.interface.parseLog(log).args["deal"];
    const deal = (await ethers.getContractAt("Deal", dealAddress));
    const usdToken = (await ethers.getContractAt("IERC20", await faucet.usdToken()));
    const fltToken = (await ethers.getContractAt("IERC20", await faucet.fluenceToken()));
    const core = (await ethers.getContractAt("Core", (await deployments.get("Core")).address));
    return {
        deal: deal,
        usdToken: usdToken,
        fltToken: fltToken,
        core: core,
    };
})();
exports.setupTestEnv = setupTestEnv;
const setTimeNextTime = async (time) => {
    await hardhat_1.ethers.provider.send("evm_setNextBlockTimestamp", [time]);
    await hardhat_1.ethers.provider.send("evm_mine", []);
};
exports.setTimeNextTime = setTimeNextTime;
