// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    address public owner;
    uint256 public lendingRate; // Static interest rate in percentage

    struct Loan {
        uint256 amount;
        uint256 interestRate;
        address lender;
        address borrower;
        bool isClosed;
    }

    struct User {
        uint256 balance; // Single balance per user
    }

    mapping(address => Loan[]) public loans;
    mapping(address => User) public users; // Mapping to store user balances

    event Borrowed(address indexed borrower, address indexed lender, uint256 amount);
    event Repaid(address indexed borrower, address indexed lender, uint256 amount);
    event BalanceSet(address indexed user, uint256 newBalance);

    constructor(uint256 _lendingRate) {
        owner = msg.sender;
        lendingRate = _lendingRate;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Function to create a user account with initial balance
    function createUserAccount(uint256 _initialBalance) external {
        require(_initialBalance >= 0, "Initial balance must be non-negative");

        require(users[msg.sender].balance == 0, "User account already exists");

        users[msg.sender].balance = _initialBalance;
    }

    function lendToUser(address _borrower, uint256 _amount) external {
        require(_amount > 0, "Lent amount must be greater than 0");
        require(_borrower != address(0), "Borrower address must be valid");

        uint256 lenderBalance = users[msg.sender].balance;
        uint256 borrowerBalance = users[_borrower].balance;

        require(lenderBalance >= _amount, "Not enough balance");

        // Calculate the interest to be repaid
        uint256 interest = (_amount * lendingRate) / 100;
        uint256 totalToRepay = _amount + interest;

        // Create a new loan
        Loan memory newLoan = Loan(_amount, lendingRate, msg.sender, _borrower, false);
        loans[_borrower].push(newLoan);

        // Update user balances
        users[msg.sender].balance -= _amount;
        users[_borrower].balance += totalToRepay;

        // Emit the Borrowed event
        emit Borrowed(_borrower, msg.sender, _amount);
    }

    function borrowFromUser(address _lender, uint256 _amount) external {
        require(_amount > 0, "Borrowed amount must be greater than 0");
        require(_lender != address(0), "Lender address must be valid");

        uint256 borrowerBalance = users[msg.sender].balance;
        uint256 lenderBalance = users[_lender].balance;

        require(lenderBalance >= _amount, "Not enough balance");

        // Calculate the interest to be repaid
        uint256 interest = (_amount * lendingRate) / 100;
        uint256 totalToRepay = _amount + interest;

        // Create a new loan
        Loan memory newLoan = Loan(_amount, lendingRate, _lender, msg.sender, false);
        loans[msg.sender].push(newLoan);

        // Update user balances
        users[msg.sender].balance += totalToRepay;
        users[_lender].balance -= _amount;

        // Emit the Borrowed event
        emit Borrowed(msg.sender, _lender, _amount);
    }

    function repayToLender(uint256 _loanIndex) external payable {
        require(msg.value > 0, "Repayment amount must be greater than 0");

        Loan storage loan = loans[msg.sender][_loanIndex];
        require(!loan.isClosed, "Loan is already closed");

        uint256 amountToRepay = loan.amount;
        uint256 interest = (amountToRepay * loan.interestRate) / 100;
        uint256 totalToRepay = amountToRepay + interest;

        require(msg.value == totalToRepay, "Incorrect repayment amount");

        // Transfer the interest to the lender
        payable(loan.lender).transfer(interest);

        // Mark the loan as closed
        loan.isClosed = true;

        // Update user balances
        users[msg.sender].balance -= totalToRepay;
        users[loan.lender].balance += amountToRepay;

        // Emit the Repaid event
        emit Repaid(msg.sender, loan.lender, amountToRepay);
    }

    // Function to get the user's balance
    function getUserBalance() external view returns (uint256) {
        return users[msg.sender].balance;
    }
        // Function to set the user's balance
    function setUserBalance(uint256 _newBalance) external {
        users[msg.sender].balance = _newBalance;
        emit BalanceSet(msg.sender, _newBalance);
    }


    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
