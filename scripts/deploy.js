const hre = require("hardhat");

async function main() {
    console.log("========== 开始部署合约 ==========\n");

    // 获取部署账户
    const [deployer] = await hre.ethers.getSigners();
    console.log(`部署账户: ${deployer.address}`);
    console.log(`账户余额: ${hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH\n`);

    // ====== 1. 部署 SimpleNFT ======
    console.log("部署 SimpleNFT...");
    const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
    const nft = await SimpleNFT.deploy(
        "SocialImpactNFT",           // name
        "SINFT",                     // symbol
        "https://example.com/metadata/" // baseURI
    );
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log(`SimpleNFT 已部署: ${nftAddress}`);

    // 铸造一个示例 NFT（附带 SHA-256 哈希）
    const hashExample = "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";
    await nft.mintNFT(deployer.address, hashExample);
    console.log(`已铸造 NFT #0，哈希: ${hashExample}\n`);

    // ====== 2. 部署 DAO_Voting ======
    console.log("部署 DAO_Voting...");
    const DAO_Voting = await hre.ethers.getContractFactory("DAO_Voting");
    const dao = await DAO_Voting.deploy();
    await dao.waitForDeployment();
    const daoAddress = await dao.getAddress();
    console.log(`DAO_Voting 已部署: ${daoAddress}`);

    // 给 deployer 分配投票权
    await dao.grantVotingPower(deployer.address, 10);
    console.log(`已分配 10 投票权给 ${deployer.address}`);

    // 创建示例提案
    await dao.createProposal("资助社区绿色能源项目 - 使用 NFT 收益支持环保");
    console.log("已创建示例提案\n");

    // ====== 3. 输出总结 ======
    console.log("========== 部署完成 ==========");
    console.log(`
    ┌─────────────────────────────────────────────┐
    │  SimpleNFT 地址:  ${nftAddress}  │
    │  DAO_Voting 地址:  ${daoAddress}  │
    └─────────────────────────────────────────────┘
    `);

    // 保存部署信息到文件（供前端使用）
    const fs = require('fs');
    const deployInfo = {
        nftAddress,
        daoAddress,
        deployer: deployer.address,
        network: hre.network.name,
        timestamp: new Date().toISOString()
    };
    fs.writeFileSync(
        './deploy-info.json',
        JSON.stringify(deployInfo, null, 2)
    );
    console.log("部署信息已保存到 deploy-info.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
