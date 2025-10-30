// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BitSaveRegistry
 * @notice Maps usernames to wallet addresses for easy P2P payments
 * @dev Used by Send feature to resolve "send to @username"
 */
contract BitSaveRegistry {
    // Username => Address mapping
    mapping(string => address) public usernameToAddress;
    mapping(address => string) public addressToUsername;

    event UsernameRegistered(string indexed username, address indexed userAddress);
    event UsernameUpdated(string oldUsername, string indexed newUsername, address indexed userAddress);

    /**
     * @notice Register a username
     * @param username Desired username (must be unique)
     */
    function registerUsername(string calldata username) external {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(bytes(username).length <= 20, "Username too long (max 20 chars)");
        require(usernameToAddress[username] == address(0), "Username already taken");

        // If user already has a username, remove old mapping
        string memory oldUsername = addressToUsername[msg.sender];
        if (bytes(oldUsername).length > 0) {
            delete usernameToAddress[oldUsername];
            emit UsernameUpdated(oldUsername, username, msg.sender);
        } else {
            emit UsernameRegistered(username, msg.sender);
        }

        // Set new mappings
        usernameToAddress[username] = msg.sender;
        addressToUsername[msg.sender] = username;
    }

    /**
     * @notice Resolve username to address
     * @param username Username to look up
     * @return userAddress Address associated with username
     */
    function resolveUsername(string calldata username) external view returns (address userAddress) {
        userAddress = usernameToAddress[username];
        require(userAddress != address(0), "Username not found");
    }

    /**
     * @notice Get username for an address
     * @param userAddress Address to look up
     * @return username Username associated with address (empty if not registered)
     */
    function getUsernameByAddress(address userAddress) external view returns (string memory username) {
        username = addressToUsername[userAddress];
    }

    /**
     * @notice Check if username is available
     * @param username Username to check
     * @return available True if username is available
     */
    function isUsernameAvailable(string calldata username) external view returns (bool available) {
        available = usernameToAddress[username] == address(0);
    }
}
