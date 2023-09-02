import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LendingContract from "./contracts/LendingPlatform.json";

function UserAccount({props}) {
  const [ web3, setContract, accounts, setSelectedAccount, selectedAccount ] =props
  console.log(props);
  //   const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [lendingBalance, setLendingBalance] = useState(0);
  const [borrowingBalance, setBorrowingBalance] = useState(0);
  //   const [accounts, setAccounts] = useState([]);
  //   const [contract, setContract] = useState(null);
  //   const [selectedAccount, setSelectedAccount] = useState("");
  //   const [initialLendingBalance, setInitialLendingBalance] = useState("");
  //   const [initialBorrowingBalance, setInitialBorrowingBalance] = useState("");

  useEffect(() => {
    // Fetch user balances when selected account changes
    async function fetchUserBalances() {
      if (web3 && selectedAccount) {
        // Replace with your contract address and ABI
        console.log("here");
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = LendingContract.networks[networkId];
        const contract = new web3.eth.Contract(
          LendingContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        console.log("here", contract);
        // Get user balances from the contract
        const userLendingBalance =
          await contract?.methods?.getUserBalance?.call({
            from: selectedAccount,
          });
        console.log(contract?.methods, userLendingBalance);

        console.log("here");

        setUserAddress(selectedAccount);
        setLendingBalance(userLendingBalance);
        // setBorrowingBalance(userBorrowingBalance);
        setContract(contract);
      }
    }

    fetchUserBalances();
  }, [web3, selectedAccount]);

  const handleAccountChange = e => {
    setSelectedAccount(e.target.value);
  };

  return (
    <div>
      <h2>User Account</h2>
      <div>
        <label>
          Select Account:
          <select value={selectedAccount} onChange={handleAccountChange}>
            {accounts.map(account => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p>Connected Ethereum Address: {userAddress}</p>
      <p> Balance: {lendingBalance} ETH</p>
    </div>
  );
}

export default UserAccount;
