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

};
});