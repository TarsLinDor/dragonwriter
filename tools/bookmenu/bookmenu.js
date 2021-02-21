
async function newbook(firebase) {
  var db = firebase.firestore();
  addBook.addEventListener('click', 
  function(){
    var newbook = db.collection("book").doc();
    if(bookName == null){
    
    
    newbook.set({
        title: "Book Title",
        genre: "Fantasy",
        lenght: "Short Story",
        perspective: '3rd Person',
        audience: 'YA',
        tags: [null]
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
        title: bookName.innerText,
        genre: "Fantasy",
        lenght: "Short Story",
        perspective: '3rd Person',
        audience: 'YA',
        tags: [null]
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

    };
    bookName.innerText = null;
  });


};