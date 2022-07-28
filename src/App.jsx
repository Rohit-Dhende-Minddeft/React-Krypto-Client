import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import "./App.scss";
import MetamaskAlert from "./components/MetamaskAlert";
import { TransactionContext } from "../src/context/TransactionContext";
import { useContext, useEffect, useState } from "react";

const App = () => {
  const { isMetamaskInstalled, currentNetwork, currentAccount } =
    useContext(TransactionContext);
  let metamask = isMetamaskInstalled;
  const [network, setNetwork] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleChange = () => {
      window.location.reload();
    };
    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChange);
      window.ethereum.on("accountsChanged", handleChange);
    }
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
    };
    window.addEventListener("scroll", onScroll);
    if (window.document.documentElement.scrollTop > 80) {
      setScroll(true);
    } else {
      setScroll(false);
    }

    return () => {
      window?.ethereum?.removeListener("accountsChanged", handleChange);
      window?.ethereum?.removeListener("chainChanged", handleChange);
      window.removeEventListener("scroll", onScroll);
    };
  }, [network, metamask, scrolling, scroll, scrollTop]);

  const handleClick = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const handleNetworkSwitch = async (networkName) => {
    await changeNetwork({ networkName });
  };

  const changeNetwork = async ({ networkName }) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x61" }],
      });
      setNetwork(true);
      window.location.reload();
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x61",
                chainName: networkName,
                rpcUrls: [
                  "https://data-seed-prebsc-1-s1.binance.org:8545/",
                ] /* ... */,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          console.log(addError.code);
        }
      }
      // handle other "switch" errors
    }
  };

  return (
    <div className="app">
      {!isMetamaskInstalled && <MetamaskAlert />}
      {isMetamaskInstalled && (
        <div>
          {!currentNetwork && (
            <div>
              {currentAccount && (
                <div
                  className="check-network-label"
                  onClick={() => handleNetworkSwitch("BSC Testnet")}
                >
                  <i className="fas fa-exclamation-circle"></i>
                  Click to set BSC Testnet network
                </div>
              )}
            </div>
          )}
          <div className="navbar-welcome-services-container">
            <div className="landing-page">
              <Navbar />
              <Welcome />
            </div>
            <Services />
          </div>
          <Transactions />
          <Footer />
          {scroll && (
            <i
              className="fas fa-angle-double-up scroll-to-top"
              onClick={handleClick}
            ></i>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
