export const DEFAULT_CONFIRMATIONS = 1;

export enum CCStatus {
  Inactive,
  Active,
  // WaitDelegation - before collateral is deposited.
  WaitDelegation,
  // Status is WaitStart - means collateral deposited, and epoch should be proceed before Active.
  WaitStart,
  Failed,
  Removed,
}

export enum DealStatus {
  // the deal does have enough funds to pay for the workers
  INSUFFICIENT_FUNDS,
  ACTIVE,
  // the deal is stopped
  ENDED,
  // the deal has a balance and waiting for workers
  NOT_ENOUGH_WORKERS,
  // the deal has balance less than the minimal balance. Min balance: 2 * targetWorkers * pricePerWorkerEpoch
  SMALL_BALANCE,
}

export enum CapacityConstantType {
  MinDuration,
  USDCollateralPerUnit,
  SlashingRate,
  WithdrawEpochsAfterFailed,
  MaxFailedRatio,
  USDTargetRevenuePerEpoch,
  MinRewardPerEpoch,
  MaxRewardPerEpoch,
  MinProofsPerEpoch,
  MaxProofsPerEpoch,
}

export const CC_DURATION_DEFAULT = 5n;
export const CC_MIN_DURATION = 0n;
export const CC_MAX_FAILED_RATIO = 3n;
