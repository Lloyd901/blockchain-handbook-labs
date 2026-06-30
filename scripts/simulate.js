const hre = require('hardhat');
const fs = require('fs');
const crypto = require('crypto');

async function main() {
  const deployInfoPath = './deploy-info.json';
  if (!fs.existsSync(deployInfoPath)) {
    throw new Error(`Missing ${deployInfoPath}. Run scripts/deploy.js first.`);
  }

  const deployInfo = JSON.parse(fs.readFileSync(deployInfoPath, 'utf8'));
  const { nftAddress, daoAddress } = deployInfo;
  if (!nftAddress || !daoAddress) {
    throw new Error('deploy-info.json must contain nftAddress and daoAddress');
  }

  const [signer] = await hre.ethers.getSigners();
  console.log('使用账户:', signer.address);
  console.log('网络:', hre.network.name);

  const nft = await hre.ethers.getContractAt('SimpleNFT', nftAddress, signer);
  const dao = await hre.ethers.getContractAt('DAO_Voting', daoAddress, signer);

  const balanceBefore = await nft.balanceOf(signer.address);
  console.log(`NFT 余额(操作前): ${balanceBefore.toString()}`);

  // 模拟 NFT 铸造
  const plainText = `backend-sim-${Date.now()}`;
  const hash = crypto.createHash('sha256').update(plainText).digest('hex');
  console.log('铸造 NFT，哈希:', hash);
  const mintTx = await nft.mintNFT(signer.address, hash);
  const mintReceipt = await mintTx.wait();
  console.log('mint 交易哈希:', mintTx.hash);
  console.log('mint 区块号:', mintReceipt.blockNumber);

  const balanceAfter = await nft.balanceOf(signer.address);
  console.log(`NFT 余额(操作后): ${balanceAfter.toString()}`);

  // DAO 状态检查
  const proposalCount = await dao.getProposalCount();
  const proposalCountNum = Number(proposalCount);
  console.log('当前提案数:', proposalCountNum);

  if (proposalCountNum > 0) {
    const proposalId = 0;
    const proposal = await dao.getProposal(proposalId);
    console.log(`提案 #${proposalId} 状态:`, {
      id: proposal.id.toString(),
      proposer: proposal.proposer,
      description: proposal.description,
      forVotes: proposal.forVotes.toString(),
      againstVotes: proposal.againstVotes.toString(),
      state: proposal.state,
      executed: proposal.executed,
    });

    // 仅当投票尚未结束且账户有投票权时投票
    const power = await dao.votingPower(signer.address);
    const powerNum = Number(power);
    console.log('当前投票权:', powerNum);

    if (powerNum > 0) {
      try {
        const voteTx = await dao.vote(proposalId, true);
        await voteTx.wait();
        console.log(`已对提案 ${proposalId} 投赞成票，交易哈希: ${voteTx.hash}`);
        const updated = await dao.getProposal(proposalId);
        console.log('投票后状态:', {
          forVotes: updated.forVotes.toString(),
          againstVotes: updated.againstVotes.toString(),
          executed: updated.executed,
        });
      } catch (err) {
        console.log('投票失败，错误:', err.message || err);
      }
    }
  }

  // 新建示例提案
  const newProposalText = `后台测试提案 ${new Date().toISOString()}`;
  const createTx = await dao.createProposal(newProposalText);
  await createTx.wait();
  console.log('已创建新提案:', newProposalText);

  const countAfter = await dao.getProposalCount();
  console.log('创建后提案数:', countAfter.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
