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
  import Sortable from 'sortablejs';
//end of imports 

// Add global variables.

  // Initiizes and starts firebase modual.
  /*function initializeFireBase(){
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
      };
      */
  //end app firebase initiazation
   
  //load quill  wysiwyg editor
    var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }],
    ['clean']
    ];
    var editor = new Quill('#quill-editor', {
    modules: {
      toolbar: toolbarOptions,
    },
    theme: 'snow',
    placeholder: "      Oh! the places you'll go..."
    });
  //end load  quill editor     

//ends global variable 

// Load App 
$(document).ready(function() { // Loads App and establishes base load state.
      console.log( "ready!" );
      //starts app
//initializeFireBase(); //Initializes firebase auth and firestore
      //login_logout(); //requires user to login before using app
         //loadbooks(); // loads book
   updatebook_meta();
            addtag();
      //Initial App State:
        $('#editor').addClass('full');
        $('.app').addClass('app-full');
        $('#bookmenu').hide();
        
  });
// end LOAD App

async function load_TOC(selected){// loads editor table of contents
  const bookid = $(selected).attr('id');
      firebase.auth().onAuthStateChanged((user) => {
      if(user){
          firebase.firestore().collection("books").doc(bookid).collection('contents').orderBy('order')
          .onSnapshot((snaps) => {
            // Reset page
            $("#content-list").html('');
            // Loop through documents in database
              snaps.forEach((doc) => {
                if(doc.data().type == 'Chapter'){
                  var item = "<li class = 'leftmenu-list' id ='"+doc.id+"'>\
                              <a class='content_title'>"+doc.data().title+"</a>\
                              <i class='fas fa-chevron-down dropdown'></i>\
                              </li>";
                }
                else{
                  var item = "<div class = 'leftmenu-list' id ='"+doc.id+"'>\
                              <a class='content_title'>"+doc.data().type+": "+doc.data().title+"</a>\
                              <i class='fas fa-chevron-down dropdown'></i>\
                              </div>";
                };
              $("#content-list").append(item);
              });
        });
      };
  });
};
    
//end add book function

//dropdown function

//end of dropdown function



//add content to editor table of contents
$(document).on('click','#AddContent', function(){
      firebase.auth().onAuthStateChanged((user) => {
          if(user){
          const bookid = localStorage.getItem('bookid');
            if(bookid != null){
              firebase.firestore().collection("books").doc(bookid).collection('contents').add({
                  bookId: bookid,
                  timestamp: Date.now(),
                  title: "Title",
                  type: 'Chapter',
                  pov: "none",
                  discription: "Write a Chapter Discription.",
                  draft: 1,
                  order: $('#content-list').children().length,
                  content: ['test', 'draft 2'],
                      })
                .then(() => {
                  console.log("Document successfully written!");
                  })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                  });
              };
              };
          });
  });
//end of add contents function

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
