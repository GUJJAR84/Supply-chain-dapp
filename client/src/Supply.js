import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import "./Supply.css";

function Supply() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(
        SupplyChainABI.abi,
        networkData.address
      );
      setSupplyChain(supplychain);
      var i;
      const medCtr = await supplychain.methods.medicineCtr().call();
      const med = {};
      const medStage = [];
      for (i = 0; i < medCtr; i++) {
        med[i] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };
  if (loader) {
    return (
      <div>
        <h1 className="wait">Loading...</h1>
      </div>
    );
  }
  const redirect_to_home = () => {
    history.push("/");
  };
  const handlerChangeID = (event) => {
    setID(event.target.value);
  };
  const handlerSubmitRMSsupply = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .RMSsupply(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitManufacturing = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Manufacturing(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitDistribute = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Distribute(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitRetail = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .Retail(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  const handlerSubmitSold = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .sold(ID)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  return (
    <div className="supply-container">
      <div className="supply-header">
        <span className="current-account">
          <b>Current Account Address:</b> {currentaccount}
        </span>
        <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">
          HOME
        </button>
      </div>

      <div className="supply-flow">
        <h6><b>Supply Chain Flow:</b></h6>
        <p>
          Goods Order → Raw Material Supplier → Manufacturer → Distributor → Retailer → Consumer
        </p>
      </div>

      <table className="supply-table">
        <thead>
          <tr>
            <th scope="col">Goods ID</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Current Processing Stage</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(MED).map(function (key) {
            return (
              <tr key={key}>
                <td>{MED[key].id}</td>
                <td>{MED[key].name}</td>
                <td>{MED[key].description}</td>
                <td><span className="stage-badge">{MedStage[key]}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="step-section">
        <h5><b>Step 1: Supply Raw Materials</b> (Only a registered Raw Material Supplier can perform this step)</h5>
        <form className="step-form" onSubmit={handlerSubmitRMSsupply}>
          <input
            type="text"
            onChange={handlerChangeID}
            placeholder="Enter Goods ID"
            required
          />
          <button type="submit" className="btn btn-outline-success">
            Supply
          </button>
        </form>
      </div>

      <div className="divider" />

      <div className="step-section">
        <h5><b>Step 2: Manufacture</b> (Only a registered Manufacturer can perform this step)</h5>
        <form className="step-form" onSubmit={handlerSubmitManufacturing}>
          <input
            type="text"
            onChange={handlerChangeID}
            placeholder="Enter Goods ID"
            required
          />
          <button type="submit" className="btn btn-outline-success">
            Manufacture
          </button>
        </form>
      </div>

      <div className="divider" />

      <div className="step-section">
        <h5><b>Step 3: Distribute</b> (Only a registered Distributor can perform this step)</h5>
        <form className="step-form" onSubmit={handlerSubmitDistribute}>
          <input
            type="text"
            onChange={handlerChangeID}
            placeholder="Enter Goods ID"
            required
          />
          <button type="submit" className="btn btn-outline-success">
            Distribute
          </button>
        </form>
      </div>

      <div className="divider" />

      <div className="step-section">
        <h5><b>Step 4: Retail</b> (Only a registered Retailer can perform this step)</h5>
        <form className="step-form" onSubmit={handlerSubmitRetail}>
          <input
            type="text"
            onChange={handlerChangeID}
            placeholder="Enter Goods ID"
            required
          />
          <button type="submit" className="btn btn-outline-success">
            Retail
          </button>
        </form>
      </div>

      <div className="divider" />

      <div className="step-section">
        <h5><b>Step 5: Mark as sold</b> (Only a registered Retailer can perform this step)</h5>
        <form className="step-form" onSubmit={handlerSubmitSold}>
          <input
            type="text"
            onChange={handlerChangeID}
            placeholder="Enter Goods ID"
            required
          />
          <button type="submit" className="btn btn-outline-success">
            Sold
          </button>
        </form>
      </div>
    </div>
  );
}

export default Supply;