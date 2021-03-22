// import stuff here
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import Sortable from 'sortablejs';


// define global variables
var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }],
    ['clean']
    ];
var texteditor = new Quill('#quill-editor', {
    modules: {
      toolbar: toolbarOptions,
    },
    theme: 'snow',
    placeholder: "      Oh! the places you'll go..."
    });
var db = firebase.firestore(); 
  //load quill  wysiwyg editor
async function editor(){
  firebase.auth().onAuthStateChanged((user)=>{ if(user){

  $(document).on('click','#edit', function(){ //loads editor
    //$('#editor').show();
    var bookid = localStorage.getItem('bookid');
    var booktitle = localStorage.getItem('booktitle');
    $('#booktitle').html(booktitle);
    db.collection("books").doc(bookid).collection('contents').orderBy('order')
    .onSnapshot((snaps) => {
            // Reset page
            $("#content-list").html('');
            // Loop through documents in database
              snaps.forEach((doc) => {
                if(doc.data().type == 'Chapter'){
                  var item = "<li class = 'leftmenu-list' id ='"+doc.id+"'>\
                              <a class='content_title'>"+doc.data().title+"</a>\
                             \
                              <div class='content_MetaData'>\
                              <a><b>Type:</b></a><a contenteditable='true'>"+doc.data().type+"</a>\
                              <a><b>POV:</b></a><a contenteditable='true'>"+doc.data().pov+"</a>\
                              <a class='content-full underline'><b>Chapter Descrition</b></a>\
                              <a class='content-full' contenteditable='true'>"+doc.data().discription+"</a>\
                              </div>\
                              </li>";
                }
                else{
                  var item = "<div class = 'leftmenu-list' id ='"+doc.id+"'>\
                              <a class='content_title'>"+doc.data().type+": "+doc.data().title+"</a>\
                              <div class='content_MetaData'>\
                              <a><b>Type:</b></a><a>"+doc.data().type+"</a>\
                              <a><b>POV:</b></a><a>"+doc.data().pov+"</a>\
                              <a class='content-full underline'><b>Chapter Descrition</b></a>\
                              <a class='content-full' contenteditable='true'>"+doc.data().discription+"</a>\
                              </div>\
                              </div>";
                };
              $("#content-list").append(item);
              $('.content_MetaData').hide();
              });

        });
    
    });
  
    //adds new chapters and stuff.
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
                  a: '',
                  order: $('#content-list').children().length,
                  
                      })
                .then(() => {
                  console.log("Document successfully written!");
                  })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                  });
              };
        });
  
  }});

$(document).on('click','.fa-eye', function(){
  $('.content_MetaData').show();
});

  $(document).on('click','.content_title', function(){
    $('.content_MetaData').hide();
    $('.leftmenu-list').css('background-color','#E3DCD7');
    $(this).parent().children('.content_MetaData').show();
    $(this).parent().css('background-color','#C6B9B0');
    var bookid = localStorage.getItem('bookid');
    var booktitle = localStorage.getItem('booktitle');
    var chapterid = $(this).parent().attr('id');
    localStorage.setItem('ChapterID', chapterid);
     firebase.firestore().collection("books").doc(bookid).collection('contents').doc(chapterid).get().then((doc) => {
       $('#Content_Title').html(doc.data().title);
        var title = doc.data().title;
        var draft_numb = doc.data().draft-1;
        //var words = doc.data().1;
        var order = doc.data().order+1;
        var content_type = doc.data().type;
        texteditor.root.innerHTML = doc.data().a;
        if(content_type =='Chapter'){
        $('#numb').html(order +":");
        }
        else{
          $('#numb').html(":");
        }
        $('#content_type').html(content_type);
     });
  });

};
  /*
    var chapterID = $(this).parent().attr('id');
    localStorage.setItem('ChapterID', chapterID);
    db.collection("books").doc(localStorage.getItem('bookid')).collection('contents').doc(localStorage.getItem('ChapterID')).get().then((doc) => {
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

    //  const content = document.getElementById('quill-editor');
    //$('#quill-editor').html(localStorage.getItem('ChapterID'));
  
      });
  });
*/
  
 











export default editor();