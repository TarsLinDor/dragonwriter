import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";


const book = document.getElementById('book');
const selectbook = document.getElementById('selectbook');
const bookmenu = document.getElementById('bookmenu');
const edit = document.getElementById('edit');
const outline = document.getElementById('outline');
const world = document.getElementById('world');
const character = document.getElementById('character');
const character_tool = document.getElementById('character_tool');
const magic = document.getElementById('magic');
const dictionary = document.getElementById('dictionary');
const note = document.getElementById('note');
const feedback = document.getElementById('feedback');
const print = document.getElementById('print');
const settings = document.getElementById('settings');
const stats = document.getElementById('stats');
const logout = document.getElementById('logout');
const app = document.getElementById('app');

book.addEventListener('click', 
  function(){
    if(app.style.right <='0px'){
    app.style.right ='300px';
    app.style.borderRadius ='5px';
    bookmenu.style.display ='grid';
    }
    else{
    app.style.borderRadius ='0px';
    app.style.right ='0px';
    bookmenu.style.display ='none';
    };
  });
//start conditions
editor.style.display ='grid';
editor.classList.add("full");
//character_tool.classList.add("second");

edit.addEventListener('click', 
  function(){
    if(editor.style.display =='grid'){
    editor.style.display ='none';
    }
    else{
    editor.style.display ='grid';
    editor.classList.add("full")
    };
  });

stats.addEventListener('click', 
  function(){
    if(app.style.right <='0px'){
    app.style.right ='300px';
    }
    else{
    app.style.right ='0px';
    };
  });
     settings.addEventListener('click', 
  function(){
    if(app.style.right <='0px'){
    app.style.right ='300px';
    }
    else{
    app.style.right ='0px';
    };
  });

  logout.addEventListener('click', 
  function(){
    if (firebase.auth().currentUser) {
      // User is signed in, let's sign out
      firebase.auth().signOut();
    } 
  });



