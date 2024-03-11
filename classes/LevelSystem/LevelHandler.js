import { doc, setDoc, collection, getDoc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';


const getLevelAndXP = async (userId) => {
  const userRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const { level, xp } = docSnap.data();
      return { level, xp };
    } else {
      console.log('No such document!');
      return { level: 1, xp: 0 }; // Default values if the document does not exist
    }
  } catch (error) {
    console.error('Error fetching level and XP:', error);
    return { level: 1, xp: 0 }; // Return default values in case of error
  }
}
const updateLevelAndXP = async (userId, newLevel, newXP) => {

  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      level: newLevel,
      xp: newXP,
    });
    console.log('Level and XP updated successfully');
  } catch (error) {
    console.error('Error updating level and XP:', error);
  }

}

export { getLevelAndXP, updateLevelAndXP }