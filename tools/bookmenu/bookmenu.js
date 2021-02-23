async function newbook(firebase) {
  var db = firebase.firestore();
  addBook.addEventListener('click', 
  function(){
    var newbook = db.collection("book").doc();
    if(bookName == null){
    
    
    newbook.set({
        userId: firebase.auth().currentUser.uid,
        timestamp: Date.now(),
        title: "Book Title",
        genre: "Fantasy",
        length: "Short Story",
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
        userId: firebase.auth().currentUser.uid,
        timestamp: Date.now(),
        title: bookName.innerText,
        genre: "Fantasy",
        length: "Short Story",
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

async function viewbooks(firebase){
  var db = firebase.firestore();
  
  var userBooks = db.collection("books").where('userId', '==', "");
  const test = document.getElementById('test');
  test.intnerHtml = userBooks.orderBy('title');

};