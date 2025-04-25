import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import "./Track.css";

function Track() {
  const history = useHistory();
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();
  const [TrackTillSold, showTrackTillSold] = useState(false);
  const [TrackTillRetail, showTrackTillRetail] = useState(false);
  const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
  const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
  const [TrackTillRMS, showTrackTillRMS] = useState(false);
  const [TrackTillOrdered, showTrackTillOrdered] = useState(false);

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
        med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      const rmsCtr = await supplychain.methods.rmsCtr().call();
      const rms = {};
      for (i = 0; i < rmsCtr; i++) {
        rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
      }
      setRMS(rms);
      const manCtr = await supplychain.methods.manCtr().call();
      const man = {};
      for (i = 0; i < manCtr; i++) {
        man[i + 1] = await supplychain.methods.MAN(i + 1).call();
      }
      setMAN(man);
      const disCtr = await supplychain.methods.disCtr().call();
      const dis = {};
      for (i = 0; i < disCtr; i++) {
        dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
      }
      setDIS(dis);
      const retCtr = await supplychain.methods.retCtr().call();
      const ret = {};
      for (i = 0; i < retCtr; i++) {
        ret[i + 1] = await supplychain.methods.RET(i + 1).call();
      }
      setRET(ret);
      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const renderFlowStep = (title, data) => (
    <div className="flow-step">
      <h4><u>{title}</u></h4>
      <p><b>ID: </b>{data.id}</p>
      <p><b>Name:</b> {data.name}</p>
      <p><b>Place: </b>{data.place}</p>
    </div>
  );

  const renderGoodsInfo = () => (
    <div className="goods-info">
      <h3><b><u>Goods:</u></b></h3>
      <p><b>Goods ID: </b>{MED[ID].id}</p>
      <p><b>Name:</b> {MED[ID].name}</p>
      <p><b>Description: </b>{MED[ID].description}</p>
      <p><b>Current stage: </b><span className="stage-badge">{MedStage[ID]}</span></p>
    </div>
  );

  const renderActionButtons = () => (
    <div className="action-buttons">
      <button
        onClick={() => {
          showTrackTillSold(false);
          showTrackTillRetail(false);
          showTrackTillDistribution(false);
          showTrackTillManufacture(false);
          showTrackTillRMS(false);
          showTrackTillOrdered(false);
        }}
        className="btn btn-outline-success"
      >
        Track Another Item
      </button>
      <button
        onClick={() => history.push("/")}
        className="btn btn-outline-danger"
      >
        HOME
      </button>
    </div>
  );

  if (loader) {
    return <h1 className="wait">Loading...</h1>;
  }

  if (TrackTillSold) {
    return (
      <div className="track-container">
        <div className="track-header">
          <span className="current-account">
            <b>Current Account Address:</b> {currentaccount}
          </span>
          {renderActionButtons()}
        </div>

        {renderGoodsInfo()}

        <div className="supply-chain-flow">
          {renderFlowStep("Raw Materials Supplied by", RMS[MED[ID].RMSid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Manufactured by", MAN[MED[ID].MANid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Distributed by", DIS[MED[ID].DISid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Retailed by", RET[MED[ID].RETid])}
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <h4><u>Sold</u></h4>
            <p>Product has been sold to consumer</p>
          </div>
        </div>
      </div>
    );
  }

  if (TrackTillRetail) {
    return (
      <div className="track-container">
        <div className="track-header">
          <span className="current-account">
            <b>Current Account Address:</b> {currentaccount}
          </span>
          {renderActionButtons()}
        </div>

        {renderGoodsInfo()}

        <div className="supply-chain-flow">
          {renderFlowStep("Raw Materials Supplied by", RMS[MED[ID].RMSid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Manufactured by", MAN[MED[ID].MANid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Distributed by", DIS[MED[ID].DISid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Retailed by", RET[MED[ID].RETid])}
        </div>
      </div>
    );
  }

  if (TrackTillDistribution) {
    return (
      <div className="track-container">
        <div className="track-header">
          <span className="current-account">
            <b>Current Account Address:</b> {currentaccount}
          </span>
          {renderActionButtons()}
        </div>

        {renderGoodsInfo()}

        <div className="supply-chain-flow">
          {renderFlowStep("Raw Materials Supplied by", RMS[MED[ID].RMSid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Manufactured by", MAN[MED[ID].MANid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Distributed by", DIS[MED[ID].DISid])}
        </div>
      </div>
    );
  }

  if (TrackTillManufacture) {
    return (
      <div className="track-container">
        <div className="track-header">
          <span className="current-account">
            <b>Current Account Address:</b> {currentaccount}
          </span>
          {renderActionButtons()}
        </div>

        {renderGoodsInfo()}

        <div className="supply-chain-flow">
          {renderFlowStep("Raw Materials Supplied by", RMS[MED[ID].RMSid])}
          <div className="flow-arrow">→</div>
          {renderFlowStep("Manufactured by", MAN[MED[ID].MANid])}
        </div>
      </div>
    );
  }

  if (TrackTillRMS) {
    return (
      <div className="track-container">
        <div className="track-header">
          <span className="current-account">
            <b>Current Account Address:</b> {currentaccount}
          </span>
          {renderActionButtons()}
        </div>

        {renderGoodsInfo()}

        <div className="supply-chain-flow">
          {renderFlowStep("Raw Materials Supplied by", RMS[MED[ID].RMSid])}
        </div>
      </div>
    );
  }

  if (TrackTillOrdered) {
    return (
      <div className="track-container">
        <div className="track-header">
          <span className="current-account">
            <b>Current Account Address:</b> {currentaccount}
          </span>
          {renderActionButtons()}
        </div>

        <div className="goods-info">
          <h3><b><u>Goods:</u></b></h3>
          <p><b>Goods ID: </b>{MED[ID].id}</p>
          <p><b>Name:</b> {MED[ID].name}</p>
          <p><b>Description: </b>{MED[ID].description}</p>
          <p><b>Current stage: </b><span className="stage-badge">{MedStage[ID]}</span></p>
          <hr />
          <br />
          <h5>Goods Not Yet Processed...</h5>
        </div>
      </div>
    );
  }

  const handlerChangeID = (event) => {
    setID(event.target.value);
  };

  const handlerSubmit = async (event) => {
    event.preventDefault();
    var ctr = await SupplyChain.methods.medicineCtr().call();
    if (!(ID > 0 && ID <= ctr)) {
      alert("Invalid Medicine ID!!!");
    } else {
      if (MED[ID].stage == 5) showTrackTillSold(true);
      else if (MED[ID].stage == 4) showTrackTillRetail(true);
      else if (MED[ID].stage == 3) showTrackTillDistribution(true);
      else if (MED[ID].stage == 2) showTrackTillManufacture(true);
      else if (MED[ID].stage == 1) showTrackTillRMS(true);
      else showTrackTillOrdered(true);
    }
  };

  return (
    <div className="track-container">
      <div className="track-header">
        <span className="current-account">
          <b>Current Account Address:</b> {currentaccount}
        </span>
        <button onClick={() => history.push("/")} className="btn btn-outline-danger">
          HOME
        </button>
      </div>

      <table className="track-table">
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

      <div className="track-section">
        <h5>Enter Goods ID to Track it</h5>
        <form className="track-form" onSubmit={handlerSubmit}>
          <input
            type="text"
            onChange={handlerChangeID}
            placeholder="Enter Goods ID"
            required
          />
          <button type="submit" className="btn btn-outline-success">
            Track
          </button>
        </form>
      </div>
    </div>
  );
}

export default Track;