import { ethers } from 'ethers'
import { getNearProof } from './common'

export async function createPATE(patId: string, dealAddress: string) {
  const slotId = calculateEVMSlotForPATE(patId)
  const { value, proof } = await getNearProof(slotId, dealAddress)

  console.log('value: ', value)
  console.log(
    'proof: ',
    proof.map((p: ethers.BytesLike) => ethers.utils.hexlify(p))
  )
}

const calculateEVMSlotForPATE = (patId: string): string => {
  return ethers.BigNumber.from(
    ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ['bytes32', 'bytes32'],
        [
          ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(
              'network.fluence.ProviderManager.pat.owner.'
            )
          ),
          ethers.utils.arrayify(patId),
        ]
      )
    )
  )
    .sub(1)
    .toHexString()
    .slice(2)
}
