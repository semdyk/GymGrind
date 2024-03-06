import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

import BottomBar from '../classes/BottomBar';

import { LinearGradient } from 'expo-linear-gradient';



const WorkoutsScreen = () => {
    const navigation = useNavigation();

    const [workouts, setWorkouts] = useState([])

    useEffect(() => {
        const fetchWorkouts = async () => {
            const userId = auth.currentUser ? auth.currentUser.uid : null;
            if (!userId) return;

            // Pointing to the subcollection 'workouts' for a specific user
            const workoutsRef = collection(db, 'users', userId, 'workouts');
            try {
                // Fetching all documents in the 'workouts' subcollection
                const querySnapshot = await getDocs(workoutsRef);
                const workouts = [];
                querySnapshot.forEach((doc) => {
                    // Pushing each workout data along with doc.id (workoutId) into the workouts array
                    workouts.push({ id: doc.id, ...doc.data() });
                });
                console.log(workouts); // Logging workouts to see the output
                setWorkouts(workouts); // Assuming you have a useState hook for storing workouts

            } catch (error) {
                console.error("Error fetching workouts:", error);
            }
        };

        fetchWorkouts();
    }, []);


    const handleSettings = () => {
        navigation.navigate('Settings'); // This will navigate to the previous screen in the stack
    };

    const handleBack = () => {
        navigation.navigate('Home');  // This will navigate to the previous screen in the stack
    };

    const [expandedWorkoutId, setExpandedWorkoutId] = useState(null);
    const toggleWorkoutVisibility = (workoutId) => {
        setExpandedWorkoutId(expandedWorkoutId === workoutId ? null : workoutId);
    };

    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Workouts</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                <FontAwesome name="user-circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <ScrollView style={[styles.cardCont]}>
                <View style={[styles.card, { height: 410, }]}>
                    <Text style={styles.cardHeader}>Workouts</Text>
                    <ScrollView style={styles.workoutListCont}>
                        {workouts.map((workout, index) => (
                            <View key={index} style={styles.workoutCont}>
                                <View style={styles.workoutHeader}>
                                    <Text style={styles.workoutTextHeader}>{workout.title}</Text>
                                    <View style={{ flexDirection: "row" }}>

                                        <Ionicons onPress={() => navigation.navigate('Workout', { workout: workout })} name="play" size={24} color="white" style={styles.headerIcon} />
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => toggleWorkoutVisibility(workout.id)}>
                                            <Ionicons name={expandedWorkoutId === workout.id ? "chevron-up" : "chevron-down"} size={24} color="white" />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                {expandedWorkoutId === workout.id && (

                                    <View style={styles.workoutBody}>
                                        <Text style={[styles.workoutItem, { marginTop: -10, marginBottom: 10, fontStyle: "italic" }]}>{workout.description}</Text>

                                        {workout.exercises.map((exercise, exerciseIndex) => (
                                            <Text key={exerciseIndex} style={styles.workoutItem}>• {exercise.title}</Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}


                    </ScrollView>

                </View>

                <View style={[styles.card, { height: 130, }]}>
                    <Text style={styles.cardHeader}>Create Workout</Text>
                    <TouchableOpacity
                        style={styles.button2Container}
                        onPress={() => navigation.navigate('CreateWorkoutScreen')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                                'rgba(241, 39, 17, 0.571)',]} // Adjust the colors as per your requirement
                            style={styles.start2Button}
                        >
                            <Text style={styles.buttonText}>Create</Text>
                        </LinearGradient>
                    </TouchableOpacity>



                </View>

            </ScrollView>

            <BottomBar></BottomBar>
        </View >
    );
}

const styles = StyleSheet.create({
    button2Container: {
        borderRadius: 20, // Ensure this matches your LinearGradient's borderRadius if you have one
        width: '90%',
        alignSelf: "center"
    },
    start2Button: {
        paddingVertical: 10,
        marginTop: 10,
        borderRadius: 20, // Ensure this matches your TouchableOpacity's borderRadius
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
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
    container: {
        flex: 1,
        backgroundColor: '#161616',
        paddingBottom: 50, // Adjust this value as needed to avoid overlap with the footer
    },
    cardCont: {
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
    backButton: {
        position: 'absolute',
        top: 55, // Adjust the value as needed
        left: 20, // Adjust the value as needed
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
    workoutTextHeader: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    workoutListCont: {
        borderRadius: 20,
        marginBottom: 20,
        width: '100%',
    },
    workoutCont: {
        backgroundColor: '#161616',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#fff",
        padding: 20,
        marginBottom: 20,
        width: '100%',
    },
    workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcon: {
        // If you want to adjust the icon's style, do it here
    },
    workoutBody: {
        marginTop: 10, // Adjust based on your design needs
    },
    workoutItem: {
        color: '#fff',
        fontSize: 16,
        // Add padding or margin if needed
        marginTop: 5, // Space between items
    },
    header: {
        color: '#fff',
        fontSize: 24,
        marginTop: 50,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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

export default WorkoutsScreen;