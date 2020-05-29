var Auction = artifacts.require("./Auction.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Auction, 200, accounts[0]);
};
