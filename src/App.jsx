import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import "./App.scss";
import MetamaskAlert from "./components/MetamaskAlert";
import { TransactionContext } from "../src/context/TransactionContext";
import { useContext, useEffect, useState } from "react";

const App = () => {
  const { isMetamaskInstalled } = useContext(TransactionContext);
  let metamask = isMetamaskInstalled;
  const [network, setNetwork] = useState(false);
  useEffect(() => {
    let networks = {
      Mainnet: "1",
      Kovan: "42",
      Ropsten: "3",
      Rinkeby: " 4",
      Goerli: "5",
    };
    if (metamask) {
      if (window.ethereum.networkVersion === networks.Goerli) {
        setNetwork(true);
      } else {
        setNetwork(false);
      }
    }
  }, [network, metamask]);
  return (
    <div className="app">
      {!isMetamaskInstalled && <MetamaskAlert />}
      {isMetamaskInstalled && (
        <div>
          {!network && (
            <div className="check-network-label">
              <i className="fas fa-exclamation-circle"></i>
              Make sure you are connected to Gorli Test Network
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
        </div>
      )}
    </div>
  );
};

export default App;
