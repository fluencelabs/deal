import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Matcher, OwnableFaucet, TestERC20} from "../src";
import {getEIP1559Args} from "../utils/transactions";

type Args = {
    register: boolean;
};


task("newtask", "Implement step from \"2.2 register compute peer\" test.")
    .addFlag("register",
        "register or not provider (on the 1st time deployed contract - yopu should register)"
    )
    .setAction(async (args: Args, hre: HardhatRuntimeEnvironment) => {
    const [sender,] = await hre.ethers.getSigners();

    const deploymentAddress = (await hre.deployments.get("FLT")).address;
    const flt = (await hre.ethers.getContractAt('TestERC20', deploymentAddress) as TestERC20).connect(sender)

    // let txEIP1559Args: { maxPriorityFeePerGas: string; maxFeePerGas: string; type: number } | {} = {
    //     maxFeePerGas: '10000020000001',
    //     maxPriorityFeePerGas: '10000000000000',
    //     type: 2,
    // };
    let txEIP1559Args = await getEIP1559Args(hre.ethers.provider);
    console.log('txEIP1559Args', txEIP1559Args)

    console.log('sender.address', sender.address)

    const matcherAddress = (await hre.deployments.get("Matcher")).address;
    const totalCollateral = 300n;

    (await flt.connect(sender).approve(
        matcherAddress, totalCollateral, {...txEIP1559Args},)
    ).wait();

    console.log('connected')

    console.log('matcherAddress', matcherAddress)

    const matcher = (await hre.ethers.getContractAt('Matcher', matcherAddress) as Matcher).connect(sender);
    const peerId = "0x91c12aa22f9b0a22e5fcaf929328e7c27dfe4d743d21bec597ba52006b989b41"
    const workerSlots = 1

    if (args.register) {
        const registerComputeProvider = await matcher.registerComputeProvider(1, 1, await flt.getAddress(), [])
        await registerComputeProvider.wait()
    }

    const addWorkersSlotsTx = await matcher.addWorkersSlots(
                    peerId, workerSlots, {...txEIP1559Args},
                );
    await addWorkersSlotsTx.wait()

    console.log('added')
  });
