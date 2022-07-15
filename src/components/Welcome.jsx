import { useState, useEffect, useContext } from "react";
import ethereumLogo from "../images/weth.png";
import "./css/Welcome.scss";
import Loader from "./Loader";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortedAddress";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const Welcome = () => {
  const {
    connectWallet,
    currentAccount,
    formData,
    sendTransaction,
    handleChange,
    isLoading,
  } = useContext(TransactionContext);
  const [value, setValue] = useState("1");

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSubmit = (e) => {
    const { addressTo, amount, keyword, message } = formData;

    e.preventDefault();
    if (!currentAccount) {
      return toast("Please connect your wallet first");
    } else {
      if (!addressTo || !amount || !keyword || !message) {
        return toast("Please fill all the required data");
      }
    }

    sendTransaction();
  };

  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  let isPortrait =
    windowDimenion.winWidth < 700 ||
    windowDimenion.winWidth < windowDimenion.winHeight
      ? true
      : false;

  let welcomeStyle = isPortrait
    ? "welcome-portrait-view"
    : "welcome-desktop-view";

  const [tokenAddressTo, setTokenAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (!currentAccount) {
      return toast("Please connect your wallet first");
    } else {
      if (tokenAddressTo === "" || tokenAmount === "") {
        return toast("Please fill all the required data");
      }
    }
  };
  return (
    <div className={welcomeStyle}>
      <div className="welcome-left-side">
        <div className="welcome-left-side-container">
          <div className="welcome-heading">
            Send Crpto <br /> across the world
          </div>
          <div className="welcome-description">
            Explore the crypto world. Buy <br />
            and sell cryptocurrencies easily on Krypto.
          </div>
          {!currentAccount && (
            <div onClick={connectWallet} className="collect-wallet-button">
              Connect Wallet
            </div>
          )}
          {currentAccount && (
            <div className="collect-wallet-text">Your wallet is connected</div>
          )}
          <div className="table-container">
            <div className="table-row">
              <div className="table-1-1">Reliability</div>
              <div className="table-1-2">Security</div>
              <div className="table-1-3">Ethereum</div>
            </div>
            <div className="table-row">
              <div className="table-2-1">Web 3.0</div>
              <div className="table-2-2">Low Fees</div>
              <div className="table-2-3">Blockchain</div>
            </div>
          </div>
        </div>
      </div>
      <div className="welcome-right-side">
        <div className="welcome-ethereum-card">
          <div className="welcome-ethereum-top">
            <div className="welcome-ethereum-logo-container">
              <img
                src={ethereumLogo}
                alt="ethereumLogo"
                className="welcome-ethereum-logo"
              />
            </div>
            <div className="welcome-ethereum-card-info-container">
              <i className="fas fa-info"></i>
            </div>
          </div>
          <div className="welcome-ethereum-card-bottom">
            <div className="welcome-ethereum-card-address">
              {currentAccount ? shortenAddress(currentAccount) : "--"}
            </div>
            <div className="welcome-ethereum-card-label">Ethereum</div>
          </div>
        </div>
        <div className="welcome-form-fields">
          <div className="transfer-form-label">Transfer</div>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                <Tab label="ETH" value="1" disableRipple />
                <Tab label="Token" value="2" disableRipple />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className="welcome-form-eth-fields" id="transfer">
                <input
                  placeholder={"Address To"}
                  type={"text"}
                  name={"addressTo"}
                  onChange={(e) => {
                    handleChange(e, "addressTo");
                  }}
                  className="input-field"
                />
                <input
                  placeholder={"Amount"}
                  type={"number"}
                  name={"amount"}
                  step={"0.0001"}
                  onChange={(e) => {
                    handleChange(e, "amount");
                  }}
                  className="input-field"
                />
                <input
                  placeholder={"keyword"}
                  type={"text"}
                  name={"keyword"}
                  onChange={(e) => {
                    handleChange(e, "keyword");
                  }}
                  className="input-field"
                />
                <input
                  placeholder={"message"}
                  type={"text"}
                  name={"message"}
                  onChange={(e) => {
                    handleChange(e, "message");
                  }}
                  className="input-field"
                />
                <div
                  style={{
                    borderBottom: "2px solid rgb(216, 213, 213)",
                    marginTop: "1em",
                  }}
                />
                {isLoading ? (
                  <Loader />
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="submit-button"
                  >
                    Send Now
                  </button>
                )}
              </div>
            </TabPanel>
            <TabPanel value="2">
              {" "}
              <div className="welcome-form-eth-fields" id="transfer">
                <input
                  placeholder={"Address To"}
                  type={"text"}
                  name={"tokenAddressTo"}
                  onChange={(e) => {
                    setTokenAddress(e.target.value);
                  }}
                  className="input-field"
                />
                <input
                  placeholder={"Amount"}
                  type={"number"}
                  name={"tokenAmount"}
                  step={"0.0001"}
                  onChange={(e) => {
                    setTokenAmount(e.target.value);
                  }}
                  className="input-field"
                />
                <div
                  style={{
                    borderBottom: "2px solid rgb(216, 213, 213)",
                    marginTop: "1em",
                  }}
                />
                {isLoading ? (
                  <Loader />
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleTokenSubmit(e)}
                    className="submit-button"
                  >
                    Send Now
                  </button>
                )}
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Welcome;
