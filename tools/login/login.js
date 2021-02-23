import firebase from 'index.js';

const login_screen = document.getElementById('login_screen');
const logout = document.getElementById('logout');

async function login(firebase){
  // Add Firebase project configuration object here
  var firebaseConfig = {};
  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        console.log("Login successfull!");
        

        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#login_window', uiConfig);

   // Listen to the current Auth state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
    login_screen.style.display ='none';
    }
    else {
    login_screen.style.display ='grid';
    }
  });
};



function userlogout(firebase){
  logout.addEventListener('click', 
  function(){
    if (firebase.auth().currentUser) {
      // User is signed in, let's sign out
      firebase.auth().signOut();
    } 
  });
};

export {userlogout, login};

