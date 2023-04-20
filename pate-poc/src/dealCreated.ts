import { ethers } from 'ethers'
import { getNearProof } from './common'

export async function createdDealProof(patId: string, dealAddress: string) {
  const slotId = calculateEVMSlotForCreatedDeal(patId)
  const { proof } = await getNearProof(slotId, dealAddress)

  console.log(
    'proof: ',
    proof.map((p: ethers.BytesLike) => ethers.utils.hexlify(p))
  )
}

const calculateEVMSlotForCreatedDeal = (address: string): string => {
  return ethers.BigNumber.from(
    ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ['bytes32', 'bytes32'],
        [
          ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes('network.fluence.DealFactory.deal.')
          ),
          ethers.utils.arrayify(ethers.utils.zeroPad(address, 32)),
        ]
      )
    )
  )
    .sub(1)
    .toHexString()
    .slice(2)
}
