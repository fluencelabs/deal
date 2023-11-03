import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { DEFAULT_HARDHAT_DEPLOY_SETTINGS, EPOCH_DURATION, MIN_DEPOSITED_EPOCHES, MIN_REMATCHING_EPOCHES } from "../../env";
import { Core__factory } from "../../src/typechain-types";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    const fluenceToken = (await hre.deployments.get("FLT")).address;

    const dealImpl = await hre.deployments.deploy("DealImpl", {
        from: deployer,
        contract: "Deal",
        args: [],
        ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
    });

    const coreImpl = await hre.deployments.deploy("CoreImpl", {
        from: deployer,
        contract: "Core",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    await hre.deployments.deploy("Core", {
        from: deployer,
        contract: "ERC1967Proxy",
        args: [
            coreImpl.address,
            Core__factory.createInterface().encodeFunctionData("initialize", [
                fluenceToken,
                EPOCH_DURATION,
                MIN_DEPOSITED_EPOCHES,
                MIN_REMATCHING_EPOCHES,
                dealImpl.address,
            ]),
        ],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });
};

module.exports.dependencies = ["Faucet"];
module.exports.tags = ["common"];
