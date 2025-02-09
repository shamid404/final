// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public voters;
    Candidate[] public candidates;
    address public admin;
    bool public votingActive;
    uint256 public totalVotes;

    event ElectionStarted(string message, uint256 candidateCount);
    event VotingEnded(string message, uint256 totalVotes);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event CandidateAdded(string name, uint256 candidateId);
    event VoteRevoked(address indexed voter, uint256 indexed candidateId);

    constructor(string[] memory candidateNames) {
        admin = msg.sender;
        votingActive = true;
        totalVotes = 0;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }

        emit ElectionStarted("The election has started!", candidateNames.length);
    }

    function vote(uint256 candidateId) public {
        require(votingActive, "Voting has ended.");
        require(!voters[msg.sender], "You have already voted.");
        require(candidateId < candidates.length, "Invalid candidate ID.");

        voters[msg.sender] = true;
        candidates[candidateId].voteCount += 1;
        totalVotes += 1;

        emit Voted(msg.sender, candidateId);
    }

    function endVoting() public {
        require(msg.sender == admin, "Only admin can end the voting.");
        require(votingActive, "Voting is already ended.");

        votingActive = false;

        emit VotingEnded("The voting has ended.", totalVotes);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function addCandidate(string memory name) public {
        require(msg.sender == admin, "Only admin can add candidates.");
        require(votingActive, "Cannot add candidates after voting has started.");

        candidates.push(Candidate(name, 0));
        emit CandidateAdded(name, candidates.length - 1);
    }

    function revokeVote(uint256 candidateId) public {
        require(votingActive, "Voting has ended.");
        require(voters[msg.sender], "You haven't voted yet.");
        require(candidateId < candidates.length, "Invalid candidate ID.");
        require(candidates[candidateId].voteCount > 0, "No votes to revoke.");

        voters[msg.sender] = false;
        candidates[candidateId].voteCount -= 1;
        totalVotes -= 1;

        emit VoteRevoked(msg.sender, candidateId);
    }
}


function changeAdmin(address newAdmin) public {
        require(msg.sender == admin, "Only current admin can change admin.");
        require(newAdmin != address(0), "New admin cannot be zero address.");
        require(newAdmin != admin, "New admin must be different.");

        address oldAdmin = admin;
        admin = newAdmin;

        emit AdminChanged(oldAdmin, newAdmin);
    }
