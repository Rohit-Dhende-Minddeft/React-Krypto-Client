import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./css/Login.scss";
import googleLogo from "../assets/google_logo.svg";
import {
  emailLogin,
  signInWithGoogle,
  emailSignUp,
} from "../firebase/firebase";

const Login = (props) => {
  const handleSingInForm = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    emailLogin(email, password);
  };

  const handleGoogleSubmit = () => {
    signInWithGoogle();
  };

  const handleClose = () => {
    props.onClose(false);
  };

  const handleSignUpForm = async () => {
    let name = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    try {
      emailSignUp(name, email, password);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const [isLoginModal, setLoginModal] = useState(true);
  return (
    <div className="login-form-parent">
      <Box
        component="form"
        className="login-form-box"
        noValidate
        autoComplete="off"
      >
        <i className="fa-solid fa-xmark close-icon" onClick={handleClose}></i>
        <label className="sign-up-label">
          {isLoginModal ? "Login" : "Sign up"} with email
        </label>

        {!isLoginModal && (
          <div className="text-field">
            <TextField
              id="username"
              label="Name"
              variant="outlined"
              type={"email"}
              required
            />
          </div>
        )}
        <div className="text-field">
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            type={"email"}
            required
          />
        </div>
        <div className="text-field">
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type={"password"}
            required
          />
        </div>
        <div>
          <Button
            variant="text"
            onClick={isLoginModal ? handleSingInForm : handleSignUpForm}
          >
            Submit
          </Button>
        </div>
        <div>or</div>
        <label>Login with</label>
        <div className="google-logo">
          <img src={googleLogo} onClick={handleGoogleSubmit} alt="logo" />
        </div>
        {isLoginModal ? (
          <div>
            New User?{" "}
            <Button
              onClick={() => {
                setLoginModal(false);
              }}
            >
              sign up now
            </Button>
          </div>
        ) : (
          <div>
            Have already account?{" "}
            <Button
              onClick={() => {
                setLoginModal(true);
              }}
            >
              Login
            </Button>
          </div>
        )}
      </Box>
    </div>
  );
};

export default Login;
