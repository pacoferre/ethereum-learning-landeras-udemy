let usersContract = artifacts.require("./UsersContract.sol");

module.exports = function(deployer) {
    deployer.deploy(usersContract)
}
