// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    address public owner;
    uint256 public lendingRate; // Static interest rate in percentage
    uint256 public totalLentAmount;

    struct Loan {
        uint256 amount;
        uint256 interestRate;
        address borrower;
        bool isClosed;
    }

    mapping(address => Loan[]) public loans;

    event Borrowed(address indexed borrower, uint256 amount);
    event Lent(address indexed lender, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);

    constructor(uint256 _lendingRate) {
        owner = msg.sender;
        lendingRate = _lendingRate;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function borrow(uint256 _amount) external {
        require(_amount > 0, "Borrowed amount must be greater than 0");

        // Calculate the interest to be repaid
        uint256 interest = (_amount * lendingRate) / 100;
        uint256 totalToRepay = _amount + interest;

        // Ensure the borrower has enough collateral
        require(totalToRepay <= address(this).balance, "Not enough collateral to borrow");

        // Create a new loan
        Loan memory newLoan = Loan(_amount, lendingRate, msg.sender, false);
        loans[msg.sender].push(newLoan);
        totalLentAmount += _amount;

        // Emit the Borrowed event
        emit Borrowed(msg.sender, _amount);
    }

    function lend() external payable {
        require(msg.value > 0, "Lent amount must be greater than 0");

        // Update total lent amount
        totalLentAmount += msg.value;

        // Emit the Lent event
        emit Lent(msg.sender, msg.value);
    }

    function repay(uint256 _loanIndex) external payable {
        require(msg.value > 0, "Repayment amount must be greater than 0");

        Loan storage loan = loans[msg.sender][_loanIndex];
        require(!loan.isClosed, "Loan is already closed");

        uint256 amountToRepay = loan.amount;
        uint256 interest = (amountToRepay * loan.interestRate) / 100;
        uint256 totalToRepay = amountToRepay + interest;

        require(msg.value == totalToRepay, "Incorrect repayment amount");

        // Transfer the interest to the contract owner
        payable(owner).transfer(interest);

        // Mark the loan as closed
        loan.isClosed = true;

        // Emit the Repaid event
        emit Repaid(msg.sender, amountToRepay);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
