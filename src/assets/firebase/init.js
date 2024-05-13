import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCM2BNrXqZmNZ0AuRDnaXPfgV2apteOuxI",
  authDomain: "vue-social-media-601fa.firebaseapp.com",
  databaseURL:
    "https://vue-social-media-601fa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vue-social-media-601fa",
  storageBucket: "vue-social-media-601fa.appspot.com",
  messagingSenderId: "1077663932349",
  appId: "1:1077663932349:web:2d7627c8a3472de2367cd4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore()
export default db