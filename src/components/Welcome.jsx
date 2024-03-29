import { useState, useEffect, useContext, useRef } from "react";
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

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHcY6FkWMeFDJtYBF-5Xb2gVmFqhjagxg",
  authDomain: "crypto-2ad45.firebaseapp.com",
  projectId: "crypto-2ad45",
  storageBucket: "crypto-2ad45.appspot.com",
  messagingSenderId: "319738015372",
  appId: "1:319738015372:web:0ec15bdc1d41ff4593d5a9",
  measurementId: "G-ZD3QSE0M09",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const Welcome = () => {
  const {
    connectWallet,
    currentAccount,
    formData,
    sendTransaction,
    handleChange,
    handleTokenChange,
    isLoading,
    sendToken,
    tokenTransferForm,
    handleAddressChange,
    tokenBalance,
    handleInputTokenSubmit,
    currentNetwork,
    tokenSymbol,
    ethBalance,
  } = useContext(TransactionContext);
  const [value, setValue] = useState("1");
  const tokenAddress = useRef("");
  const tokenAddressTo = useRef("");
  const numOfTokens = useRef("");

  const [username, setUsername] = useState("");

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSubmit = (e) => {
    const { addressTo, amount } = formData;

    e.preventDefault();
    if (!currentAccount) {
      return toast("Please connect your wallet first");
    } else {
      if (!addressTo || !amount) {
        return toast("Please fill all the required data");
      }
    }

    if (currentNetwork) {
    sendTransaction();
    } else {
      return toast("Please connect to BSC Testnet network");
    }
  };

  const handleTokenSubmit = (e) => {
    const { tokenAddress, tokenAddressTo, tokenAmount } = tokenTransferForm;
    e.preventDefault();
    if (!currentAccount) {
      return toast("Please connect your wallet first");
    } else {
      if (!tokenAddress || !tokenAddressTo || !tokenAmount) {
        return toast("Please fill all the required data");
      }

      if (currentNetwork) {
        sendToken();
      } else {
        return toast("Please connect to BSC Testnet network");
      }
    }
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        const urn = user.displayName;
        setUsername(urn);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

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

  const [balanceVisibility, setBalanceVisibility] = useState(false);
  const [balance, setBalance] = useState(null);

  const handleCheckBalance = (e) => {
    setBalance(e.target.value);
    handleAddressChange(e);
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
        <div className="flip-card-container">
          <div className="flip-card">
            <div className="flip-card-front">
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
                  <div className="welcome-ethereum-card-label">
                    <div>Ethereum</div>{" "}
                    <div className="card-holder-name">{username}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card-back">
              <div className="strip"></div>
              <div className="card-details">
                <div>
                  Eth Balance:{" "}
                  {ethBalance ? ethBalance.slice(0, 6) + " BNB" : "--"}
                </div>
              </div>
            </div>
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
              <div className="welcome-form-eth-fields" id="transfer">
                <input
                  ref={tokenAddress}
                  placeholder={"Token Address"}
                  type={"text"}
                  name={"tokenAddress"}
                  onChange={(e) => {
                    handleTokenChange(e, "tokenAddress");
                  }}
                  className="input-field"
                />
                <input
                  ref={tokenAddressTo}
                  placeholder={"Address To"}
                  type={"text"}
                  name={"tokenAddressTo"}
                  onChange={(e) => {
                    handleTokenChange(e, "tokenAddressTo");
                  }}
                  className="input-field"
                />
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <input
                    ref={numOfTokens}
                    placeholder={"Num of tokens"}
                    type={"number"}
                    name={"tokenAmount"}
                    onChange={(e) => {
                      handleTokenChange(e, "tokenAmount");
                    }}
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </div>

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
                    onClick={(e) => {
                      handleTokenSubmit(e);
                    }}
                    className="submit-button"
                  >
                    Send Now
                  </button>
                )}
                <div className="balance-supply-container">
                  <input
                    placeholder={"Token Address"}
                    type={"text"}
                    name={"address"}
                    onChange={(e) => {
                      handleCheckBalance(e);
                    }}
                    className="input-field"
                  />

                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        if (currentNetwork) {
                        handleInputTokenSubmit(e);
                        setBalanceVisibility(true);
                        } else {
                          return toast("Please connect to BSC Test network");
                        }

                        if (balance === "" || balance === null) {
                          return toast(
                            "Please enter token address to check the balance"
                          );
                        }
                      }}
                      className="submit-button"
                    >
                      Balance
                    </button>
                    <span>
                      {tokenBalance && balanceVisibility
                        ? tokenBalance + " " + tokenSymbol
                        : tokenBalance === 0
                        ? "No Balance"
                        : "--"}
                    </span>
                  </div>
                </div>
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
