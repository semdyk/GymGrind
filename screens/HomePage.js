import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from 'firebase/database';
import { sendFriendRequest, acceptFriendRequest, fetchFriendRequests, fetchFriends, getOnlineStatus, listenToOnlineStatus } from '../classes/FriendHandler';

import AsyncStorage from '@react-native-async-storage/async-storage';


const auth = getAuth();

import userDataInstance from '../classes/UserData';
import BottomBar from '../classes/BottomBar'


const HomePage = () => {
    const navigation = useNavigation();

    const [userData, setUserData] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [onlineStatuses, setOnlineStatuses] = useState({}); // New state for tracking online statuses

    // Assuming friendList is fetched elsewhere and does not change often
    const friendIds = useMemo(() => friendList.map(friend => friend.userId), [friendList]);

    useEffect(() => {
        let unsubscribeFunctions = [];

        friendIds.forEach(userId => {
            const unsubscribe = listenToOnlineStatus(userId, newStatus => {
                // Update only the onlineStatuses state
                setOnlineStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [userId]: newStatus,
                }));
            });
            unsubscribeFunctions.push(unsubscribe);
        });

        return () => {
            unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
        };
    }, [friendIds]); // Depend on friendIds


    useEffect(() => {
        const fetchUserData = async () => {
            const userId = auth.currentUser ? auth.currentUser.uid : null;
            if (!userId) return;

            const userDocRef = doc(db, 'users', userId);
            try {
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    // Assuming 'username' and 'level' are fields in your user document
                    const data = userDocSnap.data();
                    datauser = {
                        username: data.username,
                        email: data.email,
                        userID: userId,
                        profilePic: data.profilePicture,
                        level: data.level || 'Not set',
                        xp: data.xp, // If level is not set, display 'Not set' or any default text
                        rank: data.rank,
                    }
                    userDataInstance.setUserData(datauser);


                    const allUserData = userDataInstance.getUserData();
                    setUserData(allUserData)

                    const fetchAndSetFriends = async () => {
                        try {
                            // Fetch the array of friends
                            const friendsData = await fetchFriends(userId);

                            // For each friend, fetch their online status
                            const friendsDataWithStatus = await Promise.all(friendsData.map(async (friend) => {
                                const status = await getOnlineStatus(friend.userId); // Make sure to await the status
                                return { ...friend, status }; // Return a new object with all of friend's data and their status
                            }));

                            console.log(friendsDataWithStatus)

                            // Update the state with the new array
                            setFriendList(friendsDataWithStatus);
                        } catch (error) {
                            console.error("Error fetching friends and status:", error);
                        }
                    };
                    fetchAndSetFriends();

                } else {
                    console.log('No such user!');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();


    }, []);

    const userId = auth.currentUser ? auth.currentUser.uid : null;
    useEffect(() => {
        const checkUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                navigation.navigate('Home');
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                AsyncStorage.setItem('user', JSON.stringify(user));
                navigation.navigate('Home');
            } else {
                AsyncStorage.removeItem('user');
                checkUser();
            }
        });

        return () => unsubscribe();
    }, []);



    const handleSettings = () => {
        navigation.navigate('Settings'); // This will navigate to the previous screen in the stack
    };
    // {userData.username}
    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Home</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                <FontAwesome name="user-circle" size={24} color="white" />
            </TouchableOpacity>
            <ScrollView>

                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Online Friends</Text>
                    <ScrollView horizontal style={styles.subFriendCardCont}>
                        {/*}
                        <View style={styles.subFriendCardLabelCont}>
                            <TouchableOpacity style={styles.subFriendCard}>
                                <Image
                                    resizeMode='cover'
                                    source={{ uri: userData.profilePic }}
                                    style={styles.profileImage}
                                />
                                <View style={styles.statFriendContent}>
                                    <Ionicons name="checkmark-circle" size={18} color="lightgreen" />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.statFriendLabel}>Kenobe</Text>
                        </View>
                        {*/}
                        {friendList.map((friend, index) => (

                            <View key={index} style={styles.subFriendCardLabelCont}>
                                <TouchableOpacity style={styles.subFriendCard}>
                                    <Image
                                        resizeMode='cover'
                                        source={{ uri: friend.profilePicture }}
                                        style={styles.profileImage}
                                    />
                                    <View style={styles.statFriendContent}>
                                        {onlineStatuses[friend.userId] === "online" &&
                                            <Ionicons name="checkmark-circle" size={18} color="lightgreen" />
                                        }
                                        {onlineStatuses[friend.userId] === "offline" &&
                                            <Ionicons name="close-circle" size={18} color="red" />
                                        }
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.statFriendLabel}>{friend.username}</Text>
                            </View>
                        ))}
                    </ScrollView>

                </View>

                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Progress</Text>
                    <View style={styles.subCardCont}>

                        <LinearGradient
                            colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                                'rgba(241, 39, 17, 0.396)',]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.subCard}
                        >
                            <View style={styles.statContent}>
                                <FontAwesome5 name="trophy" size={20} color="#fff" />
                                <Text style={styles.statNumber}>12</Text>
                                <Text style={styles.statLabel}>Personal Records</Text>
                            </View>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#d004045b', '#b206063e']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.subCard]}>
                            <View style={styles.statContent}>
                                <FontAwesome5 name="dumbbell" size={20} color="#fff" />
                                <Text style={styles.statNumber}>6</Text>
                                <Text style={styles.statLabel}>Created Workouts</Text>
                            </View>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#bd212179', '#94271459']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.subCard]}>
                            <View style={styles.statContent}>
                                <FontAwesome5 name="fire" size={20} color="#fff" />
                                <Text style={styles.statNumber}>5</Text>
                                <Text style={styles.statLabel}>Streak</Text>
                            </View>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#bd212179', '#94211483']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.subCard]}>
                            <View style={styles.statContent}>
                                <FontAwesome5 name="heartbeat" size={20} color="#fff" />
                                <Text style={styles.statNumber}>48</Text>
                                <Text style={styles.statLabel}>Workouts Done</Text>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Recent Workouts</Text>
                    <View style={styles.subCardCont}>


                    </View>
                </View>

            </ScrollView>

            <BottomBar></BottomBar>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161616',
        paddingBottom: 50, // Adjust this value as needed to avoid overlap with the footer
    },
    settingsbutton: {
        position: 'absolute',
        top: 55, // Adjust the value as needed
        right: 20, // Adjust the value as needed
        zIndex: 10, // Make sure the button is clickable by setting zIndex
    },

    card: {
        backgroundColor: '#323232',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        width: '90%', // Adjust the width as per your design
        alignSelf: 'center',
    },
    subFriendCardCont: {
        flexDirection: "row",

    },
    subFriendCardLabelCont: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10, // Adjust the spacing between cards as needed
    },
    statFriendLabel: {
        color: '#fff',
        fontSize: 15,
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 5, // Add space between the card and text
    },
    subFriendCard: {
        borderRadius: 25, // Half of width/height to make it perfectly round
        height: 50, // Set the height
        width: 50, // Set the width
        backgroundColor: "#161616",
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', // Needed for absolute positioning of the icon
    },
    statFriendContent: {
        position: 'absolute', // Absolute position to place the icon in a specific spot
        right: 4, // Right offset
        bottom: -2, // Bottom offset
        alignItems: 'center', // Ensure the icon itself is centered
        justifyContent: 'center',
    },
    profileImage: {
        width: "100%", // The image should fill the container
        height: "100%", // The image should fill the container
        borderRadius: 30, // Half the width/height to create a circle
        position: 'absolute', // Position the image absolutely to overlay it on the TouchableOpacity
    },
    statContent: {
        alignItems: 'center',
    },
    subCardCont: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'space-between',
    },

    subCard: {
        borderRadius: 20,
        padding: 10,
        height: 95,
        marginBottom: 10,
        width: '48%', // Adjust the width as per your design
        alignSelf: 'center',
    },
    contentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center', // Ensure alignment if the icon/text have different heights
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    statCard: {
        width: '30%',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statContent: {
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#fff',
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
    },
    iconCard: {

        width: 35,
        height: 35,
        marginLeft: 5,
        borderRadius: 15, // Half of width/height to make it perfectly round
        alignItems: "center",
        justifyContent: "center",
    },
    cardSubHeader: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    statisticText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 10, // Adjust spacing between the header/icon row and this text
        alignSelf: 'center', // Center the text within the card
    },
    header: {
        color: '#fff',
        fontSize: 24,
        marginTop: 50,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    cardHeader: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: -10,
        textAlign: 'center',
    },
    cardSubHeader: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',

    },

    subsubheader: {
        color: '#fff',
        fontSize: 20,
        marginTop: -20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 10,
        textAlign: 'center',
    },
    subheader: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default HomePage;