import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBZ-zHKNXW-G-nGwUCAHo0p8Xlfx6hHpqM",
  authDomain: "vuejs-social-media.firebaseapp.com",
  projectId: "vuejs-social-media",
  storageBucket: "vuejs-social-media.appspot.com",
  messagingSenderId: "21619827521",
  appId: "1:21619827521:web:56a08c3b8cecc3a19537c0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore()
export default db