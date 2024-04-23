// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc,  getDocs } from "firebase/firestore";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFQ7AlKMBGwpeb93WUwcUffPfd_Iw7PHs",
  authDomain: "crud-react-native-d04cd.firebaseapp.com",
  projectId: "crud-react-native-d04cd",
  storageBucket: "crud-react-native-d04cd.appspot.com",
  messagingSenderId: "67665741676",
  appId: "1:67665741676:web:989c8a5a88ccc5d33d5549"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app ,db ,getFirestore, collection, addDoc, getDocs};