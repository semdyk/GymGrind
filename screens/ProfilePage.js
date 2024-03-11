import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getFirestore, doc, getDocs, getDoc, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from '../firebase'; // Ensure this path matches your file structure

import BottomBar from '../classes/BottomBar'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ProgressBar from '../classes/LevelSystem/ProgressBar';
import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';

const ProfilePage = ({ route }) => {
    const { userId } = route.params;
    const [userData, setUserData] = useState(null);
    const [recentWorkouts, setRecentWorkouts] = useState([]);
    const [workoutsDone, setWorkoutsDone] = useState(0);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data())
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                console.log("No such document!");
            }

        };

        const fetchRecentWorkouts = async () => {
            const workoutsRef = collection(db, "users", userId, "workouts_done");
            const q = query(workoutsRef, orderBy("completedAt", "desc"), limit(3));
            const querySnapshot = await getDocs(q);
            const workouts = [];


            querySnapshot.forEach((doc) => {
                workouts.push(doc.data());
            });
            setRecentWorkouts(workouts);

            const workoutsRef2 = collection(db, "users", userId, "workouts_done");
            const q2 = query(workoutsRef2);
            const querySnapshot2 = await getDocs(q2);
            setWorkoutsDone(querySnapshot2.size);

        };



        fetchData();
        fetchRecentWorkouts();
    }, [userId]);

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }


    const handleSettings = () => {
        navigation.navigate('Settings'); // This will navigate to the previous screen in the stack
    };

    const handleBack = () => {
        navigation.goBack(); // This will navigate to the previous screen in the stack
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                <FontAwesome name="cog" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={24} color="white" />
            </TouchableOpacity>

            <View style={[styles.card]}>
                <Image source={{ uri: userData.profilePicture }} style={styles.profilePic} />
                {/* Display other user data */}
                <View style={styles.nameLevelContainer}>
                    <Text style={styles.name}>{userData.username}</Text>
                    <LinearGradient colors={['#9f4c4c', '#983b3b', '#6a1919']} style={styles.levelBadge}>
                        <Text style={styles.levelText}>Level {userData.level}</Text>
                    </LinearGradient>
                </View>
                <ProgressBar
                    currentXP={50}
                    maxXP={userData.level * 100}>

                </ProgressBar>
                <View style={styles.subCardCont}>

                    <LinearGradient
                        colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                            'rgba(241, 39, 17, 0.396)',]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.subCard}
                    >
                        <View style={styles.statContent}>
                            <FontAwesome5 name="fire-alt" size={24} color="#fff" />
                            <Text style={styles.statNumber}>{userData.streak}</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#d004045b', '#b206063e']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.subCard]}>
                        <View style={styles.statContent}>
                            <FontAwesome5 name="dumbbell" size={24} color="#fff" />
                            <Text style={styles.statNumber}>{workoutsDone}</Text>
                            <Text style={styles.statLabel}>Completed Workouts</Text>
                        </View>
                    </LinearGradient>
                </View>
                {/* Add more user-specific information as needed */}
            </View>

            {/* Recent Workouts Card */}
            <View style={[styles.card]}>
                <Text style={[styles.cardTitle, { color: "#fff", textAlign: "center" }]}>Recent Workouts</Text>
                <ScrollView>
                    {recentWorkouts.map((workout, index) => (
                        <View key={index} style={styles.workoutCont}>
                            <Text style={styles.workoutTitle}>{workout.title}</Text>
                            <Text style={styles.workoutDate}>
                                Completed on: {workout.completedAt.toDate().toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>


        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161616',
        paddingBottom: 50, // Adjust this value as needed to avoid overlap with the footer
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
        width: '48%', // Adjust the width as per your design.
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
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statContent: {
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#fff',
        fontSize: 12,
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
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statItem: {
        fontSize: 16,
        marginBottom: 15,
    },
    workoutCont: {
        backgroundColor: '#575757', // A slightly lighter shade for contrast
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        width: "100%",
    },
    workoutTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    workoutDate: {
        color: '#ddd', // Lighter for less emphasis
        fontSize: 14,
    },
    workoutItem: {
        fontSize: 16,
        marginBottom: 5,
    },
    card: {
        backgroundColor: '#323232',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        width: '90%', // Adjust the width as per your design
        alignSelf: 'center',
    },
    nameLevelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // This centers the children horizontally in the container

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
    backButton: {
        position: 'absolute',
        top: 55, // Adjust the value as needed
        left: 20, // Adjust the value as needed
        zIndex: 10, // Make sure the button is clickable by setting zIndex
    },
    header: {
        color: '#fff',
        fontSize: 24,
        marginTop: 50,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    settingsbutton: {
        position: 'absolute',
        top: 55, // Adjust the value as needed
        right: 20, // Adjust the value as needed
        zIndex: 10, // Make sure the button is clickable by setting zIndex
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
    // Add more styles as needed
});

export default ProfilePage;