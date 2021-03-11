//import important stuff
  import * as firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import * as firebaseui from "firebaseui";
  import './style.css';
  import $ from "jquery";
  import './Module/firebase/startfire.js';
  import './Module/login/login_logout.js';
  import './Module/BookMenu/bookmenu.js';
  import './Module/Editor/editor.js';
//end of imports 
   
   

//ends global variable 

// Load App 
$(document).ready(function() { // Loads App and establishes base load state.
      console.log( "ready!" );
        $('#editor').addClass('full');
        $('.app').addClass('app-full');
        $('#bookmenu_title').last().trigger('click');
        $('#bookmenu').hide();

  });
// end LOAD App

// load contents on click







