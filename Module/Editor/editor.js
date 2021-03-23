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
var contents = "";
var bookID = "";
var chapterID = "";
var draft = "";
  //load quill  wysiwyg editor
async function editor(){
  firebase.auth().onAuthStateChanged((user)=>{ if(user){

  $(document).on('click','#edit', function(){ //loads editor
    //$('#editor').show();
    bookID = localStorage.getItem('bookid');
    var booktitle = localStorage.getItem('booktitle');
    $('#booktitle').html(booktitle);
    db.collection("books").doc(bookID).collection('contents')
    .where('hidden','==', false)
    //.orderBy('order') 
    .onSnapshot((snaps) => {
            // Reset page
            $("#content-list").html('');
            // Loop through documents in database
              snaps.forEach((doc) => {
                draft = doc.data().draft;
                contents = doc.data().contents;
                if(doc.data().type == 'Chapter'){

                  var item = "<li class = 'leftmenu-list' id ='"+doc.id+"'>\
                              <a class='content_title'>"+doc.data().title+"</a>\
                             \
                              <div class='content_MetaData'>\
                              <a><b>Type:</b></a><a contenteditable='true'>"+doc.data().type+"</a>\
                              <a><b>POV:</b></a><a contenteditable='true'>"+doc.data().pov+"</a>\
                              <a class='content-full underline'><b>Chapter Descrition</b></a>\
                              <a class='content-full' contenteditable='true'>"+doc.data().discription+"</a>\
                              <a class='inner-contents'>"+contents[draft]+"</a>\
                              </div>\
                              </li>";
                            $("#content-list").append(item);
                }
                else if(doc.data().type == 'Prologue') {
                  var item = "<div class = 'leftmenu-list' id ='"+doc.id+"'>\
                              <a class='content_title'>"+doc.data().type+": "+doc.data().title+"</a>\
                              <div class='content_MetaData'>\
                              <a><b>Type:</b></a><a contenteditable='true'>"+doc.data().type+"</a>\
                              <a><b>POV:</b></a><a contenteditable='true'>"+doc.data().pov+"</a>\
                              <a class='content-full underline'><b>Chapter Descrition</b></a>\
                              <a class='content-full' contenteditable='true'>"+doc.data().discription+"</a>\
                              <a class='inner-contents'>"+contents[draft]+"</a>\
                              </div>\
                              </div>";
                              $("#content-list").prepend(item);
                };
              
              $('.content_MetaData').hide();
              $('.inner-contents').hide();
              });

        });
    
    });
  
    //adds new chapters and stuff.
    $(document).on('click','#AddContent', function(){
          const bookid = localStorage.getItem('bookid');
            if(bookid != null){
              firebase.firestore().collection("books").doc(bookid).collection('contents').add({
                  draft: 0,
                  timestamp: Date.now(),
                  title: "Title",
                  type: 'Chapter',
                  pov: "none",
                  discription: "Write a Chapter Discription.",
                  contents: [''],
                  order: $('#content-list').children().length+1,
                  hidden: false,
                  
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
    //$('.content_MetaData').show();
    $(this).addClass('fa-eye-slash').removeClass('fa-eye');
  });

  $(document).on('click','.fa-eye-slash', function(){
    //$('.content_MetaData').hide();
    $(this).removeClass('fa-eye-slash').addClass('fa-eye');
  });

  $(document).on('click','.content_title', function(){
    $('.content_MetaData').hide();
    $('.leftmenu-list').css('background-color','#E3DCD7');
    $(this).parent().children('.content_MetaData').show();
    $(this).parent().css('background-color','#C6B9B0');
    chapterID = $(this).parent().attr('id');
    texteditor.root.innerHTML = $(this).parent().children('.content_MetaData').children('.inner-contents').html();
  });


    $(document).on('click','.newDraft', function(){
            var updatebook = firebase.firestore().collection("books").doc(bookid).collection('contents')
            .doc(chapterID);
            updatebook.update({
              contents: firebase.firestore.FieldValue.arrayUnion('')


            });
        tag
            //newbook.update({
        });

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
  
};











export default editor();