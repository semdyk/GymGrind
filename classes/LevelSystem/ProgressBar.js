import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const ProgressBar = ({ currentXP, maxXP }) => {
    const progress = (currentXP / maxXP) * 100;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(255, 54, 64, 0.591)',   // Darker red with less transparency
                    'rgba(162, 23, 8, 0.571)',]} // Adjust the colors as per your requirement
                style={[styles.progressBar, { width: `${progress}%` }]}
            >

            </LinearGradient>
            <View style={styles.textContainer}>
                <Text style={styles.progressText}>XP: {currentXP}/{maxXP}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 20,
        width: '100%',
        backgroundColor: '#161616',
        borderRadius: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#212121',
        borderRadius: 10,
    },
    textContainer: {
        position: 'absolute', // Position the text over the gradient
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
    progressText: {
        color: 'white', // Choose a color that stands out
        fontWeight: "bold",
        fontSize: 12, // Adjust the font size as needed
    },
});

export default ProgressBar;