export const WAIT_CONFIRMATIONS = process.env["WAIT_CONFIRMATIONS"] ? parseInt(process.env["WAIT_CONFIRMATIONS"]) : 0;
export const EPOCH_DURATION = 15;
export const DEFAULT_HARDHAT_DEPLOY_SETTINGS = {
    log: true,
    autoMine: true,
    waitConfirmations: WAIT_CONFIRMATIONS,
};
export const MIN_DEPOSITED_EPOCHES = 2n;
export const MIN_REMATCHING_EPOCHES = 2n;
