import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyC1h2_VHhdmnIhZwYD5vVCqDtPkbo1-VHY",
    authDomain: "gymgrind-75307.firebaseapp.com",
    projectId: "gymgrind-75307",
    storageBucket: "gymgrind-75307.appspot.com",
    messagingSenderId: "562269260415",
    appId: "1:562269260415:web:8ec15dbf1f2927f2d54d4a",
    measurementId: "G-QY8XE80M3T"
};

const firebaseApp = initializeApp(firebaseConfig);

// You can use the following line if you are using Firebase Emulator Suite
// useAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
export { db, auth }
export default firebaseApp;