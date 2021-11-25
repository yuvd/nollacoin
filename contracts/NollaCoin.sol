// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NollaCoin is ERC20 {
  mapping(address => mapping(address => uint256)) public barksLedger; // Key is user who has been barked upon. Value is a mapping of users who barked on the user, and how many times each user barked on them.
  uint256 public barksCost = 1000;

  constructor(uint256 initialSupply) ERC20("NollaCoin", "NOL") {
    _mint(msg.sender, initialSupply * 10**decimals());
  }

  function decimals() public pure override returns (uint8) {
    return 20;
  }

  function bark(address barkee, uint8 barksAmount) external {
    require(balanceOf(msg.sender) > (barksCost * barksAmount)); // Barker must have 1000 NollaCoin wei per bark to bark at other users

    mapping(address => uint256) storage barkersOnUserList = barksLedger[barkee]; // Get full list of users who barked on the barkee
    barkersOnUserList[msg.sender] = barkersOnUserList[msg.sender] + barksAmount; // Go the "row" where the amount of times the barker barked upon the barkee is, and increment it by 1
  }
}
