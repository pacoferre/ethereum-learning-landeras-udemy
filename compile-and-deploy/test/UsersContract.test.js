const assert = require('assert');
const AssertionError = require('assert').AssertionError;
const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
const web3 = new Web3(provider);

const { interface, bytecode } = require('../scripts/compile');

let accounts;
let usersContract;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    usersContract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('The UsersContract', async() => {
    it('should deploy', () => {
        console.log(usersContract.options.address);
        assert.ok(usersContract.options.address);
    });

    it('should join a user', async () => {
        let name = "Paco";
        let surName = "Ferre";

        await usersContract.methods.join(name, surName)
            .send({ from: accounts[0], gas: '500000' });
    });

    it('should retreive a user', async () => {
        let name = "Paco";
        let surName = "Ferre";

        await usersContract.methods.join(name, surName)
            .send({ from: accounts[0], gas: '500000' });

        let user = await usersContract.methods.getUser(accounts[0])
            .call();

        assert.equal(name, user[0]);
        assert.equal(surName, user[1]);
    });

    it('should not allow joining an account twice', async () => {
        await usersContract.methods.join("Pedro", "Lopez")
            .send({ from: accounts[1], gas: '500000' });

        try {
            await usersContract.methods.join("Ana", "Gomez")
                .send({ from: accounts[1], gas: '500000' });
            assert.fail('same account can join twice');
        }
        catch (e) {
            if (e instanceof AssertionError) {
                assert.fail(e.message);
            }
        }
    });

    it('should not allow retreiving an unjoined account', async () => {
        try {
            let user = await usersContract.methods.getUser(accounts[0])
                .call();
            assert.fail('an unjoined account can be retrived');
        }
        catch (e) {
            if (e instanceof AssertionError) {
                assert.fail(e.message);
            }
        }
    });    

    it('should return correct number of joined accounts', async () => {
        await usersContract.methods.join("Paco", "Ferre")
            .send({ from: accounts[0], gas: '500000' });

        await usersContract.methods.join("Pedro", "Lopez")
            .send({ from: accounts[1], gas: '500000' });

        let count = await usersContract.methods.totalUsers()
            .call();

        assert.equal(count, 2);
    });
});

