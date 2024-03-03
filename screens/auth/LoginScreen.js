// /screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure to install this package

import { LinearGradient } from 'expo-linear-gradient';

import { updateOnlineStatus } from '../../classes/FriendHandler';


const auth = getAuth();

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);


    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential)
            await updateOnlineStatus(userCredential.user.uid);
            //Logger.logUserAction(auth.currentUser, 'userLogin', { email: email });
            navigation.navigate('Home');
        } catch (error) {
            console.log(error.code)
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
                case 'auth/invalid-credential':
                    setError('Invalid credential. Try again.');
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
            <TouchableOpacity onPress={() => { /* Your forgot password action */ }}>
                <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>

                <TouchableOpacity
                    style={styles.button2Container}
                    onPress={() => handleLogin()}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['rgba(229, 9, 20, 0.363)',   // Darker red with less transparency
                            'rgba(241, 39, 17, 0.571)',]} // Adjust the colors as per your requirement
                        style={styles.start2Button}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
            </View>
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signupButton}>Register</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
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
        color: '#fff', // Button text color
    },
    signupButton: {
        fontSize: 16,
        color: '#fff', // Button text color
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
        color: '#fff', // Button text color
    },
});
export default LoginScreen;
