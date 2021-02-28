//import important stuff
    import * as firebase from "firebase/app";
    import "firebase/auth";
    import "firebase/firestore";
    import * as firebaseui from "firebaseui";
    import './style.css';
    import "./tools/toolbar/toolbar.js"; //this will eventually be in this one file.
    import "./tools/editor/editor.js"; //this will eventually be in this one file.
    import $ from "jquery";
    
// Dont use Global Variables


initializeApp(); // Initiizes all functions and starts firebase 
  function initializeApp(){
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

//run functions
  login_logout(); // logs user in and out
  addbook(); // adds a new book to the book tab
  loadbooks(); //loads books to the book tab
//end run functions

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
// End of login logout function

async function addbook() { // adds a new book to the book tab bar.
  firebase.auth().onAuthStateChanged((user) => { // must call to define the user
    if(user){
      $('#addBook').on('click', function(){
        var newbook = firebase.firestore().collection("books").doc();
        if($("#bookName").html('')){
        newbook.set({
            user: firebase.auth().currentUser.uid,
            timestamp: Date.now(),
            title: "Book Title",
            genre: "Fantasy",
            length: "Short Story",
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
        }
        else{
        newbook.set({
            user: firebase.auth().currentUser.uid,
            timestamp: Date.now(),
            title: bookName.innerText,
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
        });
        };
      });
    };
//end add book function


async function loadbooks(){ //Loads books from the database
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          firebase.firestore().collection("books").where('user', '==', user.uid).onSnapshot((snaps) => {   //Load Users books
          // Reset page
          $("#booklist").html('');
          // Loop through documents in database
          var x = 0;
          snaps.forEach((doc) => {
            var item = "<div class='book_info' >\
                        <div class='booklist_item'>\
                        <a class='booklist_title' id ='"+doc.id+"'>"+ doc.data().title+ "</a>\
                        <i class='fas fa-chevron-down dropdown'></i>\
                        </div>\
                        <div class='booklist_MetaData'><a class='MetaData_Item'><b>Genre: </b></a>\
                          <a class='MetaData_Item' contenteditable='true'>"+doc.data().genre+"</a>\
                          <a class='MetaData_Item'><b>Length:</b></a>\
                          <a class='MetaData_Item' contenteditable='true'>"+doc.data().length+"</a>\
                          <a class='MetaData_Item'><b>Perspective:</b></a>\
                          <a class='MetaData_Item' contenteditable='true'>"+doc.data().perspective+"</a>\
                          <a class='MetaData_Item'><b>Audience:</b></a>\
                          <a class='MetaData_Item' contenteditable='true'>"+doc.data().audience+"</a><br>\
                          <a class='MetaData_Title'><b>Tags</b></a>\
                          <div class='Taglist'>\
                          <br>\
                          </div>\
                          <div class='insertTag'>\
                          <a id='TagName' contenteditable='true' placeholder='Add Tag'></a>\
                          <a id='addTag'><i class='fas fa-plus'></i></a>\
                          </div></div>";

            $("#booklist").append(item);
            if(x == 0){
              $('.booklist_item').addClass('selected_book').removeClass('booklist_item');
              x=1;
            };
            
            var i = doc.data().tags;
              i = i.length;
              var x;
              var tags;
              for (x = 0; x < i; x++) {
                    tags = '<a class = "tag">'+doc.data().tags[x]+'</a>';
                    $('#' + doc.id).children('.booklist_MetaData').children('.Taglist').append(tags);
              };
            selectbook();
            bookdropdown();

            });
          });
        };
      });
    };
// end of load books


async function selectbook(){ // selects the book so the user can edit it
  $('.booklist_title').on('click', function(){
    $('.selected_book').addClass('booklist_item').removeClass('selected_book');
    $(this).parent().addClass('selected_book').removeClass('booklist_item');
    localStorage.setItem('bookid', $(this).attr('id'));
    localStorage.setItem('booktitle', $(this).text());
    editor();
  });
};
//end of selectbook

async function bookdropdown(){ //adds book meta data drop down
  //TODO: add update features options
            $('.booklist_MetaData').hide();
            $(docmument).on('click','.dropdown', function(){
              $(this).toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
              $(this).parent().parent().children('.booklist_MetaData').toggle();
            });
};

async function editor(){ // "editor" defines everything that happens in the editor tool
    $('#booktitle').html(localStorage.getItem('booktitle'));
    const bookid = localStorage.getItem('book');
  if ($('#editor').is(':visible')){ // only load if visible
    addchapter(bookid);
    tableofcontents(bookid);
    };
  };

  async function addchapter(){
      firebase.auth().onAuthStateChanged((user) => {
          if(user){
          const addContent = document.getElementById('AddContent');
          const toc = document.getElementById('content-list');
          addContent.addEventListener('click', function(){
            var bookid = sessionStorage.getItem("bookid");
            if(bookid != null){
              firebase.firestore().collection("books").doc(bookid).collection('contents').add({
                  bookId: bookid,
                  timestamp: Date.now(),
                  title: "Title",
                  type: 'Chapter',
                  pov: "none",
                  discription: "Write a Chapter Discription.",
                  draft: 1,
                  content: [null],
                  order: toc.childElementCount+1,
                      })
                .then(() => {
                  console.log("Document successfully written!");
                  })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                  });
              }});
          };
      });
    };

  async function tableofcontents(){
      firebase.auth().onAuthStateChanged((user) => {
      if(user){
      const content_list = document.getElementById('content-list');
          firebase.firestore().collection("books").doc(sessionStorage.getItem("bookid")).collection('contents').onSnapshot((snaps) => {
            // Reset page
            content_list.innerHTML = "";
            // Loop through documents in database
              snaps.forEach((doc) => {
                if(doc.data().type == 'Chapter'){
                  const content_item = document.createElement("li");
                    content_item.classList.add('leftmenu-list');
                      const content_title = document.createElement("a");
                        content_title.innerText = doc.data().title;
                      const content_dropdown = document.createElement("i");
                        content_dropdown.classList.add('fas', 'fa-chevron-down', 'dropdown',);
                  content_item.appendChild(content_title);
                  content_item.appendChild(content_dropdown);
                  content_list.appendChild(content_item);
                };
              });
      });
      };
    });
    };
  
    
