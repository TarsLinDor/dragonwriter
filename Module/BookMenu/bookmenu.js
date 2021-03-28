// import stuff here
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import './bookmenu.css';

// define global variables
async function bookmenu(){
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged((user) => { if(user){// all functions should be done only if user is logged in

    db.collection("books").where('user', '==', user.uid)
    .onSnapshot((snaps) => { //Load Books
            // Reset page
            $("booklist").html('');
            // Loop through documents in database
            var count = 0;
            snaps.forEach((doc) => {
              
              var item = "<book id ='"+doc.id+"'>\
                          <booktitle contenteditable='true' placeholder='Book Title'>"+ doc.data().title+ "</booktitle>\
                            <MetaData>\
                              <a class='Item'><b>Genre: </b></a>\
                              <a class='Item' contenteditable='true' id='genre'>"+doc.data().genre+"</a>\
                              <a class='Item'><b>Length:</b></a>\
                              <a class='Item' contenteditable='true' id = 'length'>"+doc.data().length+"</a>\
                              <a class='Item'><b>Perspective:</b></a>\
                              <a class='Item' contenteditable='true' id = 'perspective'>"+doc.data().perspective+"</a>\
                              <a class='Item'><b>Audience:</b></a>\
                              <a class='Item' contenteditable='true' id = 'audience'>"+doc.data().audience+"</a><br>\
                              <a class='Title'><b>Tags</b></a>\
                              <tag id ='tag"+doc.id+"'></tag>\
                              <addTag>\
                                <a class='tagname' contenteditable='true' placeholder='Add Tag'></a>\
                                <button class = 'addtag'><i class='fas fa-plus'></i></button>\
                              </addTag>\
                            </MetaData>\
                          </book>";

              $("booklist").append(item);
              $('MetaData').hide();
              //TODO: fix tags
              var booktags = doc.data().tags;
              var i;
              for (i = 0; i < booktags.length; i++) {
                var tags = '<a class = "tag" contenteditable="true" id="'+i+'">'+booktags[i]+'</a>';
                $('#tag'+doc.id+'').append(tags);
                };
              }); 
              $('booktitle').first().trigger('click');
      });

  $(document).on('click','#addBook', function(){ // adds a new book to the book tab bar.
        var title = $("#bookName").html();
        var newbook = db.collection("books").doc();
              if(title ==''){
              newbook.set({
                  user: firebase.auth().currentUser.uid,
                  timestamp: Date.now(),
                  title: "Book Title",
                  genre: "Fantasy",
                  length: "Short Story",
                  perspective: '3rd Person',
                  audience: 'Adult',
                  tags: []
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
                  title: title,
                  genre: "Fantasy",
                  length: "Novel",
                  perspective: '3rd Person',
                  audience: 'Adult',
                  tags: []
              })
              .then(() => {
                console.log("Document successfully written!");
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
              });
              };
              $("#bookName").html('');

      });

  
  //select book
  $(document).on('click','booktitle', function(){//selects book  
          $('book').addClass('unselected').removeClass('selected');
          $(this).parent().addClass('selected').removeClass('unselected');
          localStorage.setItem('bookid', $(this).parent().attr('id'));
          localStorage.setItem('booktitle', $(this).text());
          //$('#editor').trigger('click');
          $('MetaData').hide()
          $(this).parent().children('MetaData').show()
      });
  //select book

  $(document).on('focusout','MetaData a.Item', function(){//update meta data
          if($(this).attr('contenteditable')){
          var item = $(this).html();
          var itemid = $(this).attr('id');
          var bookid = $(this).parent().parent().attr('id');
          var updatebook = firebase.firestore().collection("books").doc(bookid);
              updatebook.update({
                [itemid]: item,
              });
              };
      });
  $(document).on('focusout','booktitle', function(){//update meta data
          var item = $(this).html();
          var itemid = $(this).attr('id');
          var bookid = $(this).parent().attr('id');
          var updatebook = firebase.firestore().collection("books").doc(bookid);
              updatebook.update({
                title: item,
              });
              
    });
  $(document).on('click','.addtag', function(){
        var tag = $(this).parent().children('.tagname').text();
        
        //if(tag !=''){
        var bookid = $(this).parent().parent().parent().attr('id');
            var updatebook = firebase.firestore().collection("books").doc(bookid);
            updatebook.update({
              tags: firebase.firestore.FieldValue.arrayUnion(tag)
            });
        tag
            //newbook.update({
        });


      };
    });
};

export default bookmenu();