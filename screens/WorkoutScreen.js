import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const auth = getAuth();

import BottomBar from '../classes/BottomBar'

const WorkoutScreen = ({ route }) => {
    const navigation = useNavigation();
    const { workout } = route.params;
    const [exercises, setExercises] = useState(workout.exercises.map(exercise => ({
        ...exercise,
        sets: Array(3).fill({ reps: '', weight: '', completed: false }),
    })));

    const handleChange = (exerciseIndex, setIndex, type, value) => {
        setExercises(exercises.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
                return {
                    ...exercise,
                    sets: exercise.sets.map((set, sIndex) => {
                        if (sIndex === setIndex) {
                            return { ...set, [type]: value };
                        }
                        return set;
                    }),
                };
            }
            return exercise;
        }));
    };

    const toggleCompletion = (exerciseIndex, setIndex) => {
        handleChange(exerciseIndex, setIndex, 'completed', !(exercises[exerciseIndex].sets[setIndex].completed));
    };

    const completeWorkout = async () => {
        // Ensure there's a user logged in
        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert("Error", "You need to be logged in to complete workouts.");
            return;
        }

        // Create a reference to the workouts_done subcollection
        const workoutsDoneRef = collection(db, "users", userId, "workouts_done");

        try {
            // Add the completed workout to the workouts_done subcollection
            await addDoc(workoutsDoneRef, {
                ...workout, // Spread the existing workout details
                exercises, // Include the exercises with sets, reps, and completion status
                completedAt: new Date(), // Timestamp when the workout was completed
            });

            Alert.alert("Workout Completed", "Your workout has been successfully saved.");
            navigation.goBack(); // Or navigate to a relevant screen
        } catch (error) {
            console.error("Error completing workout: ", error);
            Alert.alert("Error", "There was a problem saving your workout.");
        }
    };



    const handleSettings = () => {
        navigation.navigate('Settings');
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Workouts</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                <FontAwesome name="user-circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <ScrollView style={styles.exercisesContainer}>
                {exercises.map((exercise, eIndex) => (
                    <View key={eIndex} style={styles.exerciseCard}>
                        <Text style={styles.exerciseName}>{exercise.title}</Text>
                        {exercise.sets.map((set, sIndex) => (
                            <View key={sIndex} style={styles.setRow}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="KG"
                                    placeholderTextColor={"#fff"}
                                    value={set.weight}
                                    editable={!set.completed}
                                    onChangeText={(text) => handleChange(eIndex, sIndex, 'weight', text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Reps"
                                    value={set.reps}
                                    editable={!set.completed}
                                    placeholderTextColor={"#fff"}
                                    onChangeText={(text) => handleChange(eIndex, sIndex, 'reps', text)}
                                />
                                <TouchableOpacity
                                    style={[styles.toggleButton, set.completed ? styles.completed : styles.notCompleted]}
                                    onPress={() => toggleCompletion(eIndex, sIndex)}
                                >
                                    <Ionicons name={set.completed ? "checkmark-circle" : "close-circle"} size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                ))}
                <TouchableOpacity onPress={completeWorkout} >
                    <LinearGradient
                        colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                            'rgba(241, 39, 17, 0.571)',]} // Adjust the colors as per your requirement
                        style={[styles.excerciseItemAddButton, { marginTop: 1 }]}
                    >
                        <Text style={styles.excerciseItemAddText}>Complete Workout</Text>
                    </LinearGradient>

                </TouchableOpacity>
            </ScrollView>

            <BottomBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161616',
        alignItems: 'center',
        paddingTop: 20,
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
    header: {
        color: '#fff',
        fontSize: 24,
        marginTop: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    exercisesContainer: {
        width: '90%',
    },
    exerciseCard: {
        backgroundColor: '#323232',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
    },
    exerciseName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    excerciseItemAdd: {
        alignSelf: 'center',
        backgroundColor: '#161616',
        height: 60,
        width: "100%",
        borderRadius: 15,
        marginTop: 10,
        justifyContent: "center",
        alignItems: 'center'
    },
    excerciseItemAddButton: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 100,
        height: 40,
        justifyContent: "center",
        width: "50%",
        borderRadius: 15,
    },
    excerciseItemAddText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: "center",

    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        color: '#fff',
        backgroundColor: '#161616',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    toggleButton: {
        padding: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completed: {
        backgroundColor: 'green',
    },
    notCompleted: {
        backgroundColor: 'red',
    },
    saveWorkoutButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginVertical: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default WorkoutScreen;
