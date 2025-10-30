// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BitSaveVault (Budget Vault)
 * @notice Users lock MUSD in budgeting vaults with spending limits
 * @dev Complements MUSD - doesn't compete with Mezo's Savings Rate
 *
 * Purpose: Help users manage MUSD with budgeting features
 * - Lock MUSD for savings goals (travel, emergency fund, etc.)
 * - Set unlock dates (enforced savings)
 * - Track multiple savings goals
 *
 * Note: For yield, users should use Mezo's native MUSD Savings Rate
 * This vault is for BUDGETING, not yield generation
 */
contract BitSaveVault is ReentrancyGuard {
    IERC20 public immutable musdToken;

    struct SavingsGoal {
        string name;           // e.g., "Emergency Fund", "Vacation"
        uint256 amount;        // Total MUSD deposited
        uint256 targetAmount;  // Goal amount
        uint256 unlockTime;    // When funds can be withdrawn (0 = anytime)
        bool isActive;
    }

    // User address => Goal ID => Savings Goal
    mapping(address => mapping(uint256 => SavingsGoal)) public savingsGoals;
    mapping(address => uint256) public goalCount;

    event GoalCreated(
        address indexed user,
        uint256 indexed goalId,
        string name,
        uint256 targetAmount,
        uint256 unlockTime
    );

    event Deposited(
        address indexed user,
        uint256 indexed goalId,
        uint256 amount
    );

    event Withdrawn(
        address indexed user,
        uint256 indexed goalId,
        uint256 amount
    );

    constructor(address _musdToken) {
        require(_musdToken != address(0), "Invalid MUSD address");
        musdToken = IERC20(_musdToken);
    }

    /**
     * @notice Create a new savings goal
     * @param name Goal name (e.g., "Emergency Fund")
     * @param targetAmount Target amount in MUSD
     * @param unlockTime Unix timestamp when funds unlock (0 = no lock)
     */
    function createGoal(
        string calldata name,
        uint256 targetAmount,
        uint256 unlockTime
    ) external returns (uint256 goalId) {
        require(bytes(name).length > 0, "Name required");
        require(targetAmount > 0, "Target must be > 0");

        if (unlockTime > 0) {
            require(unlockTime > block.timestamp, "Unlock must be future");
        }

        goalId = goalCount[msg.sender];

        savingsGoals[msg.sender][goalId] = SavingsGoal({
            name: name,
            amount: 0,
            targetAmount: targetAmount,
            unlockTime: unlockTime,
            isActive: true
        });

        goalCount[msg.sender]++;

        emit GoalCreated(msg.sender, goalId, name, targetAmount, unlockTime);
    }

    /**
     * @notice Deposit MUSD into a savings goal
     * @param goalId ID of the savings goal
     * @param amount Amount of MUSD to deposit
     */
    function deposit(uint256 goalId, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(goalId < goalCount[msg.sender], "Invalid goal ID");

        SavingsGoal storage goal = savingsGoals[msg.sender][goalId];
        require(goal.isActive, "Goal not active");

        // Transfer MUSD from user to vault
        require(
            musdToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        goal.amount += amount;

        emit Deposited(msg.sender, goalId, amount);
    }

    /**
     * @notice Withdraw MUSD from a savings goal
     * @param goalId ID of the savings goal
     * @param amount Amount to withdraw (0 = withdraw all)
     */
    function withdraw(uint256 goalId, uint256 amount) external nonReentrant {
        require(goalId < goalCount[msg.sender], "Invalid goal ID");

        SavingsGoal storage goal = savingsGoals[msg.sender][goalId];
        require(goal.isActive, "Goal not active");
        require(goal.amount > 0, "No funds");

        // Check unlock time
        if (goal.unlockTime > 0) {
            require(block.timestamp >= goal.unlockTime, "Goal still locked");
        }

        uint256 withdrawAmount = (amount == 0) ? goal.amount : amount;
        require(withdrawAmount <= goal.amount, "Insufficient balance");

        goal.amount -= withdrawAmount;

        // Transfer MUSD back to user
        require(
            musdToken.transfer(msg.sender, withdrawAmount),
            "Transfer failed"
        );

        emit Withdrawn(msg.sender, goalId, withdrawAmount);
    }

    /**
     * @notice Get all savings goals for a user
     * @param user Address of user
     * @return goals Array of all savings goals
     */
    function getUserGoals(address user) external view returns (SavingsGoal[] memory goals) {
        uint256 count = goalCount[user];
        goals = new SavingsGoal[](count);

        for (uint256 i = 0; i < count; i++) {
            goals[i] = savingsGoals[user][i];
        }
    }

    /**
     * @notice Get total savings across all goals
     * @param user Address of user
     * @return total Total MUSD saved
     */
    function getTotalSavings(address user) external view returns (uint256 total) {
        uint256 count = goalCount[user];

        for (uint256 i = 0; i < count; i++) {
            if (savingsGoals[user][i].isActive) {
                total += savingsGoals[user][i].amount;
            }
        }
    }

    /**
     * @notice Close a savings goal (must be empty)
     * @param goalId ID of goal to close
     */
    function closeGoal(uint256 goalId) external {
        require(goalId < goalCount[msg.sender], "Invalid goal ID");

        SavingsGoal storage goal = savingsGoals[msg.sender][goalId];
        require(goal.amount == 0, "Goal must be empty");

        goal.isActive = false;
    }
}
