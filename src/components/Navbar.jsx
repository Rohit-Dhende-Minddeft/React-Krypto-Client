import { useEffect, useState } from "react";
import logo from "../images/logo.png";
import "./css/Navbar.scss";

const Navbar = () => {
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

  let isPortrait = windowDimenion.winWidth < 700 ? true : false;

  let menuItemStyle = isPortrait ? "portrait-view-menu" : "desktop-view-menu";

  const Menu = () => {
    const [toggle, setToggle] = useState(false);
    let menuStyle = toggle ? "change" : "container";
    let menuOptions = isPortrait ? (toggle ? "show-menu" : "hide-menu") : "";

    const handleNavigation = (options) => {
      if (options === "Services") {
        window.location.replace("/#services");
      }
      if (options === "Transactions") {
        window.location.replace("/#transaction");
      }
    };
    return (
      <>
        <div className={`${menuItemStyle} ${menuOptions}`}>
          {["Services", "Transactions", "Tutorials", "Transfer"].map(
            (options, index) => {
              return (
                <span
                  key={index}
                  className="menu-options"
                  onClick={() => {
                    handleNavigation(options);
                  }}
                >
                  {options}
                </span>
              );
            }
          )}
          <div className="login-btn">Login</div>
        </div>
        {isPortrait && (
          <div
            className={menuStyle}
            onClick={() => {
              setToggle(!toggle);
            }}
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="navbar-container">
      <img alt="logo" src={logo} className="logo" />
      <Menu />
    </div>
  );
};

export default Navbar;
