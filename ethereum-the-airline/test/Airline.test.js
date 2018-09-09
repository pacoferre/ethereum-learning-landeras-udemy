const Airline = artifacts.require('Airline');

let instance;

beforeEach(async() => {
    instance = await Airline.new();
});

contract('Airline', accounts => {
    it('should have available flights', async() => {
        let total = await instance.totalFlights();

        assert(total > 0);
    });

    it('should allow customers to buy a flight providing its value', async() => {
        let flight = await instance.flights(0);
        let flightName = flight[0], price = flight[1];

        await instance.buyFlight(0, { from: accounts[0], value: price });

        assert(await instance.getCustomerTotalFlights(accounts[0]), 1);
        assert(await instance.getCustomerFlightName(accounts[0], 0), flightName);
        assert(await instance.getCustomerFlightPrice(accounts[0], 0), price);
    });

    it('should NOT allow customers to buy a flight with invalid price', async() => {
        let flight = await instance.flights(0);
        let price = flight[1];

        try {
            await instance.buyFlight(0, { from: accounts[0], value: price - 5000 });

            assert.fail();
        }
        catch (e) {
        }

        try {
            await instance.buyFlight(0, { from: accounts[0], value: price + 5000 });

            assert.fail();
        }
        catch (e) {
        }
    });

    it('should get the real balance of the airline', async() => {
        let flight = await instance.flights(0);
        let price = flight[1];

        let flight2 = await instance.flights(1);
        let price2 = flight2[1];

        await instance.buyFlight(0, { from: accounts[0], value: price });
        await instance.buyFlight(1, { from: accounts[1], value: price2 });

        let balance = await instance.getAirlineBalance();
        assert(balance.toNumber(), price.toNumber() + price2.toNumber());
    });

    it('should should allow customers to manage and redeem loyalty points', async() => {
        let flight = await instance.flights(0);
        let price = flight[1];
        let flight2 = await instance.flights(1);
        let price2 = flight2[1];
        let etherPerPoint = await instance.etherPerPoint();

        await instance.buyFlight(0, { from: accounts[0], value: price });
        await instance.buyFlight(1, { from: accounts[0], value: price2 });
        let refundableEther = await instance.getRefundableEther();
        assert(refundableEther.toNumber(), etherPerPoint.toNumber() * 2);
        

        let balance = await web3.eth.getBalance(accounts[0]);
        await instance.redeemLoyaltyPoints();
        let finalBalance = await web3.eth.getBalance(accounts[0]);
        assert(finalBalance.toNumber(), balance.toNumber() + refundableEther.toNumber());


        refundableEther = await instance.getRefundableEther();
        assert(refundableEther.toNumber() == 0);
    });


});
