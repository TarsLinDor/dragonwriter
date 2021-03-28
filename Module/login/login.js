import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as firebaseui from "firebaseui";
import $ from "jquery";
import './login.css';



/*$(document).ready(function() {
  $("body").load('./login.html');
});
*/

$( "login" ).get( "./login.html .welcome" );


async function login_logout(){ // Logs users in and out of DragonWriter.

      const uiConfig = {
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [
          // Email / Password Provider.
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
          tosUrl: '<your-tos-link>',
          privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
          callbacks: {
          signInSuccessWithAuthResult: function() {
            // Handle sign-in.
            console.log('sign in successfull');
            return false;
          }
        }
      };

      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('firebaseUI-login', uiConfig);

      // Listen to the current Auth state
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        $('login').hide();
        }
        else {
        $('login').show();
        }
      });

      $('#logout').on('click', function(){
        if (firebase.auth().currentUser) {
          // User is signed in, let's sign out
          firebase.auth().signOut();
          console.log("Logged out successfully!");
        } 
      });
};

login_logout();