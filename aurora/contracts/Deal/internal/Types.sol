struct Particle {
    string air;
    string prevData;
    string params;
    string callResults;
}

struct PAT {
    uint256 index;
    address owner;
    uint256 collateral;
    uint256 created;
}

enum DealStatus {
    WaitingForWorkers,
    Working
}

type PATId is bytes32;
