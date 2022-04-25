import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

export { auth, login, logout };
