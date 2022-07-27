// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { GoogleAuthProvider, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const provider = new GoogleAuthProvider();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const db = getFirestore(app);

export const emailSignUp = async (displayName, email, password) => {

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    console.log(`User ${user.uid} created`);
    await updateProfile(user, {
      displayName: displayName,
    });
    console.log("User profile updated");
    window.location.reload()
  } catch (error) {
    if(error.code === "auth/email-already-in-use"){
      return toast("User already exist");
    }
        if(password.length < 6){
      return toast("Password minimum length of 6 characters")
    }
  }

};

export const emailLogin = async (email, password) => {

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("User logged in", user)
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-email") {
        return toast("Invalid email");
      }
      if (errorCode === "auth/wrong-password") {
        return toast("Wrong password");
      }
    });
};

export const logout = async () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.

      console.log("logged out");
      window.location.reload();
    })
    .catch((error) => {
      // An error happened.
    });
};
export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log("user logged in",credential);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorMessage = error.message;
      console.log(errorMessage)
      // ...
    });
};
