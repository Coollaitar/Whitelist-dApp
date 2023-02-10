// STEP : 1 -> Write Contract

//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract Whitelist {

    uint8 public maxWhitelistedAddresses;

    // create mapping 
    mapping(address => bool) public whitelistedAddresses;

    uint8 public numAddressesWhitelisted;

    // max number 
    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    // add address to whitelist - address of the sender to the whitelist
function addAddressToWhitelist() public {
        // check if the user has already been whitelisted
        require(!whitelistedAddresses[msg.sender], "Sender has already been whitelisted");
        // check if the numAddressesWhitelisted < maxWhitelistedAddresses, if not then throw an error.
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cant be added, limit reached");
        // Add the address which called the function to the whitelistedAddress array
        whitelistedAddresses[msg.sender] = true;
        // Increase the number of whitelisted addresses
        numAddressesWhitelisted += 1;
    }


}