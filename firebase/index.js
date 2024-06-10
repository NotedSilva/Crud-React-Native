import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const storage = getStorage(app);

export { app, db, storage, getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc };
