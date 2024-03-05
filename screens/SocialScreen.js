import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, setDoc, query, collection, where, getDocs, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import BottomBar from '../classes/BottomBar'; // Ensure this path matches your file structure
import userDataInstance from '../classes/UserData';

import { sendFriendRequest, acceptFriendRequest, fetchFriendRequests, fetchFriends, getOnlineStatus, listenToOnlineStatus } from '../classes/FriendHandler';


const db = getFirestore();
const auth = getAuth();

const SocialScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSettings = () => {
        navigation.navigate('Settings');
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



            <BottomBar />
        </View>
    );
};

const styles = StyleSheet.create({
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
