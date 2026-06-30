// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * DAO_Voting - 一个简单的 DAO 投票合约
 * 
 * 对应 Handbook 中的 DAO 治理实操案例
 * 代币持有者可以创建提案并进行投票
 */
contract DAO_Voting is Ownable {
    // ---------- 数据结构 ----------
    
    enum ProposalState {
        Pending,    // 待投票
        Active,     // 投票中
        Executed,   // 已执行
        Rejected    // 被否决
    }

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        ProposalState state;
        bool executed;
    }

    // ---------- 状态变量 ----------
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    uint256 public votingPeriod = 3 days;
    uint256 public quorum = 1; // 至少需要 1 票才能通过（简化版）
    
    // 投票权重：简化版中每个地址 1 票
    mapping(address => uint256) public votingPower;

    uint256 private _proposalCounter;

    event ProposalCreated(uint256 indexed id, address proposer, string description);
    event VoteCast(uint256 indexed id, address voter, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed id);

    constructor() Ownable(msg.sender) {}

    // ---------- 核心功能 ----------
    
    /**
     * 创建提案
     */
    function createProposal(string memory description) public {
        require(bytes(description).length > 0, "Description required");
        
        uint256 proposalId = _proposalCounter;
        _proposalCounter += 1;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + votingPeriod,
            state: ProposalState.Active,
            executed: false
        });
        
        emit ProposalCreated(proposalId, msg.sender, description);
    }

    /**
     * 投票
     * @param proposalId 提案 ID
     * @param support true = 赞成, false = 反对
     */
    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.state == ProposalState.Active, "Proposal not active");
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");
        
        hasVoted[proposalId][msg.sender] = true;
        uint256 votes = votingPower[msg.sender];
        
        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votes);
        
        // 自动检查提案状态
        _updateProposalState(proposalId);
    }

    /**
     * 执行提案（通过后执行）
     */
    function executeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.state == ProposalState.Active, "Proposal not active");
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");
        
        // 检查是否通过
        bool passed = proposal.forVotes > proposal.againstVotes && 
                      proposal.forVotes >= quorum;
        
        if (passed) {
            proposal.state = ProposalState.Executed;
            proposal.executed = true;
            emit ProposalExecuted(proposalId);
        } else {
            proposal.state = ProposalState.Rejected;
        }
    }

    /**
     * 更新提案状态（内部调用）
     */
    function _updateProposalState(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.state != ProposalState.Active) return;
        
        if (block.timestamp > proposal.endTime) {
            // 投票已结束，等待执行
        }
    }

    // ---------- 管理员功能 ----------
    
    /**
     * 分配投票权（管理员）
     */
    function grantVotingPower(address voter, uint256 power) public onlyOwner {
        votingPower[voter] = power;
    }

    /**
     * 批量分配投票权
     */
    function grantVotingPowerBatch(address[] memory voters, uint256[] memory powers) 
        public onlyOwner 
    {
        require(voters.length == powers.length, "Arrays length mismatch");
        for (uint256 i = 0; i < voters.length; i++) {
            votingPower[voters[i]] = powers[i];
        }
    }

    /**
     * 设置投票期限
     */
    function setVotingPeriod(uint256 newPeriod) public onlyOwner {
        votingPeriod = newPeriod;
    }

    // ---------- 查询功能 ----------
    
    function getProposal(uint256 proposalId) 
        public 
        view 
        returns (Proposal memory) 
    {
        return proposals[proposalId];
    }

    function getProposalCount() public view returns (uint256) {
        return _proposalCounter;
    }
}
