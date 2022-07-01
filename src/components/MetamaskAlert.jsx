import React from "react";
import "./css/MetamaskAlert.scss";
import MetamaskLogo from "../images/MetaMask_Fox.webp";
import ABLogo from "../images/logo3.png";

const MetamaskAlert = () => {
  return (
    <div className="metamask-container">
      <div className="metamask-alert-heading-container">
        <img className="ab-logo" src={ABLogo} alt="ab-logo" />

        <div className="metamask-alert-heading">
          Welcome to Krypto
          <br />
          <span>Eth Transfer App</span>
        </div>
      </div>
      <span>Please install MetaMask to run Krpto Application</span>
      <span className="metamask-logo-container">
        <a
          href="https://metamask.io/download/"
          className="floating"
          target="_blank"
          rel="noreferrer"
        >
          <img
            className="metamask-logo"
            src={MetamaskLogo}
            alt="MetaMask-Logo"
          />
          MetaMask
        </a>
      </span>
    </div>
  );
};

export default MetamaskAlert;
