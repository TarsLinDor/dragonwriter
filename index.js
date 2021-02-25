//import important stuff
    import * as firebase from "firebase/app";
    import "firebase/auth";
    import "firebase/firestore";
    import * as firebaseui from "firebaseui";
    import './style.css';
    import "./tools/toolbar/toolbar.js";
    import "./tools/editor/editor.js";
// Define Global Variables
const booktitle = document.getElementById('booktitle');

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
  //run functions
  login_logout();
  books();
  editor(); 
};

// Define all functions
  function login_logout(){ // Logs users in and out of DragonWriter.
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
        login.style.display ='none';
        }
        else {
        login.style.display ='grid';
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

  function books(){ //Adds new books and allows users to select books they want to edit  
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
        addbook();
        firebase.firestore().collection("books").where('user', '==', user.uid).onSnapshot((snaps) => {
          // Reset page
          booklist.innerHTML = "";
          // Loop through documents in database
        snaps.forEach((doc) => {
                // Create an HTML entry for each document and add it to the chat
                const booklist_item = document.createElement("div"); //create book list item
                  const booklist_title = document.createElement("a");//create book list children elements
                  const dropdown = document.createElement("i");
                    booklist_item.classList.add('booklist_item');
                    booklist_title.classList.add('booklist_title');
                    dropdown.classList.add('fas', 'fa-chevron-down', 'dropdown');
                    booklist_title.textContent = doc.data().title;
                      booklist_title.addEventListener('click', function(){ // Adds select book on click
                          booktitle.contentEditable = 'true';
                          booktitle.innerText = doc.data().title;
                          booklist_item.classList.add('selected');
                          booktitle.value = doc.id;
                        });

                      dropdown.addEventListener('click', function(){
                        const meta = document.getElementById(doc.id);
                        if(dropdown.classList.contains('fa-chevron-down')){
                        meta.style.display = 'grid';
                        dropdown.classList.add('fa-chevron-up')
                        dropdown.classList.remove('fa-chevron-down');
                        }
                        else{
                          meta.style.display = 'none';
                          dropdown.classList.remove('fa-chevron-up')
                          dropdown.classList.add('fa-chevron-down');
                        }
                        });

                  booklist_item.appendChild(booklist_title);
                  booklist_item.appendChild(dropdown);

                const booklist_MetaData = document.createElement("div");
                    booklist_MetaData.classList.add('booklist_MetaData');
                    booklist_MetaData.id = doc.id;
                    const genre = document.createElement("a");
                    genre.classList.add('MetaData_Item');
                    genre.innerHTML = "<b> Genre: </b>"
                    const genre_value = document.createElement("a");
                    genre_value.contentEditable='true';
                    genre_value.classList.add('MetaData_Item');
                    genre_value.textContent = doc.data().genre;
                    booklist_MetaData.appendChild(genre);
                    booklist_MetaData.appendChild(genre_value);

                    const length = document.createElement("a");
                    length.classList.add('MetaData_Item');
                    length.innerHTML = "<b> Length: </b>"
                    const length_value = document.createElement("a");
                    length_value.contentEditable='true';
                    length_value.classList.add('MetaData_Item');
                    length_value.textContent = doc.data().length;
                    booklist_MetaData.appendChild(length);
                    booklist_MetaData.appendChild(length_value);

                    const perspective = document.createElement("a");
                    perspective.classList.add('MetaData_Item');
                    perspective.innerHTML = "<b> Perspective: </b>"
                    const perspective_value = document.createElement("a");
                    perspective_value.contentEditable='true';
                    perspective_value.classList.add('MetaData_Item');
                    perspective_value.textContent = doc.data().perspective;
                    booklist_MetaData.appendChild(perspective);
                    booklist_MetaData.appendChild(perspective_value);

                    const audience = document.createElement("a");
                    audience.classList.add('MetaData_Item');
                    audience.innerHTML = "<b> Audience: </b>"
                    const audience_value = document.createElement("a");
                    audience_value.contentEditable='true';
                    audience_value.classList.add('MetaData_Item');
                    audience_value.textContent = doc.data().audience;
                    booklist_MetaData.appendChild(audience);
                    booklist_MetaData.appendChild(audience_value);

                    const taglist_title = document.createElement("a");
                    taglist_title.classList.add('MetaData_Title');
                    taglist_title.innerHTML = "<b> Tags </b>"
                    booklist_MetaData.appendChild(taglist_title);

                    const taglist = document.createElement("div");
                    taglist.classList.add('Taglist');
                      const tag = document.createElement("a");
                        tag.classList.add('tag');
                        tag .textContent = doc.data().tags;
                        taglist.appendChild(tag);
                    const insertTag = document.createElement("div");
                    insertTag.classList.add('insertTag');
                    insertTag.innerHTML = "<a id='TagName' contenteditable='true' placeholder='Add Tag'></a><a id='addTag'><i class='fas fa-plus'></i></a>";
                    booklist_MetaData.appendChild(taglist);
                    booklist_MetaData.appendChild(insertTag);
              booklist.appendChild(booklist_item);
              booklist.appendChild(booklist_MetaData);
          });
          });
      
      }});
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
        newbook.set({
            user: firebase.auth().currentUser.uid,
            timestamp: Date.now(),
            title: bookName.innerText,
            genre: "Fantasy",
            length: "Novel",
            perspective: '3rd Person',
            audience: 'Adult',
            tags: [null]
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


  function editor(){ // "editor" defines everything that happens in the editor tool
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        tableofcontents();
        addchapter();
      };
    });
    };
  function addchapter(){
      firebase.auth().onAuthStateChanged((user) => {
          if(user){
          const addContent = document.getElementById('AddContent');
          const toc = document.getElementById('content-list');
          addContent.addEventListener('click', function(){
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

  function tableofcontents(){
      firebase.auth().onAuthStateChanged((user) => {
      if(user){
      const content_list = document.getElementById('content-list');
        content_list.innerText = booktitle.value;
        
          firebase.firestore().collection("books").doc(bookid).collection('contents').onSnapshot((snaps) => {
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
    
