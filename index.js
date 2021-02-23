import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as firebaseui from "firebaseui";
import './style.css';
import "./tools/toolbar/toolbar.js";
import "./tools/editor/editor.js";

//Define all global variable here
const login_screen = document.getElementById('login');
const logout = document.getElementById('logout');
const bookName = document.getElementById('bookName');
const addBook = document.getElementById('addBook');

//run main function
main();
async function main() {
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
var firebaseConfig = {};

//Call functions;
login(firebase);
userlogout(firebase);
};

async function login(firebase){
  // Add Firebase project configuration object here
  
  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
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
    login_screen.style.display ='none';
    }
    else {
    login_screen.style.display ='grid';
    }
  });
};



function userlogout(firebase){
  logout.addEventListener('click', 
  function(){
    if (firebase.auth().currentUser) {
      // User is signed in, let's sign out
      firebase.auth().signOut();
    } 
  });
};




