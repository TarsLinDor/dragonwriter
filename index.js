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
const booktitle = document.getElementById('booktitle');
booktitle.contentEditable = 'true';
const content_Title = document.getElementById('Content_Title');
content_Title.contentEditable='true';
//run main function
const booklist = document.getElementById('booklist');

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
  user_login(firebase);
  user_logout(firebase);
  user_newbook(firebase);
  //viewbooklist(firebase);
};

async function user_login(firebase){
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
        login_screen.style.display ='none';

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

function user_logout(firebase){
  logout.addEventListener('click', 
  function(){
    if (firebase.auth().currentUser) {
      // User is signed in, let's sign out
      firebase.auth().signOut();
      console.log("Logged out successfully!");
    } 
  });
};

async function user_newbook(firebase) {
  var db = firebase.firestore();
  addBook.addEventListener('click', 
  function(){
    var newbook = db.collection("books").doc();
    if(bookName == null){
    
    
    newbook.set({
        userId: firebase.auth().currentUser.uid,
        timestamp: Date.now(),
        title: "Book Title",
        genre: "Fantasy",
        length: "Short Story",
        perspective: '3rd Person',
        audience: 'YA',
        tags: [null]
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
    }
    else{
    newbook.set({
        userId: firebase.auth().currentUser.uid,
        timestamp: Date.now(),
        title: bookName.innerText,
        genre: "Fantasy",
        length: "Short Story",
        perspective: '3rd Person',
        audience: 'YA',
        tags: [null]
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
    };

    bookName.innerText = null;
  });


};
/*
async function viewbooks(firebase){
  var db = firebase.firestore();
  var books = db.collection(books).collection("books")
  .orderBy("timestamp","desc").onSnapshot((snaps) => {
 // Reset page
 
 // Loop through documents in database
 snaps.forEach((doc) => {
   // Create an HTML entry for each document and add it to the chat
   //const booklist_item = document.createElement("div");
    //booklist_item.classList.add("booklist_item");
    //booklist_item.id = doc.data().id;
   const booklist_title = document.createElement("a");
    booklist_title.classList.add("booklist_title");
    booklist_title.textContent = doc.data().title;

   //booklist_item.appendChild(booklist_title);
   booklist.appendChild(booklist_title);
 });
});
  
};
*/
main();