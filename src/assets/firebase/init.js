import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBSb3zZVS17FkJuRfNIvqvbBuzaepK0Hso",
  authDomain: "vue-blog-e5577.firebaseapp.com",
  projectId: "vue-blog-e5577",
  storageBucket: "vue-blog-e5577.appspot.com",
  messagingSenderId: "912820057163",
  appId: "1:912820057163:web:d263bf076daede99b749ce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore()
export default db