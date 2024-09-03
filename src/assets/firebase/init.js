import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBSJ9PRUX0StaFPMDXM-BtBBkQmhAzmef0",
  authDomain: "vuejs-socialnetwork-ec42d.firebaseapp.com",
  projectId: "vuejs-socialnetwork-ec42d",
  storageBucket: "vuejs-socialnetwork-ec42d.appspot.com",
  messagingSenderId: "396082193713",
  appId: "1:396082193713:web:535a561a18c4642825bc10"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore()
export default db
