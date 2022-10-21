import React from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Metamask_Logo from "../assets/metamask-logo.png";
import Wallet_Connect_Logo from "../assets/wallet-connect.png";
import { Typography } from "@mui/material";
import { Container } from "@mui/system";

function WalletModal(props) {
  const handleClose = () => props.setOpen(false);

  const parentContainer = {
    position: "absolute",
    top: "50%",
    left: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    bgcolor: "#000",
    borderRadius: "1rem",
    boxShadow: 24,
    justifyContent: "center",
    p: 4,
    outline: "none",
    gap: 1,
    border: "1px solid grey",
    backgroundImage: `linear-gradient(315deg, #7a7adb 0%, #170e13 74%)`,
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={props.open}>
        <Container sx={parentContainer}>
          <Typography sx={{ color: "white" }}>Connect Wallet</Typography>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Container
              onClick={() => {
                props.setWallet("metamask");
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid grey",
                borderRadius: "1rem",
                p: 1,
                gap: 1,
                color: "white",
                "&:hover": {
                  borderColor: "#FAF9F6",
                  backgroundColor: "#FAF9F6",
                  color: "black",
                  cursor: "pointer",
                },
              }}
            >
              <img src={Metamask_Logo} height="50px" />
              <Typography>Metamask</Typography>
            </Container>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid grey",
                borderRadius: "1rem",
                color: "white",
                p: 1,
                gap: 1,
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "white",
                  color: "black",
                  cursor: "pointer",
                },
              }}
            >
              <img src={Wallet_Connect_Logo} height="50px" />
              <Typography sx={{ textAlign: "center" }}>
                Wallet Connect
              </Typography>
            </Container>
          </Container>
        </Container>
      </Fade>
    </Modal>
  );
}

export default WalletModal;
