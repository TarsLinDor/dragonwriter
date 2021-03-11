/*
GENERAL NOTE: 
This app works by:
A: Loading content using Async functions 
B: Adding content by using the jquery modual $(document).on('event','content name', function(){}; to add or edit content.
C: Defining all UI stuff inside event functions
D: Specifying start state conditions

Goal: minimize reads and writes per user. {ensure all functions are only called once.}
*/

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
  import Sortable from 'sortablejs';
//end of imports 
   
   

//ends global variable 

// Load App 
$(document).ready(function() { // Loads App and establishes base load state.
      console.log( "ready!" );
      //starts app
//initializeFireBase(); //Initializes firebase auth and firestore
      //login_logout(); //requires user to login before using app
         //loadbooks(); // loads book
   //updatebook_meta();
            //addtag();
      //Initial App State:
        $('#editor').addClass('full');
        $('.app').addClass('app-full');
        $('#bookmenu').hide();
        $('bookmenu_title').trigger('click');
  });
// end LOAD App

// load contents on click
$(document).on('click','.content_title', function(){
  var ChapterID = $(this).parent().attr('id');
  localStorage.setItem('ChapterID', ChapterID);
  firebase.auth().onAuthStateChanged((user) => {
      if(user){
          firebase.firestore().collection("books").doc(localStorage.getItem('bookid')).collection('contents').doc(localStorage.getItem('ChapterID')).get().then((doc) => {
      if (doc.exists){
        var title = doc.data().title;
        var draft_numb = doc.data().draft-1;
        var words = doc.data().content[draft_numb];
        var order = doc.data().order;
        var content_type = doc.data().type;
        editor.root.innerHTML = words;
        $('#Content_Title').html(title);
        if(content_type =='Chapter'){
        $('#numb').html(order +":");
        }
        else{
          $('#numb').html(":");
        }
        $('#content_type').html(content_type);
      console.log('Content Retrived successfull!');
    } else {
      console.log("No such document!");
    }}).catch((error) => {
      console.log("Error getting document:", error);
    });

  //const content = document.getElementById('quill-editor');
  //$('#quill-editor').html(localStorage.getItem('ChapterID'));
  
      };
  });
});





async function addtag(){
  $(document).on('click','.addTag', function(){
    var tag = ('.TagName').html();
    if(tag !=''){
    var bookid = $(this).parent().parent().children('.booklist_item').children('.booklist_title').attr('id');
    firebase.auth().onAuthStateChanged((user) => { // must call to define the user
    if(user){
        var updatebook = firebase.firestore().collection("books").doc(bookid);
        updatebook.update({
          tags: tag,
        });
        };
        //newbook.update({
    });
    };
    });
  
  $(this).parent().parent.show();
};
