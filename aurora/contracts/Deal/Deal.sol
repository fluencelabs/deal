pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PeersManager.sol";
import "../Utils/WithdrawRequests.sol";
import "../Core.sol";

contract DealState {
    enum Role {
        None,
        Owner,
        ResourceManager
    }

    struct Participant {
        Role role;
        mapping(IERC20 => uint256) balanceByToken;
        mapping(IERC20 => WithdrawRequests.Info) withdrawRequestsByToken;
    }

    mapping(address => Participant) participants;
}

contract Deal is DealState, Ownable {
    using SafeERC20 for IERC20;
    using WithdrawRequests for WithdrawRequests.Info;

    function register() external {
        participant = Participant({role: Role.ResourceManager});
    }

    function deposit(uint amount) external {
        Participant storage participant = participants[msg.sender];

        require(participant.role != Role.None, "Participant isn't exist");

        paymentToken.safeTransferFrom(msg.sender, address(this), amount);

        participant.balanceByToken[paymentToken] += amount;
    }

    function createWithdrawRequest(uint amount) external {
        Participant storage participant = participants[msg.sender];

        require(participant.role != Role.None, "Participant isn't exist");

        uint balance = participant.balanceByToken[paymentToken];
        WithdrawRequests.Info storage requests = participant
            .withdrawRequestsByToken[paymentToken];

        uint totalAmount = requests.totalAmount();
        uint free = requests.total - amount - totalAmount;
        require(free > 0, "Free balance is zero");

        requests.createOrAddAmount(amount);
    }

    function cancelWithdrawRequest(uint amount) external {
        Participant storage participant = participants[msg.sender];

        require(participant.role != Role.None, "Participant isn't exist");

        uint balance = participant.balanceByToken[paymentToken];
        WithdrawRequests.Info storage requests = participant
            .withdrawRequestsByToken[paymentToken];

        uint totalAmount = requests.totalAmount();
        uint free = requests.total - amount - totalAmount;
        require(free > 0, "Free balance is zero");

        requests.createOrAddAmount(amount);
    }

    function withdraw() external {
        Participant storage participant = participants[participantAddress];
        require(participant.role != Role.None, "Participant isn't exist");

        (WithdrawRequests.Request rq, bool isOk) = requests.first();
        require(isOk, "WithdrawRequest doesn't exist");

        _withdraw(msg.sender);
    }

    function withdrawAll() external {
        Participant storage participant = participants[participantAddress];
        require(participant.role != Role.None, "Participant isn't exist");

        (WithdrawRequests.Request rq, bool isOk) = requests.first();
        while (isOk) {
            _withdraw(rq);
        }
    }

    function _withdraw(WithdrawRequests.Info storage requests) private {
        require(block.timestamp > (rq.timestamp + Core.WITHDRAW_TIMEOUT), ""); //TODO error text

        participant.balanceByToken[paymentToken] -= rq.amount;
        requests.remove(rq.timestamp);

        paymentToken.safeTransferFrom(
            address(this),
            participantAddress,
            rq.amount
        );
    }
}
