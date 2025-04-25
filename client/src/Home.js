import React from "react";
import { useHistory } from "react-router-dom";
import "./Home.css";

function Home() {
  const history = useHistory();
  
  const redirect = (path) => {
    history.push(path);
  };

  return (
    <div className="home-container">
      <h3>Supply Chain Flow</h3>
      
      <h6>
        (Note: Here <u>Owner</u> is the person who deployed the smart contract
        on the blockchain)
      </h6>
      
      <div className="step-container">
        <div className="step-header">
          <div className="step-icon">1</div>
          <h5>Register Participants</h5>
        </div>
        <h6>Owner should register Raw Material Suppliers, Manufacturers, Distributors and Retailers</h6>
        <h6>(Note: This is a one time step. Skip to step 2 if already done)</h6>
        <button
          onClick={() => redirect("/roles")}
          className="btn btn-outline-primary btn-sm"
        >
          Register
        </button>
      </div>
      
      <div className="step-container">
        <div className="step-header">
          <div className="step-icon">2</div>
          <h5>Order Goods</h5>
        </div>
        <h6>Owner should place orders for goods to be manufactured</h6>
        <button
          onClick={() => redirect("/addmed")}
          className="btn btn-outline-primary btn-sm"
        >
          Order Goods
        </button>
      </div>
      
      <div className="step-container">
        <div className="step-header">
          <div className="step-icon">3</div>
          <h5>Control Supply Chain</h5>
        </div>
        <h6>Manage the flow of goods through the supply chain</h6>
        <button
          onClick={() => redirect("/supply")}
          className="btn btn-outline-primary btn-sm"
        >
          Control Supply Chain
        </button>
      </div>
      
      <div className="track-section">
        <h5><b>Track the Goods</b></h5>
        <h6>Monitor the status and location of goods in the supply chain</h6>
        <button
          onClick={() => redirect("/track")}
          className="btn btn-outline-primary btn-sm"
        >
          Track Goods
        </button>
      </div>
    </div>
  );
}

export default Home;