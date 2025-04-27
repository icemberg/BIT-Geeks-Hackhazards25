// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenPoints is ERC20, Ownable {
    mapping(address => bool) private _hasCitizenNFT;

    constructor() ERC20("GreenPoints", "GP") {
        // Initial supply will be minted as needed
    }

    function setCitizenNFT(address citizenNFT) public onlyOwner {
        _hasCitizenNFT[citizenNFT] = true;
    }

    function mintInitialTokens(address to) public {
        require(_hasCitizenNFT[msg.sender], "Only CitizenNFT contract can mint initial tokens");
        _mint(to, 500 * 10 ** decimals()); // Mint 500 GP
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
} 