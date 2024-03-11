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

const levelUpHandler = async (level) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
        console.error("No user logged in.");
        return;
    }

    // Reference to the user's document in the "users" collection
    const userDocRef = doc(db, 'users', userId);

    try {
        // Update the user's level and reset XP to 0
        await updateDoc(userDocRef, {
            level: level,
            xp: 0
        });
        console.log(`User level updated to ${level} and XP reset to 0.`);
    } catch (error) {
        console.error("Error updating user level: ", error);
    }
};

export { createWorkout, levelUpHandler };