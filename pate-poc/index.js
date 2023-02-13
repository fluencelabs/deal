const NearAPI = require("near-api-js");
const ethers = require("ethers");
const endianness = require("endianness");

async function createPATE(patId, dealAddress) {
  const connectionConfig = {
    networkId: "testnet",
    nodeUrl: "https://near.fluence.dev/",
  };

  const nearConnection = await NearAPI.connect(connectionConfig);

  const patOwnerSlot = ethers.BigNumber.from(
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

  dealAddress = dealAddress.slice(2);
  let generationKey = ethers.utils.base64.encode(
    ethers.utils.arrayify("0x0707" + dealAddress)
  );

  let response = await nearConnection.connection.provider.query({
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
    key = `0x0704${dealAddress}${patOwnerSlot}`; //
  } else {
    key = `0x0704${dealAddress}${utils
      .hexlify(endianness(generation, 4))
      .slice(2)}${patOwnerSlot}`;
  }

  key = ethers.utils.base64.encode(ethers.utils.arrayify(key));

  response = await nearConnection.connection.provider.query({
    request_type: "view_state",
    finality: "final",
    account_id: "aurora",
    include_proof: true,
    prefix_base64: key,
  });

  const storageRes = response.values.find((value) => {
    return value.key === key;
  });

  console.log(storageRes.value);
  console.log(response.proof.map((p) => ethers.utils.hexlify(p)));
}

createPATE(
  "0xed60f9bf9927b7ef86460c1b5ce02dac0c32792335a2fd6c39d1efb53b2d8659",
  "0x348e39eec7e5f7AccC0528CE11e48B6590B6E2b4"
);
