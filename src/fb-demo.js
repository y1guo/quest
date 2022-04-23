import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./init-fb";

async function fsAddDoc() {
    try {
        const docRef = await addDoc(collection(db, "active"), {
            first: "Ada",
            last: "Lovelace",
            born: 1815,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function fsGetDocs() {
    const querySnapshot = await getDocs(collection(db, "active"));
    querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        console.log(doc.id);
        for (var e in doc.data()) {
            console.log(e, doc.data()[e]);
        }
    });
}

export { fsAddDoc, fsGetDocs };
