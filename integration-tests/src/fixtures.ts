import { ethers } from "ethers";

export interface Peer {
  owner: string;
  peerId: string;
  unitIds: string[];
}

const pseudoRandomValue = () => Math.trunc(Date.now() * Math.random());

export function randomWorkerId() {
  return ethers.encodeBytes32String(`workerId:${pseudoRandomValue()}`);
}

export function randomCID() {
  return {
    prefixes: "0x12345678",
    hash: ethers.encodeBytes32String(`CID:${pseudoRandomValue()}`),
  };
}

export function getUnitIdFixture() {
  return ethers.encodeBytes32String(`unitId:${pseudoRandomValue()}`);
}

export function getPeerFixture(owner: string, units: number) {
  return {
    owner: owner,
    peerId: ethers.encodeBytes32String(`peerId0:${pseudoRandomValue()}`),
    unitIds: new Array(units)
      .fill(0)
      .map((_, i) =>
        ethers.encodeBytes32String(`unitId${i}:${pseudoRandomValue()}`),
      ),
  };
}

export function getDefaultOfferFixture(
  owner: string,
  paymentToken: string,
  peers: number,
  cus: number,
) {
  return {
    minPricePerWorkerEpoch: ethers.parseEther("0.01"),
    paymentToken: paymentToken,
    effectors: [randomCID()],
    peers: new Array(peers).fill(0).map(() => getPeerFixture(owner, cus)),
    minProtocolVersion: 1,
    maxProtocolVersion: 1,
  };
}
