pragma solidity ^0.4.24;

contract Airline {
    address public owner;

    struct Customer {
        uint loyaltyPoints;
        Flight[] flights;
    }

    struct Flight {
        string name;
        uint price;
    }

    uint public etherPerPoint = 0.5 ether;

    Flight[] public flights;

    mapping(address => Customer) public customers;

    event FlightPurchased(address indexed customer, uint price);

    constructor() public {
        owner = msg.sender;

        flights.push(Flight("Tokio", 4 ether));
        flights.push(Flight("Berlin", 3 ether));
        flights.push(Flight("Madrid", 3 ether));
    }

    function getCustomerTotalFlights(address addr) public view returns (uint) {
        Customer memory customer = customers[addr];

        return customer.flights.length;
    }

    function getCustomerFlightName(address addr, uint flightIndex) public view returns (string) {
        Customer memory customer = customers[addr];

        return customer.flights[flightIndex].name;
    }

    function getCustomerFlightPrice(address addr, uint flightIndex) public view returns (uint) {
        Customer memory customer = customers[addr];

        return customer.flights[flightIndex].price;
    }

    function buyFlight(uint flightIndex) public payable {
        Flight memory flight = flights[flightIndex];
        require(msg.value == flight.price, "Incorrect price");

        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.flights.push(flight);

        emit FlightPurchased(msg.sender, flight.price);
    }

    function totalFlights() public view returns (uint) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getRefundableEther() public view returns (uint) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    function getAirlineBalance() public isOwner view returns (uint) {
        return address(this).balance;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Must be owner to call");
        _;
    }


}
