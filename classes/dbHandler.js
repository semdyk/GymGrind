import { doc, setDoc, collection, getDoc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();



const createWorkout = async (title, description, exercises) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const clenniesCollectionRef = collection(db, 'users', userId, 'workouts');
    const docRef = await addDoc(clenniesCollectionRef, {
        title: title,
        description: description,
        exercises: exercises,
        createdAt: new Date(),
    });
};

export { createWorkout };