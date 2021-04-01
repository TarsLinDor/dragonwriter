import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import { Editor, Chapter, Part, Prologe } from "./templates.js";

LoadEditor();
var db = firebase.firestore();

//load quill  wysiwyg editor
async function loadquill(content){
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    [{ align: "" }, { align: "center" }, { align: "right" }],
    ["clean"]
  ];
  var texteditor = new Quill("#quill-editor", {
    modules: {
      toolbar: toolbarOptions
    },
    theme: "snow",
    placeholder: "      Oh! the places you'll go..."
  });
  texteditor.root.html(content)
};

async function LoadEditor() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var data = {
        booktitle: localStorage.getItem("booktitle"),
        author: 'Author Name',
        type: localStorage.getItem("booktype"),
      };
      Editor(data, "editor");
      loadquill();
      var bookID = localStorage.getItem("bookID");
      db.collection("books")
        .doc(bookID)
        .collection("contents")
        .where("type", "==", "Part")
        .onSnapshot(snaps => {
          // Reset page
          $("editor table-of-contents").html("");
          $(".draft_toc").html("");
          // Loop through documents in database
          snaps.forEach(doc => {
            var part = {
              partID: "Part-" + doc.data().order,
              title: doc.data().title,
              order: doc.data().order,
              type: doc.data().type
            };
            Part(part, "table-of-contents");
          });
        });
        $("editor part").html("");
      db.collection("books")
        .doc(bookID)
        .collection("contents")
        .where("type", "==", "Chapter")
        .onSnapshot(snaps => {
          snaps.forEach(doc => {
            var part = doc.data().part;
            var content = doc.data().contents;
            var wordcount = content;
            var Chap = {
              chapID: doc.id,
              order: doc.data().order,
              type: doc.data().type,
              title: doc.data().title,
              pov: doc.data().pov,
              handle: "chapter",
              content: doc.data().content,
              description: doc.data().description,
              words: wordcount
            };
            Chapter(Chap, "#Part-" + part);
          });
          $("metadata").hide();
          //$("chapter").hide();
        });
    }
  });
}

$(document).on("dblclick", "part", function(e) {
  $(this)
    .children("chapter")
    .toggle();
  e.stopPropagation();
});

$(document).on("dblclick", "chapter", function(event) {
  $(this)
    .children("metadata")
    .toggle();
  event.stopPropagation();
});
//adds new chapters and stuff.
$(document).on("click", "#AddChapter", function() {
  const bookid = localStorage.getItem("bookid");
  if (bookid != null) {
    firebase
      .firestore()
      .collection("books")
      .doc(bookid)
      .collection("contents")
      .add({
        timestamp: Date.now(),
        title: "Title",
        type: "Chapter",
        pov: "",
        discription: "Write a description.",
        content: "",
        order: $("Chapter").length,
        hidden: false,
        part: $("part").length,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  }
});

$(document).on("click", "#AddPart", function() {
  const bookid = localStorage.getItem("bookid");
  if (bookid != null) {
    firebase
      .firestore()
      .collection("books")
      .doc(bookid)
      .collection("contents")
      .add({
        timestamp: Date.now(),
        title: "Title",
        type: "Part",
        pov: "",
        discription: "Write a description.",
        content: "",
        order: $("part").length,
        hidden: false
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  }
});

$(document).on("click", "content", function() {
  $(".content_MetaData").hide();
  $(".draft_toc").html("<hr>");
  $(this)
    .children(".content_MetaData")
    .show();
  $("content").removeClass("selected");
  $(this).addClass("selected");
  var content_type = $(this).attr("name");
  var content_order = $(this).attr("value");
  var content_title = $(this).attr("title");
  $("Content-Title")
    .children("a")
    .html(content_title);
  $("Content-Title").attr("value", content_order);
  $("Content-Title").attr("name", content_type);
  chapterID = $(this).attr("id");
  localStorage.setItem("ChapterID", chapterID);
  texteditor.root.innerHTML = $(this)
    .children(".content-data")
    .children(".drafts")
    .last()
    .html();
  var num_of_drafts = $(this)
    .children(".content-data")
    .children(".drafts").length;
  for (var i = 0; i < num_of_drafts - 1; i++) {
    var drafts =
      "<button class='circle draft'><b>" + (i + 1) + "</b></button><br>";
    $(".draft_toc").append(drafts);
  }
});

$(document).on("click", "#newDraft", function() {
  bookID = localStorage.getItem("bookid");
  chapterID = localStorage.getItem("ChapterID");
  var update = firebase
    .firestore()
    .collection("books")
    .doc(bookID)
    .collection("contents")
    .doc(chapterID);
  update.update({
    drafts: firebase.firestore.FieldValue.arrayUnion(texteditor.root.innerHTML)
  });
  $("content")
    .attr("id", chapterID)
    .trigger("click");
});

$(document).on("focusout", "content-Title a", function() {
  //update meta data
  if ($(this).attr("contenteditable")) {
    var text = $(this).html();
    bookID = localStorage.getItem("bookid");
    chapterID = localStorage.getItem("ChapterID");
    var update = firebase
      .firestore()
      .collection("books")
      .doc(bookID)
      .collection("contents")
      .doc(chapterID);
    update.update({
      title: text
    });
  }
});

$(document).on("focusout", "#quill-editor", function() {
  //update meta data
  bookID = localStorage.getItem("bookid");
  chapterID = localStorage.getItem("ChapterID");
  var update = firebase
    .firestore()
    .collection("books")
    .doc(bookID)
    .collection("contents")
    .doc(chapterID);
  update.update({
    content: texteditor.root.innerHTML
  });
});

$(document).on("click", "button.draft", function() {
  var numb = Number($(this).text());
  $("#content-list").append(numb);
});
