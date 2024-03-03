import { doc, setDoc, collection, getDoc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getDatabase, ref, onValue, set, onDisconnect, get, serverTimestamp } from 'firebase/database';

// Send a friend request
const sendFriendRequest = async (userId, friendId) => {
    await setDoc(doc(db, 'users', friendId, 'friendRequests', userId), {
        senderId: userId,
        status: 'pending',
        createdAt: new Date(),
    });
};

// Accept a friend request
const acceptFriendRequest = async (userId, friendId) => {
    // Add each other to the friends subcollection
    await setDoc(doc(db, 'users', userId, 'friends', friendId), {
        friendId: friendId,
        createdAt: new Date(),
    });
    await setDoc(doc(db, 'users', friendId, 'friends', userId), {
        friendId: userId,
        createdAt: new Date(),
    });

    // Remove the friend request after accepting
    await deleteDoc(doc(db, 'users', userId, 'friendRequests', friendId));
};

// Fetch friend requests
const fetchFriendRequests = async (userId) => {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'friendRequests'));
    let friendRequests = [];
    querySnapshot.forEach((doc) => {
        friendRequests.push(doc.data());
    });
    return friendRequests;
};

// Fetch friends list
const fetchFriends = async (userId) => {
    const friendsRef = collection(db, 'users', userId, 'friends');
    const querySnapshot = await getDocs(friendsRef);

    // Create an array of promises to fetch each friend's data
    const friendDataPromises = querySnapshot.docs.map((doc) => {
        // Use the friendId field from the document if it's structured that way.
        const friendId = doc.data().userId;
        return fetchFriendData(friendId);
    });

    // Wait for all friend data to be fetched
    const friendsData = await Promise.all(friendDataPromises);


    // Filter out any potential falsy values (e.g., if fetchFriendData returns false)
    return friendsData.filter(Boolean);
};

const fetchFriendData = async (friendId) => {
    const userDocRef = doc(db, 'users', friendId);
    try {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            return { ...data, userId: userDocSnap.id };
        }
    } catch (error) {
        console.error("Error fetching friend data:", error);
    }
};

const getOnlineStatus = async (userId) => {
    const db = getDatabase();
    const userStatusDatabaseRef = ref(db, `status/${userId}`);

    try {
        const snapshot = await get(userStatusDatabaseRef);
        if (snapshot.exists()) {
            const isOnline = snapshot.val();
            console.log(`User ${userId} is online: ${isOnline.state}`);
            return isOnline.state; // Return the online state directly
        } else {
            console.log(`Status for user ${userId} not found.`);
            return 'offline'; // Assume offline if no status found
        }
    } catch (error) {
        console.error(`Error fetching online status for user ${userId}:`, error);
        return 'offline'; // Return 'offline' in case of error
    }


};

const listenToOnlineStatus = (userId, onUpdate) => {
    const db = getDatabase();
    const statusRef = ref(db, `/status/${userId}`);

    // onValue() now returns a function that can be called to unsubscribe
    const unsubscribe = onValue(statusRef, (snapshot) => {
        if (snapshot.exists()) {
            const status = snapshot.val();
            console.log(`User ${userId} is online: ${status.state}`);
            onUpdate(status.state); // Call the onUpdate callback with the new status
        } else {
            console.log(`Status for user ${userId} not found.`);
            onUpdate('offline'); // Assume offline if no status found
        }
    }, (error) => {
        console.error(error);
    });

    // Return the unsubscribe function to be called later for cleanup
    return unsubscribe;
};

const updateOnlineStatus = async (userId) => {
    const db = getDatabase();
    const userStatusDatabaseRef = ref(db, `/status/${userId}`);
    const connectedRef = ref(db, '.info/connected');

    try {
        onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === false) {
                // The client is not connected to the Realtime Database
                return;
            }

            // Use onDisconnect() to set the user as 'offline' upon disconnection
            onDisconnect(userStatusDatabaseRef).set({
                state: 'offline',
                last_changed: serverTimestamp(),
            }).then(() => {
                // Set the user's status to 'online' when they're connected
                set(userStatusDatabaseRef, {
                    state: 'online',
                    last_changed: serverTimestamp(),
                });
            });
        });
    } catch (error) {
        console.error(`Error updating online status for user ${userId}:`, error);
        return 'offline'; // Return 'offline' in case of error
    }


};




export { sendFriendRequest, acceptFriendRequest, fetchFriendRequests, fetchFriends, fetchFriendData, updateOnlineStatus, getOnlineStatus, listenToOnlineStatus }