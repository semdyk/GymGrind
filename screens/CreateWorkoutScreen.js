import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';

import BottomBar from '../classes/BottomBar'
import { LinearGradient } from 'expo-linear-gradient';
import { createWorkout } from '../classes/dbHandler';

const CreateWorkoutScreen = () => {
    const navigation = useNavigation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [exercises, setExercises] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newExerciseTitle, setNewExerciseTitle] = useState('');


    const handleSettings = () => {
        navigation.navigate('ProfilePage', { userId: auth.currentUser.uid }); // This will navigate to the previous screen in the stack
    };
    const handleBack = () => {
        navigation.navigate('Workouts');  // This will navigate to the previous screen in the stack
    };

    const handleCreate = async () => {
        await createWorkout(title, description, exercises)
        navigation.navigate('Workouts');  // This will navigate to the previous screen in the stack
    };

    const handleAddExercise = async () => {
        setExercises([...exercises, { id: Date.now().toString(), title: newExerciseTitle }]);
        setIsModalVisible(false);
        setNewExerciseTitle("")
    }

    const handleRemoveExercise = async (id) => {
        console.log(id)
        const updatedExercises = exercises.filter(exercise => exercise.id !== id);
        setExercises(updatedExercises);

    }


    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.header}>Create Workout</Text>
                <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                    <FontAwesome name="user-circle" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <View style={[styles.card, { marginBottom: 10 }]}>
                    <Text style={styles.cardHeader}>Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Title..."
                        placeholderTextColor={"#bbbbbb"}
                        onChangeText={text => setTitle(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description..."
                        placeholderTextColor={"#bbbbbb"}
                        onChangeText={text => setDescription(text)}
                    />

                </View>

                <View style={[styles.card, { marginBottom: 10 }]}>
                    <Text style={styles.cardHeader}>Exercises</Text>

                    <ScrollView style={styles.excerciseContainer}>
                        {exercises.map((exercise, index) => (
                            <View key={index} style={styles.excerciseItem}>
                                <Text style={styles.excerciseItemText}>{exercise.title}</Text>
                                <View style={styles.excerciseItemIconContainer}>
                                    <Ionicons name="create" color="lightgreen" size={28} style={{ marginRight: 10, }} />
                                    <Ionicons onPress={() => handleRemoveExercise(exercise.id)} name="trash" color="red" size={28} style={{ marginRight: 10, }} />
                                </View>


                            </View>
                        ))}



                    </ScrollView>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)} >
                        <LinearGradient
                            colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                                'rgba(241, 39, 17, 0.571)',]} // Adjust the colors as per your requirement
                            style={styles.excerciseItemAddButton}
                        >
                            <Text style={styles.excerciseItemAddText}>Add Excercise</Text>
                        </LinearGradient>

                    </TouchableOpacity>


                </View>
                <TouchableOpacity onPress={handleCreate} >
                    <LinearGradient
                        colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                            'rgba(241, 39, 17, 0.571)',]} // Adjust the colors as per your requirement
                        style={[styles.excerciseItemAddButton, { marginTop: 1 }]}
                    >
                        <Text style={styles.excerciseItemAddText}>Create Workout</Text>
                    </LinearGradient>

                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* Header */}
                        <Text style={[styles.textStyle, styles.modalHeader]}>Add Exercise</Text>

                        {/* Input Fields */}
                        <TextInput
                            style={styles.modalTextInput}
                            placeholder="Exercise Title"
                            placeholderTextColor="#999" // Optional: for better visibility
                            value={newExerciseTitle}
                            onChangeText={setNewExerciseTitle}
                        />

                        {/* Buttons at the Bottom */}
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalSaveButton]}
                                onPress={() => {
                                    handleAddExercise(newExerciseTitle);
                                }}
                            >
                                <Text style={styles.textStyle}>Save Exercise</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => {
                                    setIsModalVisible(false);
                                }}
                            >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <BottomBar></BottomBar>
        </View >
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -50,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#323232",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        borderWidth: 2,
        borderColor: "#fff",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', // Set a width for the modal
    },
    modalHeader: {
        marginBottom: 20,
        fontSize: 20,
    },
    modalTextInput: {
        height: 40,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        color: '#fff', // Ensure text is visible against background
        borderColor: '#fff', // Optional: Style border
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%', // Ensure buttons span the modal width
        marginTop: 20, // Space above buttons
    },
    modalButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: '40%', // Set buttons to occupy 40% of the modal width
        justifyContent: 'center', // Center text in button
        alignItems: 'center', // Center text horizontally
    },
    modalSaveButton: {
        backgroundColor: "#2196F3",
    },
    modalCancelButton: {
        backgroundColor: "#f32121",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        color: '#fff',
        backgroundColor: '#161616',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
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
    excerciseContainer: {
        alignSelf: 'center',
        width: "90%",
        height: "34%"
    },
    excerciseItemIconContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },

    excerciseItem: {
        alignSelf: 'center',
        backgroundColor: '#161616',
        height: 60,
        width: "100%",
        borderRadius: 15,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
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

    excerciseItemText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 20,
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

export default CreateWorkoutScreen;