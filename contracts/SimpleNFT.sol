// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * SimpleNFT - 一个基础的 ERC-721 NFT 合约
 * 
 * 对应 Handbook 中的 NFT 实操案例
 * 每个 NFT 的 metadata URI 可以包含 SHA-256 哈希以证明真实性
 */
contract SimpleNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    string private _baseTokenURI;
    
    // tokenId => 对应的 SHA-256 哈希（用于证明资产真实性）
    mapping(uint256 => string) private _tokenHashes;

    constructor(string memory name, string memory symbol, string memory baseURI) 
        ERC721(name, symbol) 
        Ownable(msg.sender) 
    {
        _baseTokenURI = baseURI;
    }

    /**
     * 铸造 NFT
     * @param to 接收地址
     * @param hash SHA-256 哈希（如：社会影响力证书的哈希）
     */
    function mintNFT(address to, string memory hash) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenHashes[tokenId] = hash;
    }

    /**
     * 批量铸造 NFT
     */
    function mintBatch(address[] memory tos, string[] memory hashes) public onlyOwner {
        require(tos.length == hashes.length, "Arrays length mismatch");
        for (uint256 i = 0; i < tos.length; i++) {
            mintNFT(tos[i], hashes[i]);
        }
    }

    /**
     * 获取 NFT 对应的哈希
     */
    function getTokenHash(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenHashes[tokenId];
    }

    /**
     * 获取 token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    /**
     * 设置 base URI（管理员）
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}
