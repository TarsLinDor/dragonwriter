// import stuff here
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import Sortable from 'sortablejs';
import texteditor from './quill.js';
import toolbarOptions from './quill.js';


// define global variables

var db = firebase.firestore(); 
var contents = "";
var bookID = "";
var booktitle
var chapterID = "";
var draft_NUM = 0;
var order = "";

  //load quill  wysiwyg editor
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


firebase.auth().onAuthStateChanged((user)=>{ if(user){


$(document).on('click','#edit', function(){ //loads editor
    bookID = localStorage.getItem('bookid');
    booktitle = localStorage.getItem('booktitle');
    $('#booktitle').html(booktitle);
    db.collection("books").doc(bookID).collection('contents').where('hidden','==', false)
    .onSnapshot((snaps) => {
      // Reset page
      $("#content-list").html('');
      $(".draft_toc").html('<hr>');
      //$(".col-draft").hide();
      // Loop through documents in database
        snaps.forEach((doc) => {
          contents = doc.data().contents;
          draft_NUM = contents.length-1;
          order = $('.order').length+1;
                if(doc.data().type == 'Chapter'){

                  var hidden = "<div class ='content-data hidden' id='>";
                  for (var i = 0; i <= draft_NUM; i++) {
                    var drafts = "<a class='drafts'>"+contents[i]+"</a>"
                    hidden = hidden+drafts;
                  }

                  var item = "<div class = 'leftmenu-list order' id ='"+doc.id+"'>\
                                <a class='content_title'>"+order+":</a>\
                                <a class='content_title'> "+doc.data().title+"</a>\
                                <div class='content_MetaData hidden'>\
                                  <a><b>Type:</b></a><a contenteditable='true'>"+doc.data().type+"</a>\
                                  <a><b>POV:</b></a><a contenteditable='true'>"+doc.data().pov+"</a>\
                                  <a class='content-full underline'><b>Chapter Descrition</b></a>\
                                  <a class='content-full' contenteditable='true'>"+doc.data().discription+"</a>\
                                </div>\
                                "+ hidden +"<\div>\
                              </div>";
                  $("#content-list").append(item);

                }
              $('.hidden').hide();
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

  $(document).on('click','.leftmenu-list', function(){
    $('.content_MetaData').hide();
    $('.leftmenu-list').css('background-color','#E3DCD7');
    $(this).children('.content_MetaData').show();
    $(this).css('background-color','#C6B9B0');
    chapterID = $(this).parent().attr('id');
    texteditor.root.innerHTML = $(this).children('.content_MetaData').children('.inner-contents').html();
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
