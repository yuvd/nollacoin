// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NollaCoin is ERC20 {
	constructor(uint256 initialSupply) ERC20("NollaCoin", "NOL") {
		_mint(msg.sender, initialSupply * 10 ** decimals());
	}

	function decimals() pure public override returns(uint8) {
		return 20;
	} 

}