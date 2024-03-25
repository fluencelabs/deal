// Status undefined == problem with networks, etc.
export type DealStatus =
  | "insufficientFunds"
  | "active"
  | "ended"
  | "notEnoughWorkers"
  | "smallBalance"
  | "undefined";
export type CapacityCommitmentStatus =
  | "active"
  | "waitDelegation"
  | "waitStart"
  | "inactive"
  | "failed"
  | "removed"
  | "undefined";
