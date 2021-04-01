// import stuff here
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import { Book, Menu } from "./templates.js";

var db = firebase.firestore();

LoadBooks();

async function LoadBooks() {
  var menu_data = { user: firebase.auth().currentUser.displayName };
  Menu(menu_data, "booklist-menu");
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("books")
        .where("user", "==", user.uid)
        .onSnapshot(snaps => {
          // Reset page
          $("booklist").html("");
          // Loop through documents in database
          snaps.forEach(doc => {
            var data = {
              bookID: doc.id,
              title: doc.data().title,
              genre: doc.data().genre,
              type: doc.data().type,
              perspective: doc.data().perspective,
              audience: doc.data().audience,
              tags: doc.data().tags
            };
            Book(data, "booklist");
          });
          $("MetaData").hide();
        });
    }
  });
}

$(document).on("click", "#addBook", function() {
  var title = $("#bookName").html();
  var newbook = db.collection("books").doc();
  if (title == "") {
    newbook
      .set({
        user: firebase.auth().currentUser.uid,
        timestamp: Date.now(),
        title: "Book Title",
        genre: "Fantasy",
        type: "Short Story",
        perspective: "3rd Person",
        audience: "Adult",
        order: $('book').length,
        tags: [],
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  } 
  $("#bookName").html("");
});

$(document).on("click", "booktitle", function() {
  $("book")
    .addClass("unselected")
    .removeClass("selected");
  $(this)
    .parent()
    .addClass("selected")
    .removeClass("unselected");
  localStorage.setItem(
    "bookID",
    $(this)
      .parent()
      .attr("id")
  );
  localStorage.setItem(
    "booktype",
    $(this)
      .parent()
      .children("metadata")
      .children("#type")
      .text()
  );
  localStorage.setItem("booktitle", $(this).text());
  $("#editor").trigger("change");
  $("MetaData").hide();
  $(this)
    .parent()
    .children("MetaData")
    .show();
});

$(document).on("focusout", "MetaData a.Item", function() {
  if ($(this).attr("contenteditable")) {
    var item = $(this).html();
    var itemid = $(this).attr("id");
    var bookid = $(this)
      .parent()
      .parent()
      .attr("id");
    var updatebook = firebase
      .firestore()
      .collection("books")
      .doc(bookid);
    updatebook.update({
      [itemid]: item
    });
  }
});

$(document).on("focusout", "booktitle", function() {
  var item = $(this).html();
  var itemid = $(this).attr("id");
  var bookid = $(this)
    .parent()
    .attr("id");
  var updatebook = firebase
    .firestore()
    .collection("books")
    .doc(bookid);
  updatebook.update({
    title: item
  });
});

$(document).on("click", ".addtag", function() {
  var tag = $(this)
    .parent()
    .children(".tagname")
    .text();
  var bookid = $(this)
    .parent()
    .parent()
    .parent()
    .attr("id");
  var updatebook = firebase
    .firestore()
    .collection("books")
    .doc(bookid);
  updatebook.update({
    tags: firebase.firestore.FieldValue.arrayUnion(tag)
  });
});
