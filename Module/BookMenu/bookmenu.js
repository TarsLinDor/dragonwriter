// import stuff here
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";

// define global variables
async function bookmenu(){
  var db = firebase.firestore();
  firebase.auth().onAuthStateChanged((user) => { if(user){// all functions should be done only if user is logged in

    db.collection("books").where('user', '==', user.uid).onSnapshot((snaps) => { //Load Books
            // Reset page
            $("#booklist").html('');
            // Loop through documents in database
            var count = 0;
            snaps.forEach((doc) => {
              
              var item = "<div class='book_info' id ='"+doc.id+"'>\
                          \
                          <div class='booklist_item'>\
                          <a class='booklist_title' contenteditable='true' id='title'>"+ doc.data().title+ "</a>\
                          <i class='fas fa-chevron-down dropdown'></i>\
                          </div>\
                          \
                          <div class='booklist_MetaData'><a class='MetaData_Item'><b>Genre: </b></a>\
                            <a class='MetaData_Item' contenteditable='true' id='genre'>"+doc.data().genre+"</a>\
                            <a class='MetaData_Item'><b>Length:</b></a>\
                            <a class='MetaData_Item' contenteditable='true' id = 'length'>"+doc.data().length+"</a>\
                            <a class='MetaData_Item'><b>Perspective:</b></a>\
                            <a class='MetaData_Item' contenteditable='true' id = 'perspective'>"+doc.data().perspective+"</a>\
                            <a class='MetaData_Item'><b>Audience:</b></a>\
                            <a class='MetaData_Item' contenteditable='true' id = 'audience'>"+doc.data().audience+"</a><br>\
                            <a class='MetaData_Title'><b>Tags</b></a>\
                            <div class='Taglist' id ='tag"+doc.id+"'>\
                              <br>\
                            </div>\
                            <div class='insertTag'>\
                            <a class='TagName' contenteditable='true' placeholder='Add Tag'></a>\
                            <a class='addTag'><i class='fas fa-plus'></i></a>\
                            </div>\
                          </div>";

              $("#booklist").append(item);
              //TODO: fix tags
              var booktags = doc.data().tags;
              var i;
              for (i = 0; i < booktags.length; i++) {
                var tags = '<a class = "tag" contenteditable="true" id="'+i+'">'+booktags[i]+'</a>';
                $('#tag'+doc.id+'').append(tags);
                };
              }); 
              $('.booklist_title').first().trigger('click');
      });

  $(document).on('click','#book', function(){ // defines events when the book button is clicked.
        $('.app').toggleClass('app-full');
        $('.app').toggleClass('app-side');
        $('#bookmenu').toggle(); 
        //$('.booklist_MetaData').hide();
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
        
  $(document).on('click','.dropdown', function(){ //adds book meta data drop down
          $(this).toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
          $(this).parent().parent().children('.booklist_MetaData').toggle();
      });

  
  //select book
  $(document).on('click','.booklist_title', function(){//selects book  
          $('.selected_book').addClass('booklist_item').removeClass('selected_book');
          $(this).parent().addClass('selected_book').removeClass('booklist_item');
          localStorage.setItem('bookid', $(this).parent().parent().attr('id'));
          localStorage.setItem('booktitle', $(this).text());
          $('#edit').trigger('click');
      });
  //select book

  $(document).on('focusout','.MetaData_Item', function(){//update meta data
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
  $(document).on('focusout','.booklist_title', function(){//update meta data
          var item = $(this).html();
          var itemid = $(this).attr('id');
          var bookid = $(this).parent().parent().attr('id');
          var updatebook = firebase.firestore().collection("books").doc(bookid);
              updatebook.update({
                [itemid]: item,
              });
              
    });
  $(document).on('click','.addTag', function(){
        var tag = $(this).parent().children('.TagName').text();
        
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