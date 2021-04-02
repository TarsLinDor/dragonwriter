import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import * as template from "./templates.js";
import Sort from "./Sort.js";
import wordcount from "wordcount";
var db = firebase.firestore();
Load_Parts();
Load_TitlePage();

$(document).on("change", "#editor", function() {
  Load_Parts();
  Load_TitlePage();
});

async function Load_Writer(data,draft) {
  $("col-2").html("");
  template.Write_chap(data, "col-2");
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
  Load_Draft(draft,texteditor);
  $(document).on("focusout", "#quill-editor", function() {
    var bookID = localStorage.getItem("bookID");
    var chapterID = localStorage.getItem("chapterID");
    var update = firebase
      .firestore()
      .collection("books")
      .doc(bookID)
      .collection("chapters")
      .doc(chapterID)
      .collection('content')
      .doc('content');
    update.update({
      content: texteditor.root.innerHTML
    });
    
  });
  
};

async function Load_TitlePage() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var data = {
        booktitle: localStorage.getItem("booktitle"),
        author: firebase.auth().currentUser.displayName,
        type: localStorage.getItem("booktype")
      };
      $("col-2").html("");
      template.TitlePage(data, "col-2");
    }
  });
}

async function Load_Parts() {
  $("col-1").html("");
  var bookID = localStorage.getItem("bookID");
  var data = {
    booktitle: localStorage.getItem("booktitle")
  };
  template.TableOfContents(data, "col-1");
  db.collection("books")
    .doc(bookID)
    .collection("parts")
    .orderBy("order", "desc")
    .onSnapshot(snaps => {
      $("part").remove();
      snaps.forEach(doc => {
        var part = {
          partID: doc.id,
          title: doc.data().title,
          order: doc.data().order
        };
        template.Part(part, "table-of-contents");
        Sort(part.partID, "Chapter", "handle", "chosen", "ignore");
      });
      Load_Chapters();
    });
}

async function Load_Chapters() {
  var bookID = localStorage.getItem("bookID");
  db.collection("books") //load chapters
    .doc(bookID)
    .collection("chapters")
    .orderBy("order")
    .onSnapshot(snaps => {
      $("chapter").remove();
      var total_words = 0;
      snaps.forEach(doc => {
        var wordcount = '';
        var Chap = {
          chapID: doc.id,
          order: doc.data().order,
          type: doc.data().type,
          title: doc.data().title,
          pov: doc.data().pov,
          handle: "handle",
          content: doc.data().content,
          description: doc.data().description,
          words: wordcount
        };
        if (doc.data().part == "") {
          var part = "table-of-contents";
        } else {
          var part = "#" + doc.data().part;
        }
        template.Chapter(Chap, part);

        $("chapter metadata").hide();
        $("drafts").hide();
        
      });
      $('word-count').html(total_words);
      var chapterID = localStorage.getItem("chapterID");
      $('#'+chapterID).trigger('click');
    });
}

async function Load_Draft(data,quill){
  $("col-3").html("");
  template.Draft(data, 'col-3')
    $(document).on("click", "#addDraft", function() {
    var bookID = localStorage.getItem("bookID");
    var chapterID = localStorage.getItem("chapterID");
    var update = firebase
      .firestore()
      .collection("books")
      .doc(bookID)
      .collection("chapters")
      .doc(chapterID)
      .collection('content')
      .doc('content');
    update.update({
      draft: firebase.firestore.FieldValue.arrayUnion(quill.root.innerHTML),
      draft_num: firebase.firestore.FieldValue.arrayUnion(data.draft_num+1),
    });
});
}

$(document).on("click", "part i", function() {
  $(this)
    .parent("row1")
    .parent("part")
    .children("chapter")
    .toggle();
  $(this)
    .toggleClass("fa-chevron-up")
    .toggleClass("fa-chevron-down");
});

//adds new chapters and stuff.
$(document).on("click", "#AddChapter", function() {
  if (
    $("part")
      .last()
      .attr("id")
  ) {
    var partID = $("part")
      .last()
      .attr("id");
    var type = "Chapter";
    var order = $("chapter.Chapter").length + 1;
  } else {
    var partID = "";
    var type = "Prologue";
    order = "";
  }
  var bookID = localStorage.getItem("bookID");
  if (bookID != null) {
  var addChap = firebase
      .firestore()
      .collection("books")
      .doc(bookID)
      .collection("chapters").doc();

      addChap.set({
        order: order,
        title: "Title",
        type: type,
        discription: "Write a description.",
        hidden: false,
        part: partID
      });

      addChap.collection('content').doc('content').set({
        content: "",
        draft: [],
        draft_num: [1],
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
  var bookID = localStorage.getItem("bookID");
  if (bookID != null) {
    firebase
      .firestore()
      .collection("books")
      .doc(bookID)
      .collection("parts")
      .add({
        title: "Title",
        pov: [],
        discription: "Write a description.",
        order: $("part").length + 1
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
  $("chapter metadata").hide();
  $(this)
    .children("metadata")
    .show();
  $("chapter").removeClass("selected");
  $(this).addClass("selected");
  var order = $(this)
    .attr("value");
  var type = $(this)
    .attr("name");
  var title = $(this)
    .children("line-1")
    .children("chapter-title")
    .children("a")
    .html();
  var chapterID = $(this).attr("id");
  var bookID = localStorage.getItem("bookID");
  localStorage.setItem("chapterID", chapterID);
  var draft_num =
    $(this)
      .children("drafts")
      .children("a.draft").length + 1;
  db.collection("books") //load chapters
    .doc(bookID)
    .collection("chapters")
    .doc(chapterID)
    .collection('content')
    .doc('content')
    .onSnapshot((doc) => {
          var chap = {
          title: title,
          order: order,
          type: type,
          content: doc.data().content,
          draft_num: doc.data().draft_num
          
        };
        var draft ={
          draft: doc.data().draft,
          draft_num: doc.data().draft_num
          };
        Load_Writer(chap,draft);
      });

});

$(document).on("focusout", "part-title a", function() {
  //update meta data
  if ($(this).attr("contenteditable")) {
    var text = $(this).text();
    if (text) {
      var bookID = localStorage.getItem("bookID");
      var partID = $(this)
        .parent()
        .parent()
        .parent()
        .attr("id");
      var update = firebase
        .firestore()
        .collection("books")
        .doc(bookID)
        .collection("parts")
        .doc(partID);
      update.update({
        title: text
      });
    }
  }
});

$(document).on("focusout", "content-title a", function() {
  //update meta data
  if ($(this).attr("contenteditable")) {
    var text = $(this).text();
    if (text) {
      var bookID = localStorage.getItem("bookID");
      var chapterID = localStorage.getItem("chapterID");
      var update = firebase
        .firestore()
        .collection("books")
        .doc(bookID)
        .collection("chapters")
        .doc(chapterID);
      update.update({
        title: text
      });
    }
  }
});
