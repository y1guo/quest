import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc } from "firebase/firestore";
import { db } from "./firebase";

const auth = getAuth();

function login() {
    console.log("Loggin in...");

    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Logged in! Hello", user.displayName, "!");
        })
        .catch((error) => {
            console.log("Error logging in!");
        });
}

function logout() {
    console.log("Logging out...");

    auth.signOut()
        .then(() => {
            console.log("Logged out!");
        })
        .catch((error) => {
            console.log("Error logging out!");
        });
}

function userPath() {
    const docRef = doc(db, "users", auth.currentUser.uid);
    return docRef.path;
}

export { auth, login, logout, userPath };
