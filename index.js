//import important stuff
  import * as firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import * as firebaseui from "firebaseui";
  import './style.css';
  import $ from "jquery";
  import './Module/firebase/startfire.js';
  import './Module/login/login.js';
  import './Module/toolbar/toolbar.js';
  import './Module/Editor/editor.js';
  import  './Module/BookMenu/bookmenu.js';
  import  './Module/world/world.js';
  import bookmenu from './Module/BookMenu/bookmenu.html';
  import toolbar from './Module/toolbar/toolbar.html';
  import editor from './Module/Editor/editor.html';
//end of imports 

   
// Load App and set initial conditions. 
$(document).ready(function() { // Loads App and establishes base load state.
    console.log( "ready!" );
    $('booklist-menu').html(bookmenu);
    $('toolbar').html(toolbar);
    $('editor').html(editor);
    editor;
    world;
  });

// load contents on click







