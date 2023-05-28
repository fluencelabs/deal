import { Config } from './config'
import NearAPI from 'near-api-js'
import { ethers } from 'ethers'

const calculateEVMSlot = (patId: string, dealAddress: string) => {
  const patOwnerSlot = ethers.BigNumber.from(
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
