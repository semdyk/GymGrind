import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';

import BottomBar from '../classes/BottomBar'

const OnboardingScreen = ({ }) => {
    const navigation = useNavigation();


    return (
        <View style={styles.container}>
            <Image source={require('../assets/gymgrindtransparant.png')} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>GymGrind</Text>
                <Text style={styles.subtitleText}>Get ready to crush your fitness goals with GymGrind. Let's do this!</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Register', { status: false })}>
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.startButton, styles.alreadyUserButton]} onPress={() => navigation.navigate('Login', { status: true })}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#161616',
        padding: 20,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 30, // Adjust the space above the buttons
    },
    image: {
        width: '100%',
        height: '30%',
        resizeMode: 'contain',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginHorizontal: 30,
        marginTop: 10,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#fea500',
        paddingVertical: 10,
        width: '90%', // Set the width to 90% of the container
        borderRadius: 25,
        alignSelf: 'center', // Center the button horizontally
        marginTop: 10,
    },
    alreadyUserButton: {
        backgroundColor: "#333232", // Dark button for 'Already a user?'
        marginTop: 20, // Space between the buttons
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default OnboardingScreen;
