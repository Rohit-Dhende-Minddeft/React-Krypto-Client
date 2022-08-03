import { useEffect, useState } from "react";
import logo from "../images/logo3.png";
import "./css/Navbar.scss";
import ScrollIntoView from "react-scroll-into-view";
import Login from "./Login";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { logout } from "../firebase/firebase";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  borderRadius: "20px",
};

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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [username, setUsername] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        const urn = user.displayName;
        setUsername(urn);
        setOpen(false);
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

  let isPortrait = windowDimenion.winWidth < 700 ? true : false;

  let menuItemStyle = isPortrait ? "portrait-view-menu" : "desktop-view-menu";

  const Menu = () => {
    const [toggle, setToggle] = useState(false);
    let menuStyle = toggle ? "change" : "container";
    let menuOptions = isPortrait ? (toggle ? "show-menu" : "hide-menu") : "";

    const handleNavigation = (options) => {
      if (
        options === "Transfer" ||
        options === "Transactions" ||
        options === "Services" ||
        options === "Tutorials"
      ) {
        setToggle(false);
      }

      if (options === "Tutorials") {
        window.open("https://www.youtube.com/watch?v=FFL9IZIkDMM", "_blank");
      }
    };

    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Login
                open={open}
                onClose={(value) => {
                  setOpen(value);
                }}
              />
            </Box>
          </Fade>
        </Modal>
        <div className={`${menuItemStyle} ${menuOptions}`} id="tutorials">
          {["Transfer", "Transactions", "Services", "Tutorials"].map(
            (options, index) => {
              let scrollTo = options?.toLowerCase();
              return (
                <ScrollIntoView
                  smooth={true}
                  scrollOptions={{ block: "center" }}
                  selector={`#${scrollTo}`}
                  key={index}
                  className="menu-options"
                  onClick={() => {
                    handleNavigation(options);
                  }}
                >
                  {options}
                </ScrollIntoView>
              );
            }
          )}
          {auth.currentUser ? (
            <>
              <div style={{ color: "#5DC319" }}>{username}</div>
              <div className="logout-button" onClick={logout}>
                <i className="fa-solid fa-right-from-bracket logout-icon"></i>
              </div>
            </>
          ) : (
            <Button onClick={handleOpen}>Login </Button>
          )}
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
