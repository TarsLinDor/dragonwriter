import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as firebaseui from "firebaseui";

const bookName = document.getElementById('BookName');
const addBook = document.getElementById('addBook');

async function newbook() {

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
  var db = firebase.firestore();

  addBook.addEventListener('click', 
  function(){
    if(bookName == null){
    var newbook = db.collection("book").doc();
    
    newbook.set({
        title: "Book Title",
        genre: "Fantasy",
        lenght: "Short Story",
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
          var newbook = db.collection("book").doc();
    
    newbook.set({
        title: bookName,
        genre: "Fantasy",
        lenght: "Short Story",
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
  });


};