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

  $(document).on('click','#edit', function(){ //loads editor
      bookID = localStorage.getItem('bookid');
      booktitle = localStorage.getItem('booktitle');
      $('#booktitle').html(booktitle);
      db.collection("books").doc(bookID).collection('contents').orderBy('timestamp')
      //.where('hidden','==', false)
      .onSnapshot((snaps) => {
        // Reset page
        $("#content-list").html('');
        $(".draft_toc").html('<hr>');
        //$(".col-draft").hide();
        // Loop through documents in database
        var word_count = 0;
          snaps.forEach((doc) => {
            content = doc.data().content;
            drafts = doc.data().drafts;
            var words = content.split(" ").length;
            word_count = word_count + words;
            order = $('.order').length+1;
                  

                    var hidden = "<div class ='content-data hidden'>";
                    if(drafts){
                    draft_NUM = drafts.length;
                    for (var i = 0; i < draft_NUM; i++) {
                      var drafts = "<a class='drafts' value='"+i+"'>"+drafts[i]+"</a>";
                      hidden = hidden + drafts;
                    }
                    }

                    var content_title = "<a class='content_title title' > "+doc.data().title+"</a>"
                    var content_type = "<a class='content_title order'>0"+order+":</a>";
                    var content = "<a class='drafts'>"+doc.data().content+"</a>"
                    var content_meta = "<div class='content_MetaData hidden'>\
                                          <a><b>Type:</b></a><a class='right type' contenteditable='true'>"+doc.data().type+"</a>\
                                          <a><b>POV:</b></a><a class='right' contenteditable='true'>"+doc.data().pov+"</a>\
                                          <a><b>Word Count:</b></a><a class='right'>"+words+"</a>\
                                          <a class='content-full underline'><b>Chapter Descrition</b></a>\
                                          <a class='content-full' contenteditable='true'>"+doc.data().discription+"</a>\
                                        </div>";

                    if(doc.data().type != 'Chapter'){
                        content_type = "<a class='content_title'>"+doc.data().type+" "+order+":</a>";
                    }

                    var item = "<div class = 'leftmenu-list order' id ='"+doc.id+"'>\
                                  "+content_type+"\
                                  "+content_title+"\
                                  "+content_meta+"\
                                  "+ hidden + content+"<\div>\
                                </div>";
                    $("#content-list").append(item);

                  
                $('.hidden').hide();
                
                });
                $("#content-list").append(word_count);
                
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
                    order: $('.leftmenu-list').length,
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
      $(".draft_toc").html('<hr>');
      $('.leftmenu-list').css('background-color','#E3DCD7');
      $(this).children('.content_MetaData').show();
      $(this).css('background-color','#C6B9B0');
      var content_type = $(this).children('.content_MetaData').children('.type').html();
      if(content_type =='Chapter'){
        content_type = "";
      }
      var content_order = $(this).children('.order').html();
      var content_title = $(this).children('.title').html();
      $('#content_type').html(content_type);
      $('#numb').html(content_order);
      $('#Content_Title').html(content_title);
      chapterID = $(this).attr('id');
      localStorage.setItem('ChapterID', chapterID);
      texteditor.root.innerHTML = $(this).children('.content-data').children('.drafts').last().html();
      var num_of_drafts = $(this).children('.content-data').children('.drafts').length

      for (var i = 0; i < num_of_drafts-1; i++) {
        var drafts = "<button class='circle draft'><b>"+(i+1)+"</b></button><br>"
        $(".draft_toc").append(drafts);
        }

    });


      $(document).on('click','#newDraft', function(){
              bookID = localStorage.getItem('bookid');
              chapterID = localStorage.getItem('ChapterID');
              var update = firebase.firestore().collection("books").doc(bookID).collection('contents')
              .doc(chapterID);
              update.update({
                drafts: firebase.firestore.FieldValue.arrayUnion(texteditor.root.innerHTML),
              });
              $('.leftmenu-list').attr("id", chapterID).trigger('click');
          });

        $(document).on('focusout','#Content_Title', function(){//update meta data
          if($(this).attr('contenteditable')){
          var text = $(this).html();
          bookID = localStorage.getItem('bookid');
          chapterID = localStorage.getItem('ChapterID');
          var update = firebase.firestore().collection("books").doc(bookID).collection('contents')
              .doc(chapterID);
              update.update({
                title: text,
              });
              };
      });

          $(document).on('focusout','#quill-editor', function(){//update meta data
              bookID = localStorage.getItem('bookid');
              chapterID = localStorage.getItem('ChapterID');
              var update = firebase.firestore().collection("books").doc(bookID).collection('contents')
                  .doc(chapterID);
                  update.update({
                    content: texteditor.root.innerHTML,
                  });
                  
        });

        $(document).on('click','button.draft', function(){
          var numb = Number($(this).text());

          $("#content-list").append(numb);

          });

      








          

}});