//import important stuff
  import * as firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import * as firebaseui from "firebaseui";
  import './style.css';
  import $ from "jquery";
  import './Module/firebase/startfire.js';
  import './Module/login/login.js';
  import editor from'./Module/Editor/editor.js';
  import bookmenu from './Module/BookMenu/bookmenu.js';
//end of imports 
  
   
// Load App and set initial conditions. 
$(document).ready(function() { // Loads App and establishes base load state.
      console.log( "ready!" );
    bookmenu;
    editor;
    $('.content_title').last().trigger('click');
    $('.leftmenu_list').last().trigger('click');
      //$('.booklist').children('.book_info').last().children('.booklist_item').children
  });

// load contents on click
$('#editor').addClass('full');
$('.app').addClass('app-full');
$('#bookmenu').hide();






