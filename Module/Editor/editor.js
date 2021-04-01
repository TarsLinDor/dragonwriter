import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import * as template from "./templates.js";

Load_TOC();
Load_TitlePage();
var db = firebase.firestore();

//load quill
/*data = {
        title:
        type:
        order:
        contents:
        }
*/
async function load_Writer(data){
  $('col-2').html('');
  template.Write_chap(data,'col-2');
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
};

async function Load_TitlePage(){
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var data = {
        booktitle: localStorage.getItem("booktitle"),
        author: firebase.auth().currentUser.displayName,
        type: localStorage.getItem("booktype"),
      };
  $('col-2').html('');
  template.TitlePage(data,'col-2');
    }});
};

async function Load_TOC() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var data = {
        booktitle: localStorage.getItem("booktitle"),
      };
      template.TableOfContents(data, "col-1");
      var bookID = localStorage.getItem("bookID");

      db.collection("books")//Load parts
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
            template.Part(part, "table-of-contents");
          });
        });

      db.collection("books")//load chapters
        .doc(bookID)
        .collection("contents")
        .where("type", "==", "Chapter")
        .onSnapshot(snaps => {
          $("editor part").html("");
          snaps.forEach(doc => {
            var wordcount = 10;
            var Chap = {
              chapID: doc.id,
              order: doc.data().order,
              type: doc.data().type,
              title: doc.data().title,
              pov: doc.data().pov,
              handle: "chapter",
              content: doc.data().content,
              description: doc.data().description,
              drafts: doc.data().drafts,
              words: wordcount,
            };
            template.Chapter(Chap, "#Part-" + doc.data().part);
            $("metadata").hide();
            $("drafts").hide();
          });
        });

        //load Prologue
        //load epilogue
        //load interlude
        //load acknoledgements
    }
  });
};

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
        title: "",
        type: "Chapter",
        pov: "",
        discription: "Write a description.",
        content: "",
        draft: [],
        order: $("chapter").length,
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

$(document).on("click", "chapter", function() {
  $(".content_MetaData").hide();
  $(".draft_toc").html("<hr>");
  $(this)
    .children("metadata")
    .show();
  $("chapter").removeClass("selected");
  $(this).addClass("selected");
  var order = $(this).children('line-1').children('chapter-title').attr("value");
  var title = $(this).children('line-1').children('chapter-title').html();
  var contents = $(this).children("drafts").children('.content').html();
  var chapterID = $(this).attr("id");
  var data = {title: title,
              order: order,
              contents: contents,
              }
  localStorage.setItem("ChapterID", chapterID);
  
  var num_of_drafts = $(this)
    .children("drafts")
    .children("a.draft").length;
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
