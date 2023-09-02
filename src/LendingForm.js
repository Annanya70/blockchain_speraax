import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LendingContract from "./contracts/LendingPlatform.json";

function LendingForm({props}) {
  console.log(props);
  const [web3, account, lendingPlatformContract] = props;
  //   const [web3, setWeb3] = useState(null);
  //   const [account, setAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [operation, setOperation] = useState(""); // 'borrow', 'lend', or 'repay'

  const handleOperation = async () => {
    if (web3 && account) {
      console.log(account, "IN op", operation);
      try {
        // const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
        // const lendingPlatformContract = new web3.eth.Contract(
        //   LendingContract.abi,
        //   contractAddress
        // );

        if (operation === "borrow") {
          // Perform borrowing operation
          console.log(amount, "bnorrow", lendingPlatformContract);
          await lendingPlatformContract.methods
            .borrow(amount)
            .send({ from: account });
          console.log(`Borrowed ${amount} ETH`);
        } else if (operation === "lend") {
          // Perform lending operation
          await lendingPlatformContract.methods
            .lend()
            .send({ from: account, value: amount });
          console.log(`Lent ${amount} ETH`);
        } else if (operation === "repay") {
          // Perform repayment operation
          // Replace '_loanIndex' with the actual loan index you want to repay
          const _loanIndex = 0; // Replace with the loan index you want to repay
          await lendingPlatformContract.methods
            .repay(_loanIndex)
            .send({ from: account, value: amount });
          console.log(`Repaid ${amount} ETH for loan ${_loanIndex}`);
        }

        // Reset form fields
        setAmount(0);
        setOperation("");
      } catch (error) {
        console.error("Error performing operation:", error);
      }
    } else {
      console.error("Web3 is not initialized.");
    }
  };

  return (
    <div>
      <h2>Lending Form</h2>
      <div>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Operation:
          <select
            value={operation}
            onChange={e => setOperation(e.target.value)}>
            <option value="borrow">Borrow</option>
            <option value="lend">Lend</option>
            <option value="repay">Repay</option>
          </select>
        </label>
      </div>
      <button onClick={handleOperation}>Submit</button>
    </div>
  );
}

export default LendingForm;
