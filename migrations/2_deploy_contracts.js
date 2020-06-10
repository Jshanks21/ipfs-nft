const YoYoToken = artifacts.require("YoYoToken");

module.exports = function(deployer) {
  deployer.deploy(YoYoToken);
};
