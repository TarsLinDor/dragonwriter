import './style.css';
import "./tools/toolbar/toolbar.js"
import "./tools/editor/editor.js"
import "./tools/bookmenu/bookmenu.js"

import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import * as firebaseui from "firebaseui";

const login = document.getElementById('login');
const logout = document.getElementById('logout');
const bookTitle = document.getElementById('booktitle');

async function user_login() {

    var firebaseConfig = {
    apiKey: "AIzaSyC8YOMLaOiD72p4i5DYRSAFwQB7B0AO9vE",
    authDomain: "dragonwriter-2d4d4.firebaseapp.com",
    projectId: "dragonwriter-2d4d4",
    storageBucket: "dragonwriter-2d4d4.appspot.com",
    messagingSenderId: "986346360064",
    appId: "1:986346360064:web:552c83759e18a086e0b7e5",
    measurementId: "G-6VYBWWEX41"
  };

  firebase.initializeApp(firebaseConfig);

  // Add Firebase project configuration object here
  var firebaseConfig = {};
  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        console.log("Login successfull!");
        

        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#login_window', uiConfig);

   // Listen to the current Auth state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
    login.style.display ='none';
    }
    else {
    login.style.display ='grid';
    }
  });
}
user_login();

