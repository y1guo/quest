import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  addDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState } from "react";

const db = getFirestore();

export function listenToUserData(path, setData) {
  const uid = getAuth().currentUser.uid;
  const unsubscribe = onSnapshot(
    query(collection(db, "users", uid, path)),
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

export function createEmptyQuest(type) {
  const uid = getAuth().currentUser.uid;
  const currentTime = Timestamp.now();
  addDoc(collection(db, "users", uid, "active"), {
    type: type,
    title: "",
    description: "", // description not needed
    note: "",
    dateAdded: currentTime,
    dateModified: currentTime,
    dateActive: currentTime,
    dateExpire: null,
    prerequisite: [],
  });
}

export function saveQuest(quest, id, onSuccess, onFail) {
  const uid = getAuth().currentUser.uid;
  const currentTime = Timestamp.now();
  setDoc(doc(db, "users", uid, "active", id), {
    ...quest,
    dateModified: currentTime,
  }).then(onSuccess, onFail);
}
