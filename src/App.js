// Import necessary libraries and components

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LendingContract from "./contracts/LendingPlatform.json";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [lendingContract, setLendingContract] = useState(null);
  const [borrowAmount, setBorrowAmount] = useState(0);
  const [lendAmount, setLendAmount] = useState(0);

  useEffect(() => {
    // Connect to Ethereum using MetaMask or any other provider
    async function loadBlockchainData() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        // const accounts = await web3Instance.eth.requestAccounts();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    //     const account = await window.ethereum.request({
    //       method: 'eth_requestAccounts',
    //  })
     console.log("test")
     const networkId = await web3Instance.eth.net.getId();
     console.log("test")
     console.log("test")
     const deployedNetwork = LendingContract.networks[networkId];
     console.log("test")
     const lendingContractInstance = new web3Instance.eth.Contract(LendingContract.abi, deployedNetwork && deployedNetwork.address);
     setWeb3(web3Instance);
     setAccounts(accounts);
     setLendingContract(lendingContractInstance);
     console.log(accounts,web3Instance,lendingContractInstance)
    } else {
      window.alert("Please install MetaMask or use a web3-enabled browser.");
      }
    }
    loadBlockchainData();
  }, []);

  const handleBorrow = async () => {
    if (lendingContract) {
      try {
        await lendingContract.methods.borrow(borrowAmount).send({ from: accounts[0] });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleLend = async () => {
    if (lendingContract) {
      try {
        await lendingContract.methods.lend().send({ from: accounts[0], value: lendAmount });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="App">
      <h1>Basic Borrowing and Lending DApp</h1>
      <p>Connected Account: {accounts[0]}</p>

      <div>
        <h2>Borrow</h2>
        <input type="number" placeholder="Enter the amount to borrow" value={borrowAmount} onChange={(e) => setBorrowAmount(e.target.value)} />
        <button onClick={handleBorrow}>Borrow</button>
      </div>

      <div>
        <h2>Lend</h2>
        <input type="number" placeholder="Enter the amount to lend" value={lendAmount} onChange={(e) => setLendAmount(e.target.value)} />
        <button onClick={handleLend}>Lend</button>
      </div>

      {/* Display lending positions and other information */}
    </div>
  );
};

export default App;
