// This Modula starts and exports Firebase and firebase UI. 
  import * as firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import * as firebaseui from "firebaseui";
  import $ from "jquery";


// Initiizes and starts firebase modual.
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
 //end app firebase initiazation

