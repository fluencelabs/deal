import { ethers, utils } from 'ethers'
import NearAPI from 'near-api-js'
import { Config } from './config'
import endianness from 'endianness'

export type NearStorageResponse = {
  block_height: number
  block_hash: string
  proof: Array<ethers.utils.BytesLike>
  values: { key: string; value: string }[]
}

export const nearConnectionPromise = NearAPI.connect(Config.near)

export const getNearProof = async (
  evmSlotId: string,
  evmDealAddress: string
): Promise<{
  value: string
  proof: Array<ethers.utils.BytesLike>
}> => {
  const nearConnection = await nearConnectionPromise

  evmDealAddress = evmDealAddress.slice(2)
  const generationKey = ethers.utils.base64.encode(
    ethers.utils.arrayify('0x0707' + evmDealAddress)
  )

  const generationKeyValues =
    await nearConnection.connection.provider.query<NearStorageResponse>({
      request_type: 'view_state',
      finality: 'final',
      account_id: 'aurora',
      prefix_base64: generationKey,
    })

  let generation = null
  const generationValue = generationKeyValues.values.find(value => {
    return value.key === generationKey
  })

  if (generationValue) {
    generation = ethers.utils.base64.decode(generationValue.value)
  }

  let key = ''
  if (generation == null) {
    key = `0x0704${evmDealAddress}${evmSlotId}`
  } else {
    endianness(generation, 4)
    key = `0x0704${evmDealAddress}${utils
      .hexlify(generation)
      .slice(2)}${evmSlotId}`
  }

  key = ethers.utils.base64.encode(ethers.utils.arrayify(key))

  const storageSlotResponse =
    await nearConnection.connection.provider.query<NearStorageResponse>({
      request_type: 'view_state',
      finality: 'final',
      account_id: 'aurora',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      include_proof: true,
      prefix_base64: key,
    })

  const storageRes = storageSlotResponse.values.find(value => {
    return value.key === key
  })

  if (!storageRes) {
    throw new Error('Storage value not found')
  }

  return {
    value: storageRes.value,
    proof: storageSlotResponse.proof,
  }
}
