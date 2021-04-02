import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import $ from "jquery";
import * as template from "./templates.js";
import Sort from "./Sort.js";
import wordcount from 'wordcount'
var db = firebase.firestore();

$(document).on('change', '#editor', function(){
  Load_Parts();
  Load_TitlePage();
})



async function Load_Writer(data) {
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
  //texteditor.root.innerHTML = data.content;
  $(document).on("focusout", "#quill-editor", function() {
    var bookID = localStorage.getItem("bookID");
    var chapterID = localStorage.getItem("chapterID");
    var update = firebase
      .firestore()
      .collection("books")
      .doc(bookID)
      .collection("chapters")
      .doc(chapterID);
    update.update({
      content: texteditor.root.innerHTML
    });
  });
}

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
    .orderBy("order",'desc')
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
        var wordcount = 10;
        var Chap = {
          chapID: doc.id,
          order: doc.data().order,
          type: doc.data().type,
          title: doc.data().title,
          pov: doc.data().pov,
          handle: "handle",
          content: doc.data().content,
          description: doc.data().description,
          drafts: doc.data().drafts,
          words: wordcount
        };
        if(doc.data().part == ""){
          var part = 'table-of-contents';
        }
        else{
          var part = '#'+doc.data().part;
        }
        template.Chapter(Chap, part);
        
        $("chapter metadata").hide();
        $("drafts").hide();
      });
    });
};

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
  if($("part").last().attr('id')){
  var partID = $("part").last().attr('id');
  var type = 'Chapter';
  var order = $("chapter.Chapter").length + 1;
  }
  else{
    var partID ='';
    var type = 'Prologue';
    order = '';
  }
  var bookID = localStorage.getItem("bookID");
  if (bookID != null) {
    firebase
      .firestore()
      .collection("books")
      .doc(bookID)
      .collection("chapters")
      .add({
        order: order,
        title: "Title",
        type: type,
        pov: "",
        discription: "Write a description.",
        content: "",
        draft: [],
        hidden: false,
        part: partID,
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
        order: $("part").length + 1,
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
    .children("line-1")
    .children("chapter-title")
    .attr("value");
  var title = $(this)
    .children("line-1")
    .children("chapter-title")
    .children("a")
    .html();
  var content = $(this)
    .children("drafts")
    .children(".content")
    .html();
  var chapterID = $(this).attr("id");
  localStorage.setItem("chapterID", chapterID);
  var draft_num =
    $(this)
      .children("drafts")
      .children("a.draft").length + 1;
  var data = {
    title: title,
    order: order,
    type: type,
    content: content,
    draft_num: draft_num
  };
  Load_Writer(data);
  
});



$(document).on("focusout", "part-title a", function() {
  //update meta data
  if ($(this).attr("contenteditable")) {
    var text = $(this).text();
    if (text) {
      var bookID = localStorage.getItem("bookID");
      var partID = $(this).parent().parent().parent().attr('id');
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


