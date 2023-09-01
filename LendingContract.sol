// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingContract {
    address public owner;
    uint256 public lendingRate; // Static interest rate in percentage
    uint256 public totalLentAmount;
    
    struct Lender {
        uint256 lentAmount;
        bool exists;
    }
    
    mapping(address => Lender) public lenders;
    
    event Borrowed(address indexed borrower, uint256 amount);
    event Lent(address indexed lender, uint256 amount);
    
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
        require(!lenders[msg.sender].exists, "You are already a lender");
        
        // Calculate the interest to be repaid
        uint256 interest = (_amount * lendingRate) / 100;
        uint256 totalToRepay = _amount + interest;
        
        require(totalToRepay <= address(this).balance, "Not enough funds in the contract to borrow");
        
        // Update lender's data
        lenders[msg.sender] = Lender(_amount, true);
        totalLentAmount += _amount;
        
        // Emit the Borrowed event
        emit Borrowed(msg.sender, _amount);
    }
    
    function lend() external payable {
        require(msg.value > 0, "Lent amount must be greater than 0");
        require(!lenders[msg.sender].exists, "You are already a borrower");
        
        // Update lender's data
        lenders[msg.sender] = Lender(msg.value, true);
        totalLentAmount += msg.value;
        
        // Emit the Lent event
        emit Lent(msg.sender, msg.value);
    }
    
    function repay() external payable {
        require(msg.value > 0, "Repayment amount must be greater than 0");
        require(lenders[msg.sender].exists, "You are not a borrower");
        
        uint256 amountToRepay = lenders[msg.sender].lentAmount;
        uint256 interest = (amountToRepay * lendingRate) / 100;
        uint256 totalToRepay = amountToRepay + interest;
        
        require(msg.value == totalToRepay, "Incorrect repayment amount");
        
        // Transfer the interest to the contract owner
        payable(owner).transfer(interest);
        
        // Clear borrower's data
        delete lenders[msg.sender];
        totalLentAmount -= amountToRepay;
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
