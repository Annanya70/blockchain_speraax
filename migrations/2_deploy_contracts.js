const lendingPlatforms= artifacts.require('LendingPlatform');
module.exports = function(deployer) {
  deployer.deploy(lendingPlatforms,5)
}
