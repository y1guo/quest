import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";

function logIn(updater) {
    console.log("Logging in...");

    const provider = new GoogleAuthProvider();

    // firebase.auth().useDeviceLanguage();

    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            updater(user);
            console.log("Logged in! Hello", user.displayName, "!");
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log("Error logging in!");
        });
}

function logOut(updater) {
    console.log("Logging out...");

    const auth = getAuth();
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            updater();
            console.log("Logged out!");
        })
        .catch((error) => {
            // An error happened.
            console.log("Error logging out!");
        });
}

export { logIn, logOut };
