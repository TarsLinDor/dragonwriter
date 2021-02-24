//import important stuff
    import * as firebase from "firebase/app";
    import "firebase/auth";
    import "firebase/firestore";
    import * as firebaseui from "firebaseui";
    import './style.css';
    import "./tools/toolbar/toolbar.js";
    import "./tools/editor/editor.js";
// Add Firebase project configuration object here
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

//Define all global variables here
    const login_screen = document.getElementById('login');
    const logout = document.getElementById('logout');
    const bookName = document.getElementById('bookName');
    const addBook = document.getElementById('addBook');
    const content_Title = document.getElementById('Content_Title');
    content_Title.contentEditable='true';
    const userid = 'zFZIb7azTVOvIH2jvmK5On22hAw2'; // Note this needs work
    
//run functions
  user_login();
  user_logout();
  user_newbook();
  user_viewbooks();
  


//functions
    function user_login(){
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
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // Handle sign-in.
            console.log("Login successfull!");
            login_screen.style.display ='none';
            // Return false to avoid redirect.
            return false;
          }
        }
      };

      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#login_window', uiConfig);

      // Listen to the current Auth state
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        
        }
        else {
        login_screen.style.display ='grid';
        
        }
      });


    };

    function user_logout(){
      logout.addEventListener('click', 
      function(){
        if (firebase.auth().currentUser) {
          // User is signed in, let's sign out
          firebase.auth().signOut();
          console.log("Logged out successfully!");
        } 
      });
    };

    function user_newbook() {
      var db = firebase.firestore();
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

    async function user_viewbooks(){
      var db = firebase.firestore();
      db.collection("books").where('user', '==', userid).onSnapshot((snaps) => {
        // Reset page
        booklist.innerHTML = "<hr>";
        // Loop through documents in database
          snaps.forEach((doc) => {
                // Create an HTML entry for each document and add it to the chat
                const booklist_item = document.createElement("div");
                  booklist_item.classList.add('booklist_item');
                  const booklist_title = document.createElement("a");
                  booklist_title.classList.add('booklist_title');
                  const dropdown = document.createElement("i");
                  dropdown.classList.add('fas', 'fa-chevron-down', 'dropdown');
                  booklist_title.textContent = doc.data().title;
                  booklist_title.addEventListener('click', function(){select_book(doc.id, doc.data().title)});
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
      
    };

    function select_book(bookid, title){
      addchapter(bookid);
      const booktitle = document.getElementById('booktitle');
      booktitle.contentEditable = 'true';
      booktitle.innerText = title;
    };


function addchapter(bookid){
const addContent = document.getElementById('AddContent');
var db = firebase.firestore();
      addContent.addEventListener('click', 
      function(){
        var newContent = db.collection("books").doc(bookid).collection('contents');
        if(bookName.innerText == ''){
        newContent.set({
            bookId: bookid,
            timestamp: Date.now(),
            title: "Title",
            type: 'chapter',
            pov: "none",
            draft: 0,
            content: [null]
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
        }
        


});
};


