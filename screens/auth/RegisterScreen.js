// /screens/RegisterScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { getDatabase, ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';

import { db } from '../../firebase';

import { LinearGradient } from 'expo-linear-gradient';

import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure to install this package

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const auth = getAuth();


    const handleRegister = async () => {
        try {
            // Validate password
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
            if (!passwordRegex.test(password)) {
                setError('Password must be at least 6 characters long and include a symbol and a number.');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const userId = userCredential.user.uid;


            await setDoc(doc(db, "users", userId), {
                username: username,
                email: email,
                level: 1,
                xp: 1,
                profilePicture: "https://firebasestorage.googleapis.com/v0/b/gymgrind-75307.appspot.com/o/profile_pictures%2Fgymlogoprofile.png?alt=media&token=fbf5318e-536c-4601-a82d-4ffe7955c7a4",
                rank: "user",
                streak: 0,
                // Include any other user info you want to save
                // You can also add a createdAt field if you want to keep track of when the user was created
                createdAt: new Date()
            });

            const friendsCollectionRef = collection(db, "users", userId, "friends");
            const friendRequestsCollectionRef = collection(db, "users", userId, "friendRequests");

            const userStatusDatabaseRef = ref(getDatabase(), 'status/' + userId);

            // Listen for changes in the connection state
            const isOfflineForDatabase = {
                state: 'offline',
                last_changed: serverTimestamp(),
            };

            const isOnlineForDatabase = {
                state: 'online',
                last_changed: serverTimestamp(),
            };

            const connectedRef = ref(getDatabase(), '.info/connected');
            onValue(connectedRef, async (snapshot) => {
                // If we're not currently connected, don't do anything
                if (snapshot.val() === false) {
                    return;
                }

                // If we are connected, set up the disconnect operation and then set the user's status to online
                await onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase);
                set(userStatusDatabaseRef, isOnlineForDatabase);
            });

            // No need to add documents to these collections right now, they will be populated as friends are added


            navigation.navigate('Login');
        } catch (error) {
            console.log(error.message);
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('User not found. Please check your email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address. Please check your email.');
                    break;
                default:
                    setError('Login failed. Please try again later.');
                    break;
            }
        }
    };

    return (

        <View style={styles.container}>
            <Image
                source={require('../../assets/gymgrindtransparant.png')} // Replace with the path to your image
                style={styles.logo}
            />
            <Text style={styles.title}>GymGrind</Text>
            <Text style={styles.subtitle}>Crush your fitness goals!</Text>

            <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#000" />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Icon name="envelope" size={16} color="#000" />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#000" />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                />
            </View>
            <View style={styles.buttonContainer}>

                <TouchableOpacity
                    style={styles.button2Container}
                    onPress={() => handleRegister()}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                            'rgba(241, 39, 17, 0.571)',]} // Adjust the colors as per your requirement
                        style={styles.start2Button}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signupButton}>Login</Text>
                </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#161616', // Or any other background color you want
    },
    logo: {
        width: 180, // Adjust the size accordingly
        height: 150, // Adjust the size accordingly
        marginBottom: 20,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "90%",
    },
    button2Container: {
        borderRadius: 20, // Ensure this matches your LinearGradient's borderRadius if you have one
        width: "90%",
    },
    start2Button: {
        paddingVertical: 10,
        borderRadius: 20, // Ensure this matches your TouchableOpacity's borderRadius
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff', // Button text color
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff', // Button text color
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd', // Input border color
        borderRadius: 5,
        backgroundColor: '#fff', // Input background color
    },
    forgotPassword: {
        alignSelf: 'center',
        alignItems: 'center',
        fontWeight: "bold",
        justifyContent: 'center',
        color: '#fff', // Forgot password link color
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#fea500', // Button background color
        padding: 15,
        borderRadius: 25,
        marginBottom: 10,
        alignItems: "center",
        width: "80%",
    },
    buttonText: {
        color: '#fff', // Button text color
        fontSize: 18,
        fontWeight: "bold",
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signupText: {
        fontSize: 16,
        color: '#fff', // Forgot password link color
    },
    signupButton: {
        fontSize: 16,
        color: '#fff', // Forgot password link color
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        marginLeft: 10,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#fff', // Forgot password link color
    },
});

export default RegisterScreen;
