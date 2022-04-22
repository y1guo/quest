import { getAuth, signOut } from "firebase/auth";

export default function logOut() {
    console.log("Logging out...");

    const auth = getAuth();
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log("Logged out!");
        })
        .catch((error) => {
            // An error happened.
            console.log("Error logging out!");
        });
}
