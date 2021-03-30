import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import './editor.scss';
import editor from './editor.html';
$('editor').html(editor);

var db = firebase.firestore(); 
var contents = "";
var bookID = "";
var booktitle ="";
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

  $(document).on('change','#editor', function(){ //loads editor
    texteditor.root.innerHTML="";
    $('Content-Title').children('a').html('');
    $('Content-Title').attr('value', "");
    $('Content-Title').attr('name', "");
    bookID = localStorage.getItem('bookid');
    booktitle = localStorage.getItem('booktitle');
    $('editor booktitle').html(booktitle);
    db.collection("books").doc(bookID).collection('contents').orderBy('order').onSnapshot((snaps) => {
      // Reset page
      $("editor table-of-contents").html('');
      $(".draft_toc").html('');
      // Loop through documents in database
      var word_count = 0;
      snaps.forEach((doc) => {
        content = doc.data().content;
        drafts = doc.data().drafts;
        var type = doc.data().type;
        order = $('.order').length+1;
        if (type == 'Chapter'){
          type = "";
        }
        else {
          order = '';
        };
        var words = content.split(" ").length;
        word_count = word_count + words;
        
        var hidden = "<div class ='content-data hidden'>";
        if(drafts){
          draft_NUM = drafts.length;
          for (var i = 0; i < draft_NUM; i++) {
            var drafts = "<a class='drafts' value='"+i+"'>"+drafts[i]+"</a>";
            hidden = hidden + drafts;
          };
        };
        var content = "<a class='drafts'>"+doc.data().content+"</a>";
        var content_meta = "<div class='content_MetaData hidden'>\
                              <a><b>Type:</b></a><a class='right type' contenteditable='true'>"+doc.data().type+"</a>\
                              <a><b>POV:</b></a><a class='right' contenteditable='true'>"+doc.data().pov+"</a>\
                              <a><b>Order:</b></a><a class='right' contenteditable='true'>"+doc.data().order+"</a>\
                              <a><b>Word Count:</b></a><a class='right'>"+words+"</a>\
                              <a class='content-full underline'><b>Chapter Descrition</b></a>\
                              <a class='content-full' contenteditable='true'>"+doc.data().discription+"</a>\
                            </div>";



        var item = "<content class = 'order' id ='"+doc.id+"' value='"+order+"' name = '"+type+"' title ='"+doc.data().title+"'>\
                  "+content_meta+"\
                  "+ hidden + content+"<\div>\
                  </content>";
        $("editor table-of-contents").append(item);
        $('.hidden').hide();         
      });
    $("word-count").html(word_count);
    }); 
         
  });
   
  //adds new chapters and stuff.
  $(document).on('click','#AddContent', function(){
    const bookid = localStorage.getItem('bookid');
    if(bookid != null){
      firebase.firestore().collection("books").doc(bookid).collection('contents').add({
      timestamp: Date.now(),
      title: "Title",
      type: 'Chapter',
      pov: "",
      discription: "Write a description.",
      content: '',
      order: $('content').length,
      hidden: false,
      }).then(() => {
        console.log("Document successfully written!");
      }).catch((error) => {
        console.error("Error writing document: ", error);
      });
    };
  });
      
  $(document).on('click','content', function(){
    $('.content_MetaData').hide();
    $(".draft_toc").html('<hr>');
    $(this).children('.content_MetaData').show();
    $('content').removeClass('selected');
    $(this).addClass('selected');
    var content_type = $(this).attr('name');
    var content_order = $(this).attr('value');
    var content_title = $(this).attr('title');
    $('Content-Title').children('a').html(content_title);
    $('Content-Title').attr('value', content_order);
    $('Content-Title').attr('name', content_type);
    chapterID = $(this).attr('id');
    localStorage.setItem('ChapterID', chapterID);
    texteditor.root.innerHTML = $(this).children('.content-data').children('.drafts').last().html();
    var num_of_drafts = $(this).children('.content-data').children('.drafts').length
    for (var i = 0; i < num_of_drafts-1; i++) {
      var drafts = "<button class='circle draft'><b>"+(i+1)+"</b></button><br>"
      $(".draft_toc").append(drafts);
    };
  });


  $(document).on('click','#newDraft', function(){
    bookID = localStorage.getItem('bookid');
    chapterID = localStorage.getItem('ChapterID');
    var update = firebase.firestore().collection("books").doc(bookID).collection('contents').doc(chapterID);
      update.update({
        drafts: firebase.firestore.FieldValue.arrayUnion(texteditor.root.innerHTML),
      });
    $('content').attr("id", chapterID).trigger('click');
  });

  $(document).on('focusout','content-Title a', function(){//update meta data
    if($(this).attr('contenteditable')){
      var text = $(this).html();
      bookID = localStorage.getItem('bookid');
      chapterID = localStorage.getItem('ChapterID');
      var update = firebase.firestore().collection("books").doc(bookID).collection('contents').doc(chapterID);
      update.update({
          title: text,
      });
    };
  });

  $(document).on('focusout','#quill-editor', function(){//update meta data
    bookID = localStorage.getItem('bookid');
    chapterID = localStorage.getItem('ChapterID');
    var update = firebase.firestore().collection("books").doc(bookID).collection('contents').doc(chapterID);
    update.update({
      content: texteditor.root.innerHTML,
    });
  });

  $(document).on('click','button.draft', function(){
    var numb = Number($(this).text());
    $("#content-list").append(numb);

  });

}});