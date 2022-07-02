import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import "./App.scss";
import MetamaskAlert from "./components/MetamaskAlert";
import { TransactionContext } from "../src/context/TransactionContext";
import { useContext, useEffect, useState } from "react";

const App = () => {
  const { isMetamaskInstalled } = useContext(TransactionContext);
  let metamask = isMetamaskInstalled;
  const [network, setNetwork] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
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
    return () => window.removeEventListener("scroll", onScroll);
  }, [network, metamask, scrolling, scroll, scrollTop]);

  const handleClick = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <div className="app">
      {!isMetamaskInstalled && <MetamaskAlert />}
      {isMetamaskInstalled && (
        <div>
          {!network && (
            <div className="check-network-label">
              <i className="fas fa-exclamation-circle"></i>
              Make sure you are connected to Goerli Test Network
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
