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

export const CC_DURATION_DEFAULT = 1000n;
