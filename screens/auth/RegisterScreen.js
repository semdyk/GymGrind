// /screens/RegisterScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';

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
                profilePicture: "notset",
                rank: "user",
                admin: 0,
                badges: "[]",
                theme: "dark",
                // Include any other user info you want to save
                // You can also add a createdAt field if you want to keep track of when the user was created
                createdAt: new Date()
            });

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
            <Text style={styles.title}>Brainstormr</Text>
            <Text style={styles.subtitle}>Unleash your creativity</Text>

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
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signupButton}>Sign In</Text>
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
        width: 150, // Adjust the size accordingly
        height: 150, // Adjust the size accordingly
        marginBottom: 20,
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
