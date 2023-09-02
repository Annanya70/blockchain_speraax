// App.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LendingContract from "./contracts/LendingPlatform.json";
import UserAccount from "./UserAccount";
import LendingForm from "./LendingForm";

function App1() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("");
  //   const [initialLendingBalance, setInitialLendingBalance] = useState("");
  //   const [initialBorrowingBalance, setInitialBorrowingBalance] = useState("");

  useEffect(() => {
    // Initialize Web3 and fetch accounts on component mount
    async function initializeWeb3() {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable(); // Request Ethereum wallet access
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setAccounts(accounts);
          if (accounts.length > 0) {
            setSelectedAccount(accounts[0]); // Default to the first account
          }
        } catch (error) {
          console.error("Error initializing Web3:", error);
        }
      } else {
        console.error(
          "Ethereum provider not found. Please install Metamask or another Ethereum wallet."
        );
      }
    }

    initializeWeb3();
  }, []);
  const connectWeb3 = async () => {
    if (web3) {
      try {
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        setSelectedAccount(address);
      } catch (error) {
        console.error("Error connecting to Web3:", error);
      }
    }
  };
  console.log(web3, accounts, selectedAccount);
  return (
    <div className="App">
      <h1>Lending Platform</h1>
      <button onClick={connectWeb3}>Connect to Web3</button>
{/* 
      <UserAccount
        props={[
          web3,
          setContract,
          accounts,
          setSelectedAccount,
          selectedAccount,
        ]}
      /> */}
      
      <LendingForm props={[web3, selectedAccount, contract]} />
    </div>
  );
}

export default App1;
