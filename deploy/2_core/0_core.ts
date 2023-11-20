import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { EPOCH_DURATION, MIN_DEPOSITED_EPOCHES, MIN_REMATCHING_EPOCHES } from "../../env";
import { Core__factory } from "../../src/typechain-types";
import { getEIP1559AndHardhatTxArgs } from "../../utils/deploy";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const CoreDeploymentName = "Core"
    const DealImplDeploymentName = 'DealImpl'
    const CoreImplDeploymentName = "CoreImpl"

    const fluenceToken = (await hre.deployments.get("FLT")).address;
    const eip1559TxArgs = await getEIP1559AndHardhatTxArgs(hre.ethers.provider);

    const dealImpl = await hre.deployments.deploy(DealImplDeploymentName, {
        from: deployer,
        contract: "Deal",
        args: [],
        ...eip1559TxArgs,
    });

    const coreImpl = await hre.deployments.deploy(CoreImplDeploymentName, {
        from: deployer,
        contract: "Core",
        args: [],
        ...eip1559TxArgs,
    });

    const core = await hre.deployments.deploy(CoreDeploymentName, {
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
        ...eip1559TxArgs,
    });
};

module.exports.dependencies = ["Faucet"];
module.exports.tags = ["common"];
