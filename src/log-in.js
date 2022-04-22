import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function logIn(passUser) {
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
            console.log("Logged in! Hello", user.displayName, "!");
            passUser(user);
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
