import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";

firebase.auth().onAuthStateChanged((user) => {//Loads books 
  if(user){
    firebase.firestore().collection("books").where('user', '==', user.uid) //.orderBy('timestamp', 'desc')
          .onSnapshot((snaps) => {   //Load Users books
          // Reset page
          $("#booklist").html('');
          // Loop through documents in database

          snaps.forEach((doc) => {
            var item = "<div class='book_info' >\
                        <div class='booklist_item'>\
                        <a class='booklist_title' id ='"+doc.id+"'>"+ doc.data().title+ "</a>\
                        <i class='fas fa-chevron-down dropdown'></i>\
                        </div>\
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
                        </div></div>";

            $("#booklist").append(item);
            //TODO: fix tags
            var booktags = doc.data().tags;
            var i;
            for (i = 0; i < booktags.length; i++) {
              var tags = '<a class = "tag">'+booktags[i]+'</a>';
              $('#tag'+doc.id+'').append(tags);
              };
              
            }); 
          });
        };
});
  
$(document).on('click','#book', function(){ // defines events when the book button is clicked.
  $('.app').toggleClass('app-full');
  $('.app').toggleClass('app-side');
  $('#bookmenu').toggle(); 
  $('.booklist_MetaData').hide();
});

$(document).on('click','#addBook', function(){ // adds a new book to the book tab bar.
  firebase.auth().onAuthStateChanged((user) => { // must call to define the user
    if(user){
        var title = $("#bookName").html();
        var newbook = firebase.firestore().collection("books").doc();
        if(title ==''){
        newbook.set({
            user: firebase.auth().currentUser.uid,
            timestamp: Date.now(),
            title: "Book Title",
            genre: "Fantasy",
            length: "Short Story",
            perspective: '3rd Person',
            audience: 'Adult',
            tags: ["test", 'grimdark']
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
            tags: [""]
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
        };
        $("#bookName").html('');
        };
        });
});
    


$(document).on('click','.dropdown', function(){ //adds book meta data drop down
  //TODO: add update features options
    $(this).toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
    $(this).parent().parent().children('.booklist_MetaData').toggle();
});

$(document).on('click','.booklist_title', function(){//selects book  
    $('.selected_book').addClass('booklist_item').removeClass('selected_book');
    $(this).parent().addClass('selected_book').removeClass('booklist_item');
    localStorage.setItem('bookid', $(this).attr('id'));
    localStorage.setItem('booktitle', $(this).text());
    $('#booktitle').html(localStorage.getItem('booktitle'));
    if ($('#editor').is(':visible')){ // only load if visible
      load_TOC(this);
    };
});


async function updatebook_meta(){
  $(document).on('focusout','.MetaData_Item', function(){
    if($(this).attr('contenteditable')){
    var item = $(this).html();
    var itemid = $(this).attr('id');
    var bookid = $(this).parent().parent().children('.booklist_item').children('.booklist_title').attr('id');
    firebase.auth().onAuthStateChanged((user) => { // must call to define the user
    if(user){
        var updatebook = firebase.firestore().collection("books").doc(bookid);
        updatebook.update({
          [itemid]: item,
        });
        };
        //newbook.update({
    });
    };
    });
  //$('.booklist_MetaData').hide();
  $(this).parent().parent.show();
};