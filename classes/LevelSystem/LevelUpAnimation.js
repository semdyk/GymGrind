import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // This icon set has a muscle icon


const LevelUpAnimation = ({ isVisible, onAnimationComplete, level }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0
    const levelNum = level;

    const muscleAnim = useRef(new Animated.Value(1)).current; // Start at normal size

    // Muscle pulse animation
    const pulseMuscle = () => {
        // Loop the muscle pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(muscleAnim, {
                    toValue: 0.8, // Scale down
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(muscleAnim, {
                    toValue: 1, // Scale back up
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        if (isVisible) {
            pulseMuscle(); // Start pulsing the muscle icon continuously
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.delay(2000), // Keep the view visible for 2 seconds after fading in
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                muscleAnim.stopAnimation(); // Ensure to stop the looping animation
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            });
        }
    }, [isVisible, fadeAnim, onAnimationComplete, muscleAnim]);


    return (
        <Animated.View // Animated views to animate styles
            style={{
                // Visible view
                opacity: fadeAnim, // Bind opacity to animated value
                transform: [{ scale: fadeAnim }], // Animate scale using the same animated value
                ...styles.centeredView,
                position: 'absolute', // Position it over other content
                zIndex: 1000, // Make sure it's on top
            }}
        >
            <View style={{ backgroundColor: "#000000b8", borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: "50%", height: "30%" }}>
                <LinearGradient
                    colors={['rgba(248, 45, 55, 0.797)',   // Darker red with less transparency
                        'rgba(159, 30, 16, 0.556)',]} // Gradient colors from lighter to darker orange
                    style={styles.badgeContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.levelText}>LEVEL</Text>
                    <Text style={styles.levelNumber}>{levelNum}</Text>
                    <Animated.View
                        style={{
                            marginBottom: 2,
                            transform: [{ scale: muscleAnim }], // Bind scale to muscle animation
                        }}
                    >
                        <MaterialCommunityIcons name="arm-flex" size={38} color="white" />
                    </Animated.View>
                </LinearGradient>

                <Text style={styles.levelUpText}>LEVEL UP!</Text>
            </View>

        </Animated.View>
    );
};

const styles = {
    centeredView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999, // High z-index to ensure visibility
    },
    badgeContainer: {
        // Styles for your badge container
        width: 100, // Set a fixed width
        height: 100, // Set a fixed height
        justifyContent: 'center', // Center the badge content
        alignItems: 'center', // Center the badge content
        borderRadius: 30, // Make it round
        backgroundColor: "#000",
        shadowColor: "#ff0000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.80,
        shadowRadius: 15,
        elevation: 20
    },
    levelText: {
        fontSize: 18, // Adjust the size accordingly
        marginBottom: -10,
        color: 'white', // Text color
        textAlign: 'center', // Align text in the center
    },
    levelNumber: {
        fontSize: 32, // Adjust the size accordingly
        marginBottom: -10,
        color: 'white', // Text color
        textAlign: 'center', // Align text in the center
        fontWeight: 'bold', // Bold text
    },
    levelUpText: {
        fontSize: 24, // Adjust the size accordingly
        color: 'white', // Text color
        textAlign: 'center', // Align text in the center
        marginTop: 10, // Space between the badge and text
        fontWeight: 'bold', // Bold text
    },
};

export default LevelUpAnimation;