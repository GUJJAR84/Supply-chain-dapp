import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import "./AddMed.css";

function AddMed() {
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
  const [MedName, setMedName] = useState("");
  const [MedDes, setMedDes] = useState("");

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
      <div className="wait">
        <h1>Loading...</h1>
      </div>
    );
  }

  const redirect_to_home = () => history.push("/");

  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    if (!MedName || !MedDes) {
      alert("Please fill in all fields");
      return;
    }
    
    try {
      setloader(true);
      var reciept = await SupplyChain.methods
        .addMedicine(MedName, MedDes)
        .send({ from: currentaccount });
      if (reciept) {
        setMedName("");
        setMedDes("");
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occurred: " + err.message);
      setloader(false);
    }
  };

  return (
    <div className="add-med-container">
      <div className="add-med-header">
        <h3>Product Orders</h3>
        <div className="account-info">
          Account: {currentaccount.substring(0, 6)}...{currentaccount.substring(38)}
        </div>
      </div>

      <button onClick={redirect_to_home} className="btn btn-outline-primary">
        Back to Home
      </button>

      <div className="add-med-card">
        <div className="card-header">
          <h4>Create New Product Order</h4>
        </div>
        <div className="card-body">
          <form className="add-med-form" onSubmit={handlerSubmitMED}>
            <div className="form-group">
              <label>Product Name</label>
              <input
                className="form-control"
                type="text"
                value={MedName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                className="form-control"
                type="text"
                value={MedDes}
                onChange={(e) => setMedDes(e.target.value)}
                placeholder="Enter product description"
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              Create Order
            </button>
          </form>
        </div>
      </div>

      <div className="add-med-card">
        <div className="card-header">
          <h4>Current Product Orders</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="add-med-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Current Stage</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(MED).map(function (key) {
                  return (
                    <tr key={key}>
                      <td>{MED[key].id}</td>
                      <td>{MED[key].name}</td>
                      <td>{MED[key].description}</td>
                      <td>
                        <span className="badge badge-info">
                          {MedStage[key]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMed;