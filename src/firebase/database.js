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
import { useState } from "react";

const db = getFirestore();

const uid = () => getAuth().currentUser.uid;

export function listenToUserData(path, setData) {
  const unsubscribe = onSnapshot(
    query(collection(db, "users", uid(), path)),
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
  });
}

export function firestoreSaveQuest(quest, id, onSuccess, onFail) {
  setDoc(doc(db, "users", uid(), "active", id), quest).then(onSuccess, onFail);
}

export function firestoreMoveQuestToTrash(quest, id, onSuccess, onFail) {
  setDoc(doc(db, "users", uid(), "trash", id), quest).then(
    deleteDoc(doc(db, "users", uid(), "active", id)).then(onSuccess, onFail),
    onFail
  );
}
