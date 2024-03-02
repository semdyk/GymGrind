import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';

import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';

const OnboardingScreen = ({ }) => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                //navigation.navigate('Home');
                console.log(storedUser)
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                AsyncStorage.setItem('user', JSON.stringify(user));
                //navigation.navigate('Home');

            } else {
                AsyncStorage.removeItem('user');
                checkUser();
            }
        });

        return () => unsubscribe();
    }, []);


    return (
        <View style={styles.container}>
            <Image source={require('../assets/gymgrindtransparant.png')} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>GymGrind</Text>
                <Text style={styles.subtitleText}>Get ready to crush your fitness goals with GymGrind.</Text>
            </View>
            <View style={styles.buttonContainer}>

                <TouchableOpacity
                    style={styles.button2Container}
                    onPress={() => navigation.navigate('Register', { status: true })}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                            'rgba(241, 39, 17, 0.571)',]} // Adjust the colors as per your requirement
                        style={styles.start2Button}
                    >
                        <Text style={styles.buttonText}>Start</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button2Container}
                    onPress={() => navigation.navigate('Login', { status: true })}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#33323273', '#333232c4']} // Adjust the colors as per your requirement
                        style={styles.start2Button}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </LinearGradient>
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
    button2Container: {
        borderRadius: 20, // Ensure this matches your LinearGradient's borderRadius if you have one
        width: '90%',
    },
    startButton: {
        paddingVertical: 10,
        borderRadius: 20, // Ensure this matches your TouchableOpacity's borderRadius
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    start2Button: {
        paddingVertical: 10,
        marginTop: 20,
        borderRadius: 20, // Ensure this matches your TouchableOpacity's borderRadius
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    alreadyUserButton: {
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
