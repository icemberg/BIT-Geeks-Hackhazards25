// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CitizenNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string private _baseTokenURI;
    mapping(address => bool) private _hasMinted;

    constructor() ERC721("CitizenNFT", "CZN") {
        _baseTokenURI = "https://api.civicquest.com/nft/";
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function hasMinted(address account) public view returns (bool) {
        return _hasMinted[account];
    }

    function safeMint(address to) public {
        require(!_hasMinted[to], "Address has already minted a CitizenNFT");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _hasMinted[to] = true;
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "CitizenNFT is non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
} 