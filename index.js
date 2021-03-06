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
  import Sortable from 'sortablejs';
//end of imports 

// Add global variables.

  // Initiizes and starts firebase modual.
  function initializeFireBase(){
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
initializeFireBase(); //Initializes firebase auth and firestore
      login_logout(); //requires user to login before using app
         loadbooks(); // loads book
   updatebook_meta();
            addtag();
      //Initial App State:
        $('#editor').addClass('full');
        $('.app').addClass('app-full');
        $('#bookmenu').hide();
        
  });
// end LOAD App





//Async FUNCTIONS: should be running the entire time the app is loaded.
async function loadbooks(){ //loads books and book meta-data from firebase.
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
          firebase.firestore().collection("books").where('user', '==', user.uid) //.orderBy('timestamp', 'desc')
          .onSnapshot((snaps) => {   //Load Users books
          // Reset page
          $("#booklist").html('');
          // Loop through documents in database

          snaps.forEach((doc) => {
            var item = "<div class='book_info' >\
                        <div class='booklist_item'>\
                        <a class='booklist_title' id ='"+doc.id+"'>"+ doc.data().title+ "</a>\
                        <i class='fas fa-chevron-down dropdown'></i>\
                        </div>\
                        <div class='booklist_MetaData'><a class='MetaData_Item'><b>Genre: </b></a>\
                        <a class='MetaData_Item' contenteditable='true' id='genre'>"+doc.data().genre+"</a>\
                        <a class='MetaData_Item'><b>Length:</b></a>\
                        <a class='MetaData_Item' contenteditable='true' id = 'length'>"+doc.data().length+"</a>\
                        <a class='MetaData_Item'><b>Perspective:</b></a>\
                        <a class='MetaData_Item' contenteditable='true' id = 'perspective'>"+doc.data().perspective+"</a>\
                        <a class='MetaData_Item'><b>Audience:</b></a>\
                        <a class='MetaData_Item' contenteditable='true' id = 'audience'>"+doc.data().audience+"</a><br>\
                        <a class='MetaData_Title'><b>Tags</b></a>\
                        <div class='Taglist' id ='tag"+doc.id+"'>\
                        <br>\
                        </div>\
                        <div class='insertTag'>\
                        <a class='TagName' contenteditable='true' placeholder='Add Tag'></a>\
                        <a class='addTag'><i class='fas fa-plus'></i></a>\
                        </div></div>";

            $("#booklist").append(item);
            //TODO: fix tags
            var booktags = doc.data().tags;
            var i;
            for (i = 0; i < booktags.length; i++) {
              var tags = '<a class = "tag">'+booktags[i]+'</a>';
              $('#tag'+doc.id+'').append(tags);
              };
              
            }); 
          });
        };
      });
  
};

async function login_logout(){ // Logs users in and out of DragonWriter.
      const uiConfig = {
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [
          // Email / Password Provider.
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
          tosUrl: '<your-tos-link>',
          privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
          callbacks: {
          signInSuccessWithAuthResult: function() {
            // Handle sign-in.

            //TODO: add one book when user signs in. if new user then add book
            console.log('sign in successfull');
            return false;
          }
        }
      };

      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#login_window', uiConfig);

      // Listen to the current Auth state
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        $('#login').hide();
        }
        else {
        $('#login').show();
        }
      });

      $('#logout').on('click', function(){
        if (firebase.auth().currentUser) {
          // User is signed in, let's sign out
          firebase.auth().signOut();
          console.log("Logged out successfully!");
        } 
      });
};

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


$(document).on('click','#book', function(){ // defines events when the book button is clicked.
  $('.app').toggleClass('app-full');
  $('.app').toggleClass('app-side');
  $('#bookmenu').toggle(); 
  $('.booklist_MetaData').hide();
});


$(document).on('click','#addBook', function(){ // adds a new book to the book tab bar.
  firebase.auth().onAuthStateChanged((user) => { // must call to define the user
    if(user){
        var title = $("#bookName").html();
        var newbook = firebase.firestore().collection("books").doc();
        if(title ==''){
        newbook.set({
            user: firebase.auth().currentUser.uid,
            timestamp: Date.now(),
            title: "Book Title",
            genre: "Fantasy",
            length: "Short Story",
            perspective: '3rd Person',
            audience: 'Adult',
            tags: ["test", 'grimdark']
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
            user: firebase.auth().currentUser.uid,
            timestamp: Date.now(),
            title: title,
            genre: "Fantasy",
            length: "Novel",
            perspective: '3rd Person',
            audience: 'Adult',
            tags: [""]
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
        };
        $("#bookName").html('');
        };
        });
  });
    
//end add book function

//dropdown function
$(document).on('click','.dropdown', function(){ //adds book meta data drop down
  //TODO: add update features options
    $(this).toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
    $(this).parent().parent().children('.booklist_MetaData').toggle();
  });
//end of dropdown function

//select book function
$(document).on('click','.booklist_title', function(){  
    $('.selected_book').addClass('booklist_item').removeClass('selected_book');
    $(this).parent().addClass('selected_book').removeClass('booklist_item');
    localStorage.setItem('bookid', $(this).attr('id'));
    localStorage.setItem('booktitle', $(this).text());
    $('#booktitle').html(localStorage.getItem('booktitle'));
    if ($('#editor').is(':visible')){ // only load if visible
      load_TOC(this);
    };
  });
//end of select book function

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


async function updatebook_meta(){
  $(document).on('focusout','.MetaData_Item', function(){
    if($(this).attr('contenteditable')){
    var item = $(this).html();
    var itemid = $(this).attr('id');
    var bookid = $(this).parent().parent().children('.booklist_item').children('.booklist_title').attr('id');
    firebase.auth().onAuthStateChanged((user) => { // must call to define the user
    if(user){
        var updatebook = firebase.firestore().collection("books").doc(bookid);
        updatebook.update({
          [itemid]: item,
        });
        };
        //newbook.update({
    });
    };
    });
  //$('.booklist_MetaData').hide();
  $(this).parent().parent.show();
};


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
