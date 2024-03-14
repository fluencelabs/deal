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
  INSUFFICIENT_FUNDS,
  ACTIVE,
  ENDED,
  NOT_ENOUGH_WORKERS,
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
