import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, limit, orderBy, setDoc, query, collection, where, getDocs, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import BottomBar from '../classes/BottomBar'; // Ensure this path matches your file structure
import userDataInstance from '../classes/UserData';
import { db } from '../firebase'; // Adjust this import based on your file structure

import { LinearGradient } from 'expo-linear-gradient';


import { sendFriendRequest, acceptFriendRequest, fetchFriendRequests, fetchFriends, getOnlineStatus, listenToOnlineStatus } from '../classes/FriendHandler';


const auth = getAuth();

const SocialScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollectionRef = collection(db, "users"); // Assuming 'users' collection
            const q = query(usersCollectionRef, orderBy("level", "desc"), limit(10)); // Adjust based on your needs
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        };

        fetchUsers();
    }, []);

    const handleSettings = () => {
        navigation.navigate('ProfilePage', { userId: auth.currentUser.uid }); // This will navigate to the previous screen in the stack
    };

    const handleBack = () => {
        navigation.goBack(); // Consider using goBack for more intuitive navigation
    };

    const handleSearch = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", searchQuery));

        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        setSearchResults(results);
    };

    const sendFriendRequestHandler = async (receiverId) => {
        const senderId = auth.currentUser.uid;
        await sendFriendRequest(senderId, receiverId, userDataInstance.getUserData().username)
        console.log("Friend request sent.");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Social</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
                <FontAwesome name="user-circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.cardHeader}>Add Friend</Text>
                <View style={styles.subCardCont}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            placeholder="Search for users..."
                            placeholderTextColor="#999"
                            onSubmitEditing={handleSearch} // This will call handleSearch when the user presses Enter
                            returnKeyType="search"
                        />
                        <TouchableOpacity onPress={handleSearch} style={styles.iconContainer}>
                            <FontAwesome name="search" size={20} color="white" />
                        </TouchableOpacity>
                    </View>



                    <ScrollView style={styles.resultsContainer}>
                        {searchResults.map((user) => (
                            <View key={user.id} style={styles.userResult}>
                                <Text style={styles.username}>{user.username}</Text>
                                <TouchableOpacity onPress={() => sendFriendRequestHandler(user.id)} style={styles.requestButton}>
                                    <Text style={styles.requestButtonText}>Send Request</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardHeader}>Leaderboard</Text>
                <View style={styles.subCardCont}>
                    {/* Horizontal ScrollView for top 3 users */}
                    <View showsHorizontalScrollIndicator={false} style={topUserStyle.topUserContainerScroll}>
                        {users.slice(0, 3).map((user, index) => (
                            <LinearGradient key={user.id} colors={['#9f4c4c', '#983b3b', '#6a1919']} style={topUserStyle.levelBadge}>
                                <Text style={styles.rank}>{(index + 1).toString()}</Text>
                                <Text style={topUserStyle.topUsername}>{user.username.toString()}</Text>
                            </LinearGradient>
                        ))}
                    </View>

                    <ScrollView style={styles.restOfUsersContainer}>
                        {users.slice(3).map((user, index) => (
                            <View key={user.id} style={styles.userRow}>
                                {/* Ensure dynamic text is wrapped in <Text> */}
                                <Text style={styles.rank}>{(index + 4).toString()}</Text>
                                <Text style={styles.username}>{user.username}</Text>
                                <LinearGradient colors={['#9f4c4c', '#983b3b', '#6a1919']} style={styles.levelBadge}>
                                    <Text style={styles.levelText}>{"Level " + user.level}</Text>
                                </LinearGradient>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>



            <BottomBar />
        </View>
    );
};

const topUserStyle = StyleSheet.create({
    topUserContainerScroll: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelBadge: {
        margin: 10,
        width: 70,
        paddingVertical: 15,
        height: 70,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topUserContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        padding: 10,
        borderRadius: 50, // Make it round
        backgroundColor: '#ff0000', // Gold color for top users
        marginBottom: 15,
        margin: 10
    },
    topUsername: {
        color: 'white', // Text color for contrast
        fontWeight: 'bold',
        fontSize: 16,
    },
    topUserLevelText: {
        color: 'black',
        fontSize: 14,
        fontWeight: "bold",
    },
});

const styles = StyleSheet.create({
    topUsersContainer: {
        marginBottom: 10, // Space between the top users and the rest
    },
    restOfUsersContainer: {
        width: '100%',
    },
    card: {
        backgroundColor: '#323232',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        width: '90%', // Adjust the width as per your design
        alignSelf: 'center',
    },
    subCardCont: {
        justifyContent: 'center',
    },
    cardHeader: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: -10,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#161616',
        alignItems: 'center',
        paddingTop: 60,
    },
    header: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,

    },
    userRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#505050",

        borderRadius: 15,
        marginBottom: 10,
        padding: 16
    },
    rank: {
        fontWeight: 'bold',
        color: "#fff",
        marginRight: 5,
    },
    username: {
        flex: 1, // To ensure it takes up the space it needs
        textAlign: 'left',
        color: "#fff",
    },
    nameLevelContainer: {
        alignItems: 'center',
        justifyContent: 'center', // This centers the children horizontally in the container
        alignSelf: "center",
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    levelBadge: {
        marginLeft: 10,

        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelText: {
        color: 'white',
        fontSize: 14,
        fontWeight: "bold"
    },
    level: {
        fontWeight: 'bold',
        color: "#fff",
    },
    settingsButton: {
        position: 'absolute',
        top: 55,
        right: 20,
    },
    backButton: {
        position: 'absolute',
        top: 55,
        left: 20,
    },
    input: {
        flex: 1, // Allows TextInput to fill the available space, leaving room for the icon
        height: 50, // Match your desired height
        color: '#fff', // Text color
        fontSize: 16, // Match your desired font size
        paddingRight: 45, // Add padding to prevent text from overlapping the icon
    },
    iconContainer: {
        position: 'absolute', // Position the icon absolutely within the container
        right: 20, // Distance from the right edge of the container
        height: '100%', // Make the icon container fill the parent container's height
        justifyContent: 'center', // Center the icon vertically within the container
    },
    inputContainer: {
        flexDirection: 'row', // Aligns TextInput and icon horizontally
        alignItems: 'center', // Centers items vertically within the container
        backgroundColor: '#505050', // Match the TextInput background
        borderRadius: 20, // Apply border radius to the container
        width: '100%', // Container width
        paddingHorizontal: 15, // Padding inside the container
        marginBottom: 10, // Margin at the bottom of the container
    },
    searchButton: {
        backgroundColor: '#161616',
        paddingVertical: 10,
        alignSelf: 'center',
        width: "50%",
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: "center",
    },
    resultsContainer: {
        width: '100%',
    },
    userResult: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2C',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        width: '90%',
        alignSelf: 'center',
    },
    username: {
        color: '#fff',
        flexGrow: 1,
    },
    requestButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    requestButtonText: {
        color: '#fff',
    },
});

export default SocialScreen;
