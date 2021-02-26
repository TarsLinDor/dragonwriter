//import important stuff
    import * as firebase from "firebase/app";
    import "firebase/auth";
    import "firebase/firestore";
    import * as firebaseui from "firebaseui";
    import './style.css';
    import "./tools/toolbar/toolbar.js";
    import "./tools/editor/editor.js";
    import $ from "jquery";
// Define Global Variables
  const booktitle = document.getElementById('booktitle');
  booktitle.contentEditable = 'true';

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

  //run functions
login_logout(); // logs user in and out
  async function login_logout(){ // Logs users in and out of DragonWriter.
      const login = document.getElementById('login');
      const uiConfig = {
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [
          // Email / Password Provider.
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          //firebase.auth.signInAnonymously.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: function() {
            // Handle sign-in.
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
        $("#login").css("display", "grid");
        }
      });
      const logout = document.getElementById('logout');
      logout.addEventListener('click', 
      function(){
        if (firebase.auth().currentUser) {
          // User is signed in, let's sign out
          firebase.auth().signOut();
          console.log("Logged out successfully!");
        } 
      });
  };


books();//Adds new books and allows users to select books they want to edit 
async function books(){ 
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
        addbook();
        firebase.firestore().collection("books").where('user', '==', user.uid).onSnapshot((snaps) => { //Load Users books
          // Reset page
          $("#booklist").html('');
          // Loop through documents in database
          var x = 0;
          snaps.forEach((doc) => {
            var item = "<div class='book_info' id ='"+doc.id+"'>\
                        <div class='booklist_item'>\
                        <a class='booklist_title'>"+ doc.data().title+ "</a>\
                        <i class='fas fa-chevron-down dropdown'></i>\
                        </div>\
                        <div class='booklist_MetaData'><a class='MetaData_Item'><b>Genre: </b></a>\
                          <a class='MetaData_Item' contenteditable='true'>"+doc.data().genre+"</a>\
                          <a class='MetaData_Item'><b>Length:</b></a>\
                          <a class='MetaData_Item' contenteditable='true'>"+doc.data().length+"</a>\
                          <a class='MetaData_Item'><b>Perspective:</b></a>\
                          <a class='MetaData_Item' contenteditable='true'>"+doc.data().perspective+"</a>\
                          <a class='MetaData_Item'><b>Audience:</b></a>\
                          <a class='MetaData_Item' contenteditable='true'>"+doc.data().audience+"</a>\
                          <a class='MetaData_Title'><b>Tags</b></a>\
                          <div class='Taglist'>\
                          <br>\
                          </div>\
                          <div class='insertTag'>\
                          <a id='TagName' contenteditable='true' placeholder='Add Tag'></a>\
                          <a id='addTag'><i class='fas fa-plus'></i></a>\
                          </div></div>";

            $("#booklist").append(item);
              var i = doc.data().tags;
              i = i.length;
              var x;
              var tags;
              for (x = 0; x < i; x++) {
                    tags = '<a class = "tag">'+doc.data().tags[x]+'</a>';
                    $('#' + doc.id).children('.booklist_MetaData').children('.Taglist').append(tags);
              };
          });
      
          });
      $('.dropdown').on('click', function(e){
        e.addclass('fa-chevron-up').removeclass('fa-chevron-down');
        var meta = $('.dropdown').parent().parent().atri('id');
        $('#'+meta).children('booklist_MetaData').toggle;
      });
      editor();
    };
      });
};

    function addbook() {
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
      var db = firebase.firestore();
      const addBook = document.getElementById('addBook');
      const bookName = document.getElementById('bookName');
      addBook.addEventListener('click', 
      function(){
        var newbook = db.collection("books").doc();
        if(bookName.innerText == ''){
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
        bookName.innerText = null;
        });
        };
      });
    };


  async function editor(){ // "editor" defines everything that happens in the editor tool
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        tableofcontents();
        addchapter();
      };
    });
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
  
    
