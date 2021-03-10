// import stuff here
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import Sortable from 'sortablejs';

// define global variables
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

var db = firebase.firestore();
var bookid = localStorage.getItem('bookid');
var booktitle = localStorage.getItem('booktitle');

firebase.auth().onAuthStateChanged((user) => { if(user){// all functions should be done only if user is logged in
  db.collection("books").doc(bookid).collection('contents').orderBy('order')
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
  $(document).on('click','#AddContent', function(){
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
  });

};
});