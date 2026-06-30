import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBh2KCVVifmT5Gzz9NE5A7OnnyS5c2RTsA",
  authDomain: "sepidan-d192d.firebaseapp.com",
  projectId: "sepidan-d192d",
  storageBucket: "sepidan-d192d.firebasestorage.app",
  messagingSenderId: "688114065376",
  appId: "1:688114065376:web:fc4b4b5a120f0cc8a19585"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
};
