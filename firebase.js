import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyC1KrUgszfmHXXHl4zeTOAQDZHlrhbgWPs",
    authDomain: "junkielijst.firebaseapp.com",
    projectId: "junkielijst",
    storageBucket: "junkielijst.appspot.com",
    messagingSenderId: "1044860180029",
    appId: "1:1044860180029:web:ff0d425c590f6f5f9a7c54",
    measurementId: "G-73MSVZFLJC"
};

const firebaseApp = initializeApp(firebaseConfig);

// You can use the following line if you are using Firebase Emulator Suite
// useAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
export { db, auth }
export default firebaseApp;