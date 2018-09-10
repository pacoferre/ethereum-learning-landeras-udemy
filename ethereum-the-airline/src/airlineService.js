export class AirlineService {
    constructor (contract) {
        this.contract = contract;
    }

    async buyFlight(flightIndex, from, value) {
        return this.contract.buyFlight(flightIndex, { from, value });
    }

    async getCustomerFlights(account) {
        let total = (await this.contract
            .getCustomerTotalFlights(account)).toNumber();
        let flights = [];

        for(var i = 0; i < total; ++i) {
            flights.push(await this.contract
                .getCustomerFlightName(account, i));
        }

        return flights;
    }

    async getFlights() {
        let total = await this.getTotalFlights();
        let flights = [];

        for(var i = 0; i < total; ++i) {
            let flight = await this.contract.flights(i);
            flights.push(flight);
        }

        return this.mapFlights(flights);
    }

    async getTotalFlights() {
        return (await this.contract.totalFlights()).toNumber();
    }

    getRefundableEther(from) {
        return this.contract.getRefundableEther({ from });
    }

    redeemLoyaltyPoints(from) {
        return this.contract.redeemLoyaltyPoints({ from });
    }    

    mapFlights(flights) {
        return flights.map(flight => {
            return {
                name: flight[0],
                price: flight[1].toNumber()
            }
        });
    }
}
