// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IBitSaveRegistry {
    function resolveUsername(string calldata username) external view returns (address);
}

/**
 * @title BitSavePayments
 * @notice Handles P2P MUSD transfers and purchase tracking
 * @dev Integrates with BitSaveRegistry for username-based payments
 */
contract BitSavePayments is ReentrancyGuard {
    IERC20 public immutable musdToken;
    IBitSaveRegistry public immutable registry;

    // Payment tracking
    struct Payment {
        address from;
        address to;
        uint256 amount;
        string note;
        uint256 timestamp;
        PaymentType paymentType;
    }

    enum PaymentType { P2P, AIRTIME, DATA, GIFTCARD }

    Payment[] public payments;
    mapping(address => uint256[]) public userPayments;

    event PaymentSent(
        uint256 indexed paymentId,
        address indexed from,
        address indexed to,
        uint256 amount,
        PaymentType paymentType,
        string note
    );

    constructor(address _musdToken, address _registry) {
        require(_musdToken != address(0), "Invalid MUSD address");
        require(_registry != address(0), "Invalid registry address");
        musdToken = IERC20(_musdToken);
        registry = IBitSaveRegistry(_registry);
    }

    /**
     * @notice Send MUSD to a username
     * @param username Recipient's username
     * @param amount Amount of MUSD to send
     * @param note Optional payment note
     * @return paymentId ID of the payment
     */
    function sendToUsername(
        string calldata username,
        uint256 amount,
        string calldata note
    ) external nonReentrant returns (uint256 paymentId) {
        // Resolve username to address
        address recipient = registry.resolveUsername(username);
        return _sendPayment(recipient, amount, note, PaymentType.P2P);
    }

    /**
     * @notice Send MUSD directly to an address
     * @param recipient Recipient's address
     * @param amount Amount of MUSD to send
     * @param note Optional payment note
     * @return paymentId ID of the payment
     */
    function sendToAddress(
        address recipient,
        uint256 amount,
        string calldata note
    ) external nonReentrant returns (uint256 paymentId) {
        return _sendPayment(recipient, amount, note, PaymentType.P2P);
    }

    /**
     * @notice Record a purchase (airtime, data, gift card)
     * @param amount Amount spent in MUSD
     * @param purchaseType Type of purchase
     * @param details Purchase details (e.g., phone number, product ID)
     * @return paymentId ID of the purchase record
     */
    function recordPurchase(
        uint256 amount,
        PaymentType purchaseType,
        string calldata details
    ) external nonReentrant returns (uint256 paymentId) {
        require(
            purchaseType == PaymentType.AIRTIME ||
            purchaseType == PaymentType.DATA ||
            purchaseType == PaymentType.GIFTCARD,
            "Invalid purchase type"
        );

        // Transfer MUSD to contract (backend will handle Bitrefill fulfillment)
        require(
            musdToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // Record payment
        paymentId = payments.length;
        payments.push(Payment({
            from: msg.sender,
            to: address(this), // Contract holds until fulfillment
            amount: amount,
            note: details,
            timestamp: block.timestamp,
            paymentType: purchaseType
        }));

        userPayments[msg.sender].push(paymentId);

        emit PaymentSent(paymentId, msg.sender, address(this), amount, purchaseType, details);
    }

    /**
     * @notice Get user's payment history
     * @param user Address of user
     * @return paymentIds Array of payment IDs
     */
    function getUserPayments(address user) external view returns (uint256[] memory paymentIds) {
        paymentIds = userPayments[user];
    }

    /**
     * @notice Get payment details
     * @param paymentId ID of payment
     * @return payment Payment struct
     */
    function getPayment(uint256 paymentId) external view returns (Payment memory payment) {
        require(paymentId < payments.length, "Invalid payment ID");
        payment = payments[paymentId];
    }

    /**
     * @notice Get total number of payments
     * @return count Total payment count
     */
    function getTotalPayments() external view returns (uint256 count) {
        count = payments.length;
    }

    /**
     * @notice Get recent payments (last N payments)
     * @param count Number of recent payments to retrieve
     * @return recentPayments Array of recent payment IDs
     */
    function getRecentPayments(uint256 count) external view returns (uint256[] memory recentPayments) {
        uint256 total = payments.length;
        uint256 returnCount = count > total ? total : count;

        recentPayments = new uint256[](returnCount);
        for (uint256 i = 0; i < returnCount; i++) {
            recentPayments[i] = total - returnCount + i;
        }
    }

    // Internal function for sending payments
    function _sendPayment(
        address recipient,
        uint256 amount,
        string calldata note,
        PaymentType paymentType
    ) internal returns (uint256 paymentId) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");

        // Transfer MUSD
        require(
            musdToken.transferFrom(msg.sender, recipient, amount),
            "Transfer failed"
        );

        // Record payment
        paymentId = payments.length;
        payments.push(Payment({
            from: msg.sender,
            to: recipient,
            amount: amount,
            note: note,
            timestamp: block.timestamp,
            paymentType: paymentType
        }));

        userPayments[msg.sender].push(paymentId);
        userPayments[recipient].push(paymentId);

        emit PaymentSent(paymentId, msg.sender, recipient, amount, paymentType, note);
    }
}
