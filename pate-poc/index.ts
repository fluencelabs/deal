import * as NearAPI from "near-api-js";
import { ViewStateResult } from "near-api-js/lib/providers/provider";
import { Wallet, ethers, providers, utils } from "ethers";
import endianness from "endianness";
import {
  Deal,
  Deal__factory,
  DeveloperFaucet__factory,
  ERC20__factory,
} from "../aurora/dist/";
import { _TypedDataEncoder, base64 } from "ethers/lib/utils";

type PATE = {
  id: string;
  blockHash: string;
  dealId: string;
  merkleProof: string[];
  patId: string;
  providerAddress: string;
  signature: string;
};

const AURORA_RPC_URL = "https://rpc.testnet.near.org";

const nearNetworkConfig: NearAPI.ConnectConfig = {
  networkId: "testnet",
  nodeUrl:
    "https://stylish-blue-sanctuary.near-testnet.quiknode.pro/83e12032f287f9acd20d5821e7afd395724ad2a6/",
};

function getPATSlot(patId: string): string {
  return ethers.BigNumber.from(
    ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ["bytes32", "bytes32"],
        [
          ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes("network.fluence.WorkersManager.pat")
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
    finality: "optimistic",
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
      // @ts-ignore
      .hexlify(endianness(generation, 4))
      .slice(2)}`;
  }
}

async function createPATE(
  patId: string,
  dealAddress: string,
  resourceOwnerPrivKey: string
) {
  const near = await NearAPI.connect(nearNetworkConfig);

  const wallet = new ethers.Wallet(resourceOwnerPrivKey);

  if (patId.length !== 66) {
    throw new Error("PAT ID must be 32 hex bytes long");
  }

  if (dealAddress.length !== 42) {
    throw new Error("Deal address must be 20 hex bytes long");
  }

  const prefix = await getContractStatePrefix(near, dealAddress);

  const key = ethers.utils.base64.encode(
    ethers.utils.arrayify(`${prefix}${getPATSlot(patId)}`)
  );

  const response: ViewStateResult = await near.connection.provider.query({
    request_type: "view_state",
    finality: "optimistic",
    account_id: "aurora",
    // @ts-ignore
    include_proof: true,
    prefix_base64: key,
  });

  const storageRes: any = response.values.find((value) => {
    return value.key === key;
  })!;

  if (
    wallet.address.toLowerCase() !==
    utils
      .hexlify(utils.stripZeros(utils.base64.decode(storageRes.value)))
      .toLowerCase()
  ) {
    throw new Error("Provider is not the owner of the PAT");
  }

  const pate: PATE = {
    id: "",
    blockHash: response.block_hash,
    dealId: dealAddress,
    merkleProof: response.proof.map((p) => ethers.utils.hexlify(p)),
    patId: patId,
    providerAddress: wallet.address.toLowerCase(),
    signature: "",
  };

  const typedData = {
    domain: {
      name: "Deal",
      version: "1",
      chainId: 1313161554,
      verifyingContract: dealAddress,
    },
    types: {
      CreatePATE: [
        { name: "blockHash", type: "string" },
        { name: "dealId", type: "address" },
        { name: "merkleProof", type: "bytes[]" },
        { name: "patId", type: "bytes32" },
        { name: "providerAddress", type: "address" },
      ],
    },
    value: {
      blockHash: pate.blockHash,
      dealId: pate.dealId,
      merkleProof: pate.merkleProof,
      patId: pate.patId,
      providerAddress: pate.providerAddress,
    },
  };

  pate.id = _TypedDataEncoder.hash(
    typedData.domain,
    typedData.types,
    typedData.value
  );

  pate.signature = await wallet._signTypedData(
    typedData.domain,
    typedData.types,
    typedData.value
  );

  console.log(JSON.stringify(pate, null, 2));
}

createPATE(process.argv[2], process.argv[3], process.argv[4]);
