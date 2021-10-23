import React, { Component } from "react";
import SharedWalletContract from "./contracts/SharedWallet.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded:false, acc:0, contractBalance:0, owner:0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.sharedWallet = new this.web3.eth.Contract(
        SharedWalletContract.abi,
        SharedWalletContract.networks[this.networkId] && SharedWalletContract.networks[this.networkId].address,
      );

      var owner = this.accounts[0]
      console.log(owner);

      // var balance = await this.web3.eth.getBalance(this.accounts[0]);
      // balance = await this.web3.utils.fromWei(balance, "ether")
      // console.log(balance);

      var contractBalance = await this.web3.eth.getBalance(this.sharedWallet.options.address);
      contractBalance = await this.web3.utils.fromWei(contractBalance, "ether")
      console.log(contractBalance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded:true, owner: owner, contractBalance: contractBalance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  createTable = () => {
    let table = []

    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let children = []
      //Inner loop to create children
      for (let j = 0; j < 1; j++) {
        children.push(<td>{`Data ${i + 1}`}</td>)
      }
      //Create the parent and add the children
      table.push(<tr>{children}</tr>)
    }
    return table
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Shared Wallet</h1>
        <h2>Simple Shared Wallet Project</h2>

        <p>Owner Address : {this.state.owner}</p>
        {/* <p>Owner Balance : {this.state.balance} ETH</p> */}
        <p>Wallet Balance : {this.state.balance} ETH</p>

        <div>
          <input type="text" name="newMemberAddress" placeholder="new member address" />
          <input type="text" name="newMemberAllowance" placeholder="new member allowance" />
          <button type="button">Add new member</button>
        </div>

        <div className="row">
          <div className="column" style={{position: "absolute", left: "40px"}}>
            <p>Members' address</p>
            <div>
              {this.createTable()}
            </div>
          </div>
          <div className="column" style={{position: "absolute", left: "400px"}}>
            <p>Balance</p>
            <div>
              {this.createTable()}
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
