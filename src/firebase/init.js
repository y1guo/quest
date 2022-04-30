// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNqze4qJSfI18HzDxx6ZNd1_LbSt4Hx5I",
  authDomain: "system-yi.firebaseapp.com",
  projectId: "system-yi",
  storageBucket: "system-yi.appspot.com",
  messagingSenderId: "957758695166",
  appId: "1:957758695166:web:f6cdba69ab6f637d8267af",
  measurementId: "G-NVZHYDSCGM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
