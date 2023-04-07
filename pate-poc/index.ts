import * as NearAPI from "near-api-js";
import { ViewStateResult } from "near-api-js/lib/providers/provider";
import { Wallet, ethers, providers } from "ethers";
import endianness from "endianness";
import {
  Deal,
  Deal__factory,
  DeveloperFaucet__factory,
  ERC20__factory,
} from "../aurora/dist/";

type PATE = {
  blockHash: string;
  dealId: string;
  merkleProof: string[];
  patId: string;
  providerAddress: string;
  signature: string;
};

const DEVELOPER_FAUCET_ADDRESS = "0x0000";
const AURORA_RPC_URL = "https://rpc.testnet.near.org";

const nearNetworkConfig: NearAPI.ConnectConfig = {
  networkId: "testnet",
  nodeUrl: "https://near.fluence.dev/",
};

function getPATSlot(patId: string): string {
  return ethers.BigNumber.from(
    ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ["bytes32", "bytes32"],
        [
          ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(
              "network.fluence.ProviderManager.pat.owner."
            )
          ),
          ethers.utils.arrayify(patId),
        ]
      )
    )
  )
    .sub(1)
    .toHexString()
    .slice(2);
}

async function getContractStatePrefix(
  near: NearAPI.Near,
  contractAddress: string
): Promise<string> {
  const pureContractAddress = contractAddress.slice(2);
  let generationKey = ethers.utils.base64.encode(
    ethers.utils.arrayify(`0x0707${pureContractAddress}`)
  );

  let response: ViewStateResult = await near.connection.provider.query({
    request_type: "view_state",
    finality: "final",
    account_id: "aurora",
    prefix_base64: generationKey,
  });

  let generation = null;
  if (response.values.length > 0) {
    let v = response.values.find((value) => {
      return value.key === generationKey;
    });

    if (v) {
      generation = ethers.utils.base64.decode(v.value);
    }
  }

  if (generation == null) {
    return `0x0704${pureContractAddress}`;
  } else {
    return `0x0704${pureContractAddress}${utils
      .hexlify(endianness(generation, 4))
      .slice(2)}`;
  }
}

async function createPATE(
  patId: string,
  dealAddress: string,
  resourceOwnerWallet: Wallet
) {
  const near = await NearAPI.connect(nearNetworkConfig);

  const wallet = new ethers.Wallet(resourceOwnerWallet);

  if (patId.length !== 66) {
    throw new Error("PAT ID must be 32 hex bytes long");
  }

  if (dealAddress.length !== 42) {
    throw new Error("Deal address must be 20 hex bytes long");
  }

  const prefix = getContractStatePrefix(near, dealAddress);

  const key = ethers.utils.base64.encode(
    ethers.utils.arrayify(`${prefix}${getPATSlot(patId)}`)
  );

  const response: ViewStateResult = await near.connection.provider.query({
    request_type: "view_state",
    finality: "final",
    account_id: "aurora",
    // @ts-ignore
    include_proof: true,
    prefix_base64: key,
  });

  const storageRes = response.values.find((value) => {
    return value.key === key;
  });

  console.log(storageRes.value);

  if (wallet.address.toLowerCase() !== storageRes.value.toLowerCase()) {
    throw new Error("Provider is not the owner of the PAT");
  }

  const pate: PATE = {
    blockHash: response.block_hash,
    dealId: dealAddress,
    merkleProof: response.proof.map((p) => ethers.utils.hexlify(p)),
    patId: patId,
    providerAddress: storageRes.value,
    signature: "",
  };

  pate.signature = await wallet._signTypedData(
    {
      name: "Deal",
      version: "1",
      chainId: 1313161554,
      verifyingContract: dealAddress,
    },
    {
      CreatePATE: [
        { name: "blockHash", type: "bytes32" },
        { name: "dealId", type: "address" },
        { name: "merkleProof", type: "bytes[]" },
        { name: "patId", type: "bytes32" },
        { name: "providerAddress", type: "address" },
      ],
    },
    {
      blockHash: pate.blockHash,
      dealId: pate.dealId,
      merkleProof: pate.merkleProof,
      patId: pate.patId,
      providerAddress: pate.providerAddress,
    }
  );

  console.log(JSON.stringify(pate, null, 2));
}

async function join(dealAddress: string, resourceOwnerPrivateKey: string) {
  if (dealAddress.length !== 42) {
    throw new Error("Deal address must be 20 hex bytes long");
  }

  if (resourceOwnerPrivateKey.length !== 66) {
    throw new Error("Private key must be 32 hex bytes long");
  }

  const resourceOwnerWallet = new ethers.Wallet(
    resourceOwnerPrivateKey,
    new providers.JsonRpcProvider(AURORA_RPC_URL)
  );

  const deal = Deal__factory.connect(dealAddress, resourceOwnerWallet);

  const devContract = DeveloperFaucet__factory.connect(
    DEVELOPER_FAUCET_ADDRESS,
    resourceOwnerWallet
  );

  const flt = ERC20__factory.connect(
    await devContract.fluenceToken(),
    resourceOwnerWallet
  );

  const stake = await deal.requiredStake();
  const approveTx = await flt.approve(dealAddress, stake);
  const res = await approveTx.wait();

  const eventTopic = deal.interface.getEventTopic("AddProviderToken");

  const log = res.logs.find(
    (log: { topics: Array<string> }) => log.topics[0] === eventTopic
  );

  const patId: string = deal.interface.parseLog(log).args["id"];

  createPATE(patId, dealAddress, resourceOwnerWallet);
}

join(process.argv[2], process.argv[3]);
