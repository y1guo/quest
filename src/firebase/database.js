import {
    collection,
    doc,
    getFirestore,
    onSnapshot,
    query,
    addDoc,
    setDoc,
    Timestamp,
    deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

const uid = () => getAuth().currentUser.uid;

export function listenToUserData(setData, ...pathSegments) {
    const unsubscribe = onSnapshot(
        query(collection(db, "users", uid(), ...pathSegments)),
        (querySnapshot) => {
            const allDocs = {};
            querySnapshot.forEach((doc) => {
                allDocs[doc.id] = doc.data();
            });
            setData(allDocs);
        }
    );
    return unsubscribe;
}

export function firestoreCreateEmptyQuest(type) {
    const currentTime = Timestamp.now();
    addDoc(collection(db, "users", uid(), "active"), {
        type: type,
        title: "",
        note: "",
        dateAdded: currentTime,
        dateModified: currentTime,
        dateActive: currentTime,
        dateExpire: null,
        priority: null,
        prerequisite: [],
    });
}

export function firestoreSaveQuest(quest, id, onSuccess, onFail) {
    setDoc(doc(db, "users", uid(), "active", id), quest).then(
        onSuccess,
        onFail
    );
}

export function firestoreMoveQuestToTrash(quest, id, onSuccess, onFail) {
    setDoc(doc(db, "users", uid(), "trash", id), quest).then(
        deleteDoc(doc(db, "users", uid(), "active", id)).then(
            onSuccess,
            onFail
        ),
        onFail
    );
}

export function firestoreCreateEmptyLog(id) {
    const currentTime = Timestamp.now();
    addDoc(collection(db, "users", uid(), "active", id, "logs"), {
        date: currentTime,
        note: "",
        dateAdded: currentTime,
        dateModified: currentTime,
    });
}
