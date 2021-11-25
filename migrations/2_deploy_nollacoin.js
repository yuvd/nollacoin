const NollaCoin = artifacts.require("NollaCoin");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(NollaCoin, 1000, {from: accounts[0]});
};
