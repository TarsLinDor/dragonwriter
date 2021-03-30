//import important stuff
  import * as firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import * as firebaseui from "firebaseui";
  import './style.css';
  import $ from "jquery";
  import './Module/firebase/startfire.js';
  import login_logout from './Module/login/login.js';
  import './Module/toolbar/toolbar.js';
  import './Module/Editor/editor.js';
  import './Module/BookMenu/bookmenu.js';
  import './Module/world/world.js';
  import bookmenu from './Module/BookMenu/bookmenu.html';
  import toolbar from './Module/toolbar/toolbar.html';
  import editor from './Module/Editor/editor.html';
  import login from './Module/login/login.html';
//end of imports 

$(document).ready(function() { 
    console.log( "ready!" );
    $('login').html(login);
    login_logout();
    $('booklist-menu').html(bookmenu);
    $('toolbar').html(toolbar);
    $('editor').html(editor);
  });

   $("#logout").on("click", function() {
    if (firebase.auth().currentUser) {
      // User is signed in, let's sign out
      firebase.auth().signOut();
      console.log("Logged out successfully!");
    }
  }); 









